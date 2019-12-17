import ConfigParser
import json
import logging
import os
import sys
import subprocess

class MgmtNetwork:

    def __init__(self, request):
        self.reg_config = {}
        self.request = request
        self.config_dir = "/etc/awstack-register/"
        self.config_json_dir = self.config_dir + "ansible/roles/register/vars"
        self.hostname_conf = "/etc/hostname"
        self.common_conf_file = "/etc/awstack.conf"
        self.common_conf = ConfigParser.ConfigParser()
        self.common_conf.read(self.common_conf_file)
        with open(self.hostname_conf, 'r') as f:
            self.hostname = f.read().rstrip('\n')
        self.register_conf = "/var/lib/awstack/reg_config"
        with open(self.register_conf, 'r') as f:
            self.reg_config.update(json.load(f))

    def save_register_conf(self, name, network):
        with open(self.config_json_dir + "/" + name, 'w') as f:
            json.dump(network, f)

    def run_ansible(self, action):
        logging.info("start mgmt_network_ansible")
        playbook = self.config_dir + 'ansible/register.yml'
        command = "ansible-playbook --flush-cache -e 'action=%s' -e 'awstackhcl=True' -e 'initialize=False' -e 'networkcheck=True' %s" % (action, playbook)
        ret_code = subprocess.call(command, shell=True, stdout=open('/dev/null','w'), \
          stderr=subprocess.STDOUT)
        if ret_code != 0:
            logging.error("Run ansible got unexpect error, action=%s." % action)
            sys.exit(1)

    def alter(self,file,old_str,new_str):
        file_data = ""
        with open(file, "r") as f:
            for line in f:
                if old_str in line:
                    line = line.replace(old_str,new_str)
                file_data += line
        with open(file,"w") as f:
            f.write(file_data)

    def config_mgmt(self):
        old_mgmt_addr = self.reg_config["netaddr"]
        for mgmt in self.request["mgmt"]:
            if mgmt["hostname"] == self.hostname:
                mgmt_addr = mgmt["ipaddr"]
                mgmt = {'nic_name': self.common_conf.get("network", "mgmt_logical"),
                        'role': "mgmt", 'ipaddr': mgmt_addr,
                        'netmask': self.request["mgmt_netmask"],
                        'gateway': self.request["mgmt_gateway"],
                        'dns': self.request["mgmt_dns"],
                        'vlan_id': mgmt["vlan_id"]}
                if mgmt.get("vlan_id")  and mgmt.get("vlan_id") != 0:
                    mgmt['vlan'] = True
                    mgmt['vlan_id'] = int(mgmt.get("vlan_id"))
                else:
                    mgmt['vlan'] = False
                    mgmt['vlan_id'] = 0
                self.save_register_conf("mgmt_network.json", mgmt)

                self.alter(self.register_conf, old_mgmt_addr, mgmt_addr)
                self.alter(self.register_conf, self.reg_config["netmask"], self.request["mgmt_netmask"])
                self.alter(self.register_conf, self.reg_config["saas_address"], self.request["saas_addr"])
                self.alter(self.register_conf, self.reg_config["dns"], self.request["mgmt_dns"])
                self.alter(self.register_conf, self.reg_config["gateway"], self.request["mgmt_gateway"])
                self.alter(self.register_conf, "\"vlan_id\": " + str(self.reg_config["vlan_id"]), "\"vlan_id\": " + str(mgmt['vlan_id']))

                self.run_ansible("network_mgmt")

if __name__ == "__main__":
    request = json.loads(sys.argv[1])
    mgmt = MgmtNetwork(request)
    mgmt.config_mgmt()

