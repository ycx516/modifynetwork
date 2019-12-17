use awstack_user_db;

update tb_param set param_value=REPLACE(param_value, 'old_saas_ip', 'new_saas_ip');

update tb_node set node_config_script=REPLACE(node_config_script, 'old_saas_ip', 'new_saas_ip');

update tb_region set tunnel_url=REPLACE(tunnel_url, 'old_saas_ip', 'new_saas_ip');

update tb_region set region_config_script=REPLACE(region_config_script, 'old_saas_ip', 'new_saas_ip');

update tb_tunnel_iplist set ip=REPLACE(ip, 'old_saas_ip', 'new_saas_ip');

update tb_tunnel_list set ip=REPLACE(ip, 'old_saas_ip', 'new_saas_ip');

