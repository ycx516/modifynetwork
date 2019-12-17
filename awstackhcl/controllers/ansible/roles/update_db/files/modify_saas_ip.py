import json
import logging
import os
import sys

class Saasnetwork:

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
        self.request = request
        self.register_conf = "/var/lib/awstack/reg_config"
        with open(self.register_conf, 'r') as f:
            self.reg_config.update(json.load(f))
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

    def modify_saas_ip(self):
        old_saas_addr = self.reg_config["saas_address"]
        saas_addr = self.request["saas_addr"]
        self.alter(self.files_dir + "modify_saas_ip.sql","old_saas_ip",old_saas_addr)
        self.alter(self.files_dir + "modify_saas_ip.sql","new_saas_ip",saas_addr)
        try:
            os.system("bash -xe " + self.files_dir + "modify_saas_ip.sh")
        except Exception as e:
            print e
        self.alter(self.files_dir + "modify_saas_ip.sql","'"+old_saas_addr+"',","'old_saas_ip',")
        self.alter(self.files_dir + "modify_saas_ip.sql","'"+saas_addr+"')","'new_saas_ip')")

if __name__ == "__main__":
    request = json.loads(sys.argv[1])
    saas = Saasnetwork(request)
    saas.modify_saas_ip()

