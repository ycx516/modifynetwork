import ConfigParser
import json
import logging
import requests
import os
import sys

from awstackhcl.db.utils import Mysql

class Floatingnetwork:

    def __init__(self, request):
        self.request = request
        self.files_dir = "/usr/lib/python2.7/site-packages/awstackhcl/controllers/ansible/roles/update_db/files/"

    def alter(self, file, old_str, new_str):
        file_data = ""
        with open(file, "r") as f:
            for line in f:
                if old_str in line:
                    line = line.replace(old_str,new_str)
                file_data += line
        with open(file,"w") as f:
            f.write(file_data)

    def modify_floating_ip(self):
        try:
            mysql = Mysql('awstack_user_db')
        except:
            raise Exception
        try:
            cmd = 'select region_config_script from tb_region'
            db_region_info = mysql.get_all(cmd)
            cmd = 'select host_name, host_info, node_config_script from tb_node'
            db_node_info = mysql.get_all(cmd)
        finally:
            mysql.dispose()

            data = json.loads(db_region_info[0]['region_config_script'])
            print("=======result========")
            print(data)

            old_floating_netmask = data["floating_netmask"]
            old_floating_end = data["floating_end"]
            old_floating_start = data["floating_start"]
            old_floating_cidr = data["floating_cidr"]
            old_floating_gateway = data["floating_gateway"]
            old_floating_vlan = data.get('external_vlan')
            old_ntp_servers = data['ntp_servers']
            old_vlan_start = data["tenant_vlan_range"]["start"]
            old_vlan_end = data["tenant_vlan_range"]["end"]

            node_config_script = json.loads(db_node_info[0]['node_config_script'])
            old_ha_vlan = node_config_script.get('ha_vlan')

            for net_info in data["user_list"]:
                if net_info["name"] == "tenant":
                    old_tenant_vlan = net_info.get("vlan")

            if data:
                self.alter(self.files_dir + "modify_floating_ip.sql","old_floating_start",old_floating_start)
                self.alter(self.files_dir + "modify_floating_ip.sql","old_floating_end",old_floating_end)
                self.alter(self.files_dir + "modify_floating_ip.sql","old_floating_netmask",old_floating_netmask)
                self.alter(self.files_dir + "modify_floating_ip.sql","old_floating_cidr",old_floating_cidr)
                self.alter(self.files_dir + "modify_floating_ip.sql","old_floating_gateway",old_floating_gateway)
                self.alter(self.files_dir + "modify_floating_ip.sql","old_floating_vlan",old_floating_vlan)
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","old_ntp_servers",str(old_ntp_servers[0]))
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","old_tenant_vlan",old_tenant_vlan)
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","old_vlan_start",str(old_vlan_start))
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","old_vlan_end",str(old_vlan_end))
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","old_ha_vlan",old_ha_vlan)

                self.alter(self.files_dir + "modify_floating_ip.sql","new_floating_start",self.request["floating_start"])
                self.alter(self.files_dir + "modify_floating_ip.sql","new_floating_end",self.request["floating_end"])
                self.alter(self.files_dir + "modify_floating_ip.sql","new_floating_netmask",self.request["floating_netmask"])
                self.alter(self.files_dir + "modify_floating_ip.sql","new_floating_cidr",self.request["floating_cidr"])
                self.alter(self.files_dir + "modify_floating_ip.sql","new_floating_gateway",self.request["floating_gateway"])
                self.alter(self.files_dir + "modify_floating_ip.sql","new_floating_vlan",self.request["floating_vlan"])
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","new_ntp_servers",str(self.request["ntp_server"][0]))
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","new_tenant_vlan",self.request["tenant"]["vlan_range"])
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","new_vlan_start",str(self.request["tenant"]["vlan_start"]))
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","new_vlan_end",str(self.request["tenant"]["vlan_end"]))
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","new_ha_vlan",self.request["tenant"]["ha_vlan"])

                try:
                    os.system("bash -xe " + self.files_dir + "modify_floating_ip.sh")
                    os.system("bash -xe " + self.files_dir + "modify_vlan_and_ntp.sh")
                except Exception as e:
                    print e

                self.alter(self.files_dir + "modify_floating_ip.sql",old_floating_start+"',","old_floating_start',")
                self.alter(self.files_dir + "modify_floating_ip.sql",old_floating_end+"',","old_floating_end',")
                self.alter(self.files_dir + "modify_floating_ip.sql",old_floating_netmask+"\"',","old_floating_netmask\"',")
                self.alter(self.files_dir + "modify_floating_ip.sql",old_floating_cidr+"',","old_floating_cidr',")
                self.alter(self.files_dir + "modify_floating_ip.sql",old_floating_gateway+"',","old_floating_gateway',")
                self.alter(self.files_dir + "modify_floating_ip.sql","'\"external_vlan\":\""+old_floating_vlan+"\"',","'\"external_vlan\":\"old_floating_vlan\"',")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql",str(old_ntp_servers[0])+"',","old_ntp_servers',")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql",old_tenant_vlan+"',","old_tenant_vlan',")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","\"start\":\""+str(old_vlan_start)+"\",\"end\":\""+str(old_vlan_end)+"\"}',","\"start\":\"old_vlan_start\",\"end\":\"old_vlan_end\"}',")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","'\"vlan-start\":\""+str(old_vlan_start)+"\"',","'\"vlan-start\":\"old_vlan_start\"',")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","'\"vlan-end\":\""+str(old_vlan_end)+"\"',","'\"vlan-end\":\"old_vlan_end\"',")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","'\"ha_vlan\":\""+old_ha_vlan+"\"',","'\"ha_vlan\":\"old_ha_vlan\"',")

                self.alter(self.files_dir + "modify_floating_ip.sql",self.request["floating_start"]+"')","new_floating_start')")
                self.alter(self.files_dir + "modify_floating_ip.sql",self.request["floating_end"]+"')","new_floating_end')")
                self.alter(self.files_dir + "modify_floating_ip.sql",self.request["floating_netmask"]+"\"')","new_floating_netmask\"')")
                self.alter(self.files_dir + "modify_floating_ip.sql",self.request["floating_cidr"]+"')","new_floating_cidr')")
                self.alter(self.files_dir + "modify_floating_ip.sql",self.request["floating_gateway"]+"')","new_floating_gateway')")
                self.alter(self.files_dir + "modify_floating_ip.sql","'\"external_vlan\":\""+self.request["floating_vlan"]+"\"')","'\"external_vlan\":\"new_floating_vlan\"')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql",str(self.request["ntp_server"][0])+"')","new_ntp_servers')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql",self.request["tenant"]["vlan_range"]+"')","new_tenant_vlan')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","\"start\":\""+str(self.request["tenant"]["vlan_start"])+"\",\"end\":\""+str(self.request["tenant"]["vlan_end"])+"\"}')","\"start\":\"new_vlan_start\",\"end\":\"new_vlan_end\"}')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","'\"vlan-start\":\""+str(self.request["tenant"]["vlan_start"])+"\"')","'\"vlan-start\":\"new_vlan_start\"')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","'\"vlan-end\":\""+str(self.request["tenant"]["vlan_end"])+"\"')","'\"vlan-end\":\"new_vlan_end\"')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","'\"ha_vlan\":\""+self.request["tenant"]["ha_vlan"]+"\"')","'\"ha_vlan\":\"new_ha_vlan\"')")
                self.alter(self.files_dir + "modify_vlan_and_ntp.sql","tenant:"+str(old_vlan_start)+":"+str(old_vlan_end),"tenant:old_vlan_start:old_vlan_end")

            else:
                logging.error("The result of cloud platform is error.")
                sys.exit(1)

if __name__ == "__main__":
    request = json.loads(sys.argv[1])
    floating = Floatingnetwork(request)
    floating.modify_floating_ip()
