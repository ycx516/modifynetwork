#!/usr/bin/env python
import subprocess
import json
import sys
import re


def modify_endpoint_url(endpoint_id, old_endpoint_url, old_saas_addr, new_saas_addr):
    new_enpoint_url = old_endpoint_url.replace(old_saas_addr, new_saas_addr)
    command = 'docker exec -t kolla_toolbox bash -c \'source /openrc && openstack endpoint set %s --url \"%s\"\'' % (
        endpoint_id, new_enpoint_url)
    print command
    subprocess.call(command, shell=True)


old_saas_addr = sys.argv[1]
saas_addr = sys.argv[2]
tunnel_remote_port = sys.argv[3]
openstack_endpoint_cmd = 'docker exec -t kolla_toolbox bash -c \'source /openrc && openstack endpoint list | grep %s\'' % tunnel_remote_port
openstack_endpoint = subprocess.Popen(openstack_endpoint_cmd, shell=True,
                                      stdout=subprocess.PIPE, stderr=subprocess.PIPE)
openstack_endpoint_str, _ = openstack_endpoint.communicate()
if openstack_endpoint.poll():
    sys.stderr.write('get openstack endpoint failed')
    exit(1)
else:
    openstack_endpoint_list = openstack_endpoint_str.rstrip().split('\n')
    for endpoint in openstack_endpoint_list:
        endpoint_id = endpoint.split('|')[1].strip()
        endpoint_url = endpoint.split('|')[7].strip()
        modify_endpoint_url(endpoint_id, endpoint_url,
                            old_saas_addr, saas_addr)
