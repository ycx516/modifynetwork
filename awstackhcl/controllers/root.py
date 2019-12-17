import os
import yaml
import socket
import netaddr
import ConfigParser
import json
import logging
from pecan import expose, response, conf
import requests
import sys
import subprocess
from awstackhcl.db.utils import Mysql


class RootController:

    def __init__(self):

        self.config_dir = "/usr/lib/python2.7/site-packages/awstackhcl/controllers/"
        self.inventory = '/usr/share/kolla/ansible/inventory/consul_io.py'
        self._is_login = False

    @expose(generic=True, template='index.html')
    def index(self):
        return dict()

    def _ping(self, destination):
        interval = 1
        deadline = 3
        count = 1
        cmd = 'ping -i %s -w %d -c %d %s' \
              % (str(interval), deadline, count, destination)
        return not os.system(cmd)

    def _execute(self, cmd, destination=None):
        if destination:
            cmd = ['ssh', '-o', 'BatchMode=yes', destination] + cmd
        cmd = ' '.join(cmd)
        return os.system(cmd)

    @expose(generic=True, template='json')
    def cluster_net_check(self):
        compute_nodes_path = '/etc/computeha/compute_nodes.yaml'
        with open(compute_nodes_path) as f:
            compute_nodes = yaml.load(f)

        res = dict()
        local_hostname = socket.gethostname()
        logging.info('cluster_net_check in %s', local_hostname)
        for key, value in compute_nodes.items():
            res[key] = dict()
            if key == local_hostname:
                res[key]['local'] = True
            else:
                res[key]['local'] = False
            res[key]['cluster_ip'] = value['internal_address']
            res[key]['ping_success'] = self._ping(value['internal_address'])

        return res

    @expose(generic=True, template='json')
    def health_check(self):
        logging.info('health_check')
        res = {'mysql_conn': None,
               'consul': {'ready': [],
                          'unready': []},
               'nomad': {'ready': [],
                         'unready': []}}
        try:
            mysql = Mysql('awstack_user_db')
        except Exception as e:
            logging.error('connect mysql error: %s', e)
            res['mysql_conn'] = False
        else:
            mysql.dispose()
            res['mysql_conn'] = True

        try:
            url = 'http://127.0.0.1:4646/v1/nodes'
            result = requests.get(url, timeout=5).json()
            nomad = {}
            for r in result:
                if r.get('Name') in nomad.keys():
                    if nomad[r.get('Name')]['CreateIndex'] > int(
                            r.get('CreateIndex')):
                        continue
                if r.get('Status') == 'ready':
                    nomad[r.get('Name')] = {
                        'Status': True,
                        'CreateIndex': int(r.get('CreateIndex'))}
                else:
                    nomad[r.get('Name')] = {
                        'Status': False,
                        'CreateIndex': int(r.get('CreateIndex'))}

            for node in nomad.keys():
                if nomad[node].get('Status'):
                    res['nomad']['ready'].append(node)
                else:
                    res['nomad']['unready'].append(node)

        except Exception as e:
            logging.error('get nomad node error: %s', e)
            res['nomad'] = False

        try:
            url = 'http://127.0.0.1:8500/v1/agent/members'
            result = requests.get(url, timeout=5).json()
            for r in result:
                if r.get('Status') == 1:
                    res['consul']['ready'].append(r.get('Name'))
                else:
                    res['consul']['unready'].append(r.get('Name'))
        except Exception as e:
            logging.error('get consul status error: %s', e)
            res['consul'] = False

        return res

    @expose(method='POST', template='json')
    def login(self, request, **kw):
        logging.info('login...')
        login_info_path = '/etc/kolla/openrc'
        username = password = None
        with open(login_info_path) as f:
            for info in f.readlines():
                if 'OS_USERNAME' in info:
                    username = info.split('=')[1][:-1]
                elif 'OS_PASSWORD' in info:
                    password = info.split('=')[1][:-1]
            body = json.loads(request)
            if body.get('username') == username \
                    and body.get('password') == password:
                self._is_login = True
                logging.info('login success')
            else:
                self._is_login = False
                logging.info('login fail')
            return self._is_login

    @expose(generic=True, template='json')
    def get_info(self):
        try:
            mysql = Mysql('awstack_user_db')
        except Exception as e:
            logging.error('connect mysql error: %s', e)
            raise e
        try:
            cmd = 'select host_name, host_info, node_config_script from tb_node'
            db_node_info = mysql.get_all(cmd)
            cmd = 'select region_config_script from tb_region'
            db_region_info = mysql.get_all(cmd)
        finally:
            mysql.dispose()

        res = dict()
        ntp_server = None
        ha_vlan = None
        res['mgmt'] = {}
        for info in db_node_info:
            host_name = info['host_name']
            host_info = json.loads(info['host_info'])
            res['mgmt'][host_name] = {
                'ip': host_info.get('ip'),
                'vlan': host_info.get('vlan_id')
            }
            if not ntp_server or not ha_vlan:
                node_config_script = json.loads(info['node_config_script'])
                ntp_server = node_config_script['ntp_servers']
                ha_vlan = node_config_script.get('ha_vlan')

        db_region_info = json.loads(db_region_info[0]['region_config_script'])
        res['public'] = {
            'cidr': db_region_info.get('floating_cidr'),
            'netmask': str(netaddr.IPNetwork(
                db_region_info.get('floating_cidr')).netmask),
            'ip_start': db_region_info.get('floating_start'),
            'ip_end': db_region_info.get('floating_end'),
            'gateway': db_region_info.get('floating_gateway'),
            'vlan': db_region_info.get('external_vlan')
        }

        for net in db_region_info['user_list']:
            if net['name'] == 'tenant':
                res['tenant'] = {
                    'vlan_range': net.get('vlan'),
                    'network_type': net.get('vlanType'),
                    'ha_vlan': ha_vlan
                }
                break

        res['ntp_server'] = ntp_server

        settings_file = '/var/lib/awstack/reg_config'
        with open(settings_file) as infile:
            settings = json.loads(infile.read())
        res['saas_ip'] = settings.get('saas_address')
        res['netmask'] = settings.get('netmask')
        res['gateway'] = settings.get('gateway')
        res['dns'] = settings.get('dns')

        return res

    @expose(generic=True, template='json')
    def shutdown_nodes(self):
        compute_nodes_path = '/etc/computeha/compute_nodes.yaml'
        with open(compute_nodes_path) as f:
            compute_nodes = yaml.load(f)
        local_hostname = socket.gethostname()

        for key, value in compute_nodes.items():
            if key == local_hostname:
                continue
            logging.info('shutdown %s', value['internal_address'])
            self._execute(['shutdown'], value['internal_address'])
        logging.info('shutdown localhost')
        self._execute(['shutdown'])

    @expose(generic=True, template='json')
    def network_check(self):
        compute_nodes_path = '/etc/computeha/compute_nodes.yaml'
        with open(compute_nodes_path) as f:
            compute_nodes = yaml.load(f)

        res = dict()
        local_hostname = socket.gethostname()
        logging.info('cluster_net_check in %s', local_hostname)
        for key, value in compute_nodes.items():
            res[key] = dict()
            if key == local_hostname:
                res[key]['local'] = True
            else:
                res[key]['local'] = False
            res[key]['cluster'] = dict()
            res[key]['cluster']['ip'] = value['internal_address']
            res[key]['cluster']['ping_success'] = self._ping(
                value['internal_address'])

            res[key]['mgmt'] = dict()
            res[key]['mgmt']['ip'] = value['public_address']
            res[key]['mgmt']['ping_success'] = self._ping(
                value['public_address'])

            res[key]['storage'] = dict()
            res[key]['storage']['ip'] = value['storage_address']
            res[key]['storage']['ping_success'] = self._ping(
                value['storage_address'])

            res[key]['tenant'] = dict()
            res[key]['tenant']['ip'] = value['private_address']
            res[key]['tenant']['ping_success'] = self._ping(
                value['private_address'])

        return res

    @expose(generic=True, template='json')
    def getname(self):
        return self.get_hostname()

    @expose(method='POST', template='json')
    def modify(self, request, **kw):
        if not self._is_login:
            raise Exception

        self.records = request.replace('"', '\"')
        logging.info('modify request: %s', request)
        self.request = json.loads(request)
        update_db = self.update_db()
        if update_db:
            update_ip = self.update_ip_addr()
            if update_ip:
                return True
            else:
                raise Exception
        else:
            raise Exception


    def get_hostname(self):
        try:
            mysql = Mysql('awstack_user_db')
        except:
            raise Exception
        try:
            cmd = 'select region_config_script from tb_region'
            db_region_info = mysql.get_all(cmd)
        finally:
            mysql.dispose()
        data = json.loads(db_region_info[0]['region_config_script'])
        hostnames = data["registered_hosts"]
        return hostnames

    def update_db(self):
        playbook = self.config_dir + 'ansible/update_db.yml'
        command = "ansible-playbook -i %s --flush-cache -e 'request=%s' %s" % (self.inventory, self.records, playbook)
        p = subprocess.Popen(command, shell=True,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        stdoutdata, stderrdata = p.communicate(input=None)
        logging.info('update_db stdoutdata: %s', stdoutdata)
        if p.returncode != 0:
            logging.error("Run ansible got unexpect error, update db failed")
            logging.error('Error from update_db is: %s', stderrdata)
            return False
        else:
            return True

    def update_ip_addr(self):
        playbook = self.config_dir + 'ansible/modify_configuration.yml'
        command = "ansible-playbook -i %s --flush-cache -e 'request=%s' %s" % (self.inventory, self.records, playbook)
        p = subprocess.Popen(command, shell=True,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        stdoutdata, stderrdata = p.communicate(input=None)
        logging.info('update_ip stdoutdata: %s', stdoutdata)
        if p.returncode != 0:
            logging.error("Run ansible got unexpect error, update ip failed")
            logging.error('Error from update_ip is: %s', stderrdata)
            return False
        else:
            return True
