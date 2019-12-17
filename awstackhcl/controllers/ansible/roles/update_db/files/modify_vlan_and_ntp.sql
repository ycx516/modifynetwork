use awstack_user_db;

update tb_region set region_config_script=REPLACE(region_config_script, 'old_ntp_servers', 'new_ntp_servers');
update tb_node set node_config_script=REPLACE(node_config_script, 'old_ntp_servers', 'new_ntp_servers');

update tb_region set region_config_script=REPLACE(region_config_script, 'old_tenant_vlan', 'new_tenant_vlan');
update tb_region set region_config_script=REPLACE(region_config_script,'"tenant_vlan_range":{"start":"old_vlan_start","end":"old_vlan_end"}','"tenant_vlan_range":{"start":"new_vlan_start","end":"new_vlan_end"}');
update tb_node set node_config_script=REPLACE(node_config_script, '"vlan-start":"old_vlan_start"', '"vlan-start":"new_vlan_start"');
update tb_node set node_config_script=REPLACE(node_config_script, '"vlan-end":"old_vlan_end"', '"vlan-end":"new_vlan_end"');
update tb_node set node_config_script=REPLACE(node_config_script, '"ha_vlan":"old_ha_vlan"', '"ha_vlan":"new_ha_vlan"');

use awstack_resource_db;

DELETE FROM tb_network_setting WHERE network_name = 'tenant:old_vlan_start:old_vlan_end';
