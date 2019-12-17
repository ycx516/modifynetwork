use awstack_user_db;

update tb_region set region_config_script=REPLACE(region_config_script, 'old_floating_end', 'new_floating_end');
update tb_region set region_config_script=REPLACE(region_config_script, 'old_floating_start', 'new_floating_start');
update tb_region set region_config_script=REPLACE(region_config_script, 'old_floating_cidr', 'new_floating_cidr');
update tb_region set region_config_script=REPLACE(region_config_script, '"floating_netmask":"old_floating_netmask"', '"floating_netmask":"new_floating_netmask"');
update tb_region set region_config_script=REPLACE(region_config_script, 'old_floating_gateway', 'new_floating_gateway');
update tb_region set region_config_script=REPLACE(region_config_script,'"external_vlan":"old_floating_vlan"', '"external_vlan":"new_floating_vlan"');

update tb_region set ip_range=REPLACE(ip_range, 'old_floating_start', 'new_floating_start');
update tb_region set ip_range=REPLACE(ip_range, 'old_floating_end', 'new_floating_end');
update tb_region set ip_range=REPLACE(ip_range, '"floating":{"netmask":"old_floating_netmask"', '"floating":{"netmask":"new_floating_netmask"');
