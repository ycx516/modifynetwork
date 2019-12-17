#!/bin/sh

clear_dir(){
    for file in /home/admin/mysql_data/*; do
        if [ -f $file ]; then
          continue
        fi
        today=$(date -d '7 days ago' +%Y%m%d)
        currfile=${file##*/}
        currfiledate=$(date -d "$currfile" +%Y%m%d)
        if [ $today -gt $currfiledate ]; then
          rm -rf $file
        fi
    done
}

currdate=$(date +%Y%m%d)
data_path=/home/admin/mysql_data/$currdate
passwd=`cat /etc/kolla/nomad/saas-container.hcl | grep -E "^* PASSWORD" | sed 's/.*PASSWORD="//g' | sed 's/"//g'`
mkdir -p $data_path
mysqldump -uroot -p$passwd awstack_user_db > $data_path/awstack_user_db.sql
