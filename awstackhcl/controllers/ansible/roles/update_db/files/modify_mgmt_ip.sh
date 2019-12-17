passwd=`cat /etc/kolla/nomad/saas-container.hcl | grep -E "^* PASSWORD" | sed 's/.*PASSWORD="//g' | sed 's/"//g'`
mysql -uroot -p$passwd -e "source /usr/lib/python2.7/site-packages/awstackhcl/controllers/ansible/roles/update_db/files/modify_mgmt_ip.sql"
sleep 2s
echo "Modify the mgmt ip complete!"
exit 1
