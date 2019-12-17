import json
import os
import re
import subprocess
import sys

class Mgmtnetwork:
    reg_config = {
        'saas_address': '192.168.140.117',
        'saas_install': False,
        'netaddr': '192.168.140.116',
        'code': 'FFFFF',
        'url': 'http://192.168.140.117',
        'dns': '114.114.114.114',
        'netmask': '255.255.240.0',
        'gateway': '192.168.128.1',
        'fault_domain1': '',
        'fault_domain2': '',
        'fault_domain3': '',
        'vlan_id': 0,
        'interface_device': 'enp5s0f1'
    }
    def __init__(self, request):
        #self.hostname = ""
        self.request = request
        self.register_conf = "/var/lib/awstack/reg_config"
        with open(self.register_conf, 'r') as f:
            self.reg_config.update(json.load(f))
        #self.hostname_conf = "/etc/hostname"
        #with open(self.hostname_conf, 'r') as f:
            #self.hostname = f.read().rstrip('\n')
        self.files_dir = "/usr/lib/python2.7/site-packages/awstackhcl/controllers/ansible/roles/update_db/files/"

    def alter(self,file,old_str,new_str):
        file_data = ""
        with open(file, "r") as f:
            for line in f:
                if old_str in line:
                    line = line.replace(old_str,new_str)
                file_data += line
        with open(file,"w") as f:
            f.write(file_data)

    def read_ip_config(self):
        inventory_file = "/usr/share/kolla/ansible/inventory/consul_io.py"
        sub_cmd = "cat /var/lib/awstack/reg_config"
        p = subprocess.Popen(
                ['ansible',
                 '-i', inventory_file,
                 'all',
                 '-m', 'command',
                 '-a', sub_cmd],
                 stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # Get the ansible output
        stdoutdata, stderrdata = p.communicate(input=None)

        self.output = {}
        node_start = re.compile('>>')
        for line in stdoutdata.splitlines():
            if node_start.search(line):
                node_info = re.split(' ', line)
                node_name = node_info[0]
                continue

            dest_info = json.loads(line)
            self.output[node_name] = dest_info['netaddr']
            self.vlan_id = dest_info['vlan_id']

    def modify_mgmt_ip(self):
        for mgmt in self.request["mgmt"]:
            if mgmt["hostname"] in self.output:
                mgmt_addr = mgmt["ipaddr"]
                new_vlan_id =  mgmt["vlan_id"]
                old_mgmt_addr = self.output.get(mgmt["hostname"])
                old_vlan_id = self.vlan_id
                self.alter(self.files_dir + "modify_mgmt_ip.sql","hostname",mgmt["hostname"])
                self.alter(self.files_dir + "modify_mgmt_ip.sql","old_mgmt_ip",old_mgmt_addr)
                self.alter(self.files_dir + "modify_mgmt_ip.sql","new_mgmt_ip",mgmt_addr)
                self.alter(self.files_dir + "modify_mgmt_ip.sql","old_vlan_id",str(old_vlan_id))
                self.alter(self.files_dir + "modify_mgmt_ip.sql","new_vlan_id",str(new_vlan_id))
                try:
                    os.system("bash -xe "+self.files_dir+"modify_mgmt_ip.sh")
                except Exception as e:
                    print e
                self.alter(self.files_dir + "modify_mgmt_ip.sql",mgmt["hostname"],"hostname")
                self.alter(self.files_dir + "modify_mgmt_ip.sql","'"+old_mgmt_addr+"',","'old_mgmt_ip',")
                self.alter(self.files_dir + "modify_mgmt_ip.sql","'"+mgmt_addr+"')","'new_mgmt_ip')")
                self.alter(self.files_dir + "modify_mgmt_ip.sql","'\"vlan_id\":"+str(old_vlan_id)+"',", "'\"vlan_id\":old_vlan_id',")
                self.alter(self.files_dir + "modify_mgmt_ip.sql","'\"vlan_id\":"+str(new_vlan_id)+"')", "'\"vlan_id\":new_vlan_id')")

if __name__ == "__main__":
    request = json.loads(sys.argv[1])
    mgmt = Mgmtnetwork(request)
    mgmt.read_ip_config()
    mgmt.modify_mgmt_ip()
