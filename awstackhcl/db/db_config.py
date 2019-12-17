# -*- coding: UTF-8 -*-
import ConfigParser

conf_path = "/etc/awstack-topo/awstack-topo.conf"
CONF = ConfigParser.ConfigParser()
CONF.read(conf_path)

DBHOST = CONF.get("mysql", "host")
DBPORT = int(CONF.get("mysql", "port"))
DBUSER = CONF.get("mysql", "user")
DBPWD = CONF.get("mysql", "password")
DBCHAR = "utf8"
