import ConfigParser
import json
import sys

from awstackhcl.db.utils import Mysql

class SetIp:

    def __init__(self, request):

        self.request = request
        self.reg_config = {}
        self.config_dir = "/usr/lib/python2.7/site-packages/awstackhcl/controllers/"
        self.ip_json_dir = self.config_dir + "ansible/roles/set_local_ip/vars"
        self.saas_json_dir = self.config_dir + "ansible/roles/modify_saas_ip/vars"
        self.hostname_conf = "/etc/hostname"

        self.register_conf = "/var/lib/awstack/reg_config"
        with open(self.register_conf, 'r') as f:
            self.reg_config.update(json.load(f))

        with open(self.hostname_conf, 'r') as f:
            self.hostname = f.read().rstrip('\n')

        try:
            mysql = Mysql('awstack_user_db')
        except:
            raise Exception
        try:
            cmd = 'select region_config_script from tb_region'
            db_region_info = mysql.get_all(cmd)
            self.db_config = json.loads(db_region_info[0]['region_config_script'])
        finally:
            mysql.dispose()

    def set_ip_addr(self):
        old_mgmt_addr = self.reg_config["netaddr"]
        for mgmt in self.request["mgmt"]:
            if mgmt["hostname"] == self.hostname:
                mgmt_addr = mgmt["ipaddr"]
                vlan_id = mgmt["vlan_id"]
                ip_addr = {"old_saas_addr": self.reg_config["saas_address"],
                           "saas_addr": self.request["saas_addr"],
                           "old_mgmt_addr": old_mgmt_addr, "mgmt_addr": mgmt_addr,
                           "old_netmask": self.reg_config["netmask"],
                           "netmask": self.request["mgmt_netmask"],
                           "old_gateway":self.reg_config["gateway"],
                           "gateway": self.request["mgmt_gateway"],
                           "old_vlan_id": self.reg_config["vlan_id"],"vlan_id": vlan_id,
                           "floating_start": self.request["floating_start"],
                           "floating_end": self.request["floating_end"],
                           "floating_netmask": self.request["floating_netmask"],
                           "floating_cidr": self.request["floating_cidr"],
                           "floating_gateway": self.request["floating_gateway"],
                           "floating_vlan": self.request.get("floating_vlan"),
                           "network_type": self.request["tenant"]["network_type"],
                           "vlan_start": self.request["tenant"]["vlan_start"],
                           "vlan_end": self.request["tenant"]["vlan_end"],
                           "ntp_servers": self.request["ntp_server"][0],
                           "old_ntp_servers": self.db_config["ntp_servers"][0],
                           "ha_vlan": self.request["tenant"]["ha_vlan"]}

                with open(self.ip_json_dir + "/ip_addr.json", 'w') as f:
                    json.dump(ip_addr, f)
                with open(self.saas_json_dir + "/ip_addr.json", 'w') as f:
                    json.dump(ip_addr, f)

if __name__ == "__main__":
    request = json.loads(sys.argv[1])
    setip = SetIp(request)
    setip.set_ip_addr()
