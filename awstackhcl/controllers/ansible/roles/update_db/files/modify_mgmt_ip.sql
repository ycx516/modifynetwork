use awstack_user_db;

update tb_node set host_info=REPLACE(host_info, 'old_mgmt_ip', 'new_mgmt_ip') where host_name = 'hostname';
update tb_node set host_info=REPLACE(host_info, '"vlan_id":old_vlan_id', '"vlan_id":new_vlan_id') where host_name = 'hostname';
