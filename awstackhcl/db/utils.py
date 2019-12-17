# -*- coding: UTF-8 -*-
import MySQLdb
from MySQLdb.cursors import DictCursor
from DBUtils.PooledDB import PooledDB
from awstackhcl.db import db_config


class Mysql(object):

    _pool = None

    def __init__(self, db):
        self._conn = Mysql._get_conn(db)
        self._cursor = self._conn.cursor()

    @staticmethod
    def _get_conn(db):
        if Mysql._pool is None:
            _pool = PooledDB(creator=MySQLdb, mincached=1, maxcached=20,
                             host=db_config.DBHOST, port=db_config.DBPORT,
                             user=db_config.DBUSER, passwd=db_config.DBPWD,
                             db=db, use_unicode=False, charset=db_config.DBCHAR,
                             cursorclass=DictCursor)
        return _pool.connection()

    def get_all(self, sql, param=None):
        if param is None:
            count = self._cursor.execute(sql)
        else:
            count = self._cursor.execute(sql, param)
        if count > 0:
            result = self._cursor.fetchall()
        else:
            result = False
        return result

    def begin(self):
        self._conn.autocommit(0)

    def end(self, option='commit'):
        if option == 'commit':
            self._conn.commit()
        else:
            self._conn.rollback()

    def dispose(self, is_end=1):

        if is_end == 1:
            self.end('commit')
        else:
            self.end('rollback')
        self._cursor.close()
        self._conn.close()

