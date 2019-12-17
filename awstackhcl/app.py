import logging
import eventlet
from eventlet import wsgi
from pecan import make_app
from awstackhcl import model
import config
import fcntl
import socket
import struct

# from wsgiref import simple_server

LOG_FILE = "/var/log/awstack-hcl.log"


def setup_app(conf):

    model.init_model()
    app_conf = dict(conf.app)

    return make_app(
        app_conf.pop('root'),
        **app_conf
    )


def get_ip_address(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,
        struct.pack('256s', ifname[:15]))[20:24])


def main():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        filename=LOG_FILE)

    cluster_ip = get_ip_address('br_cluster')
    application = setup_app(config)
    sock = eventlet.listen((cluster_ip, int(config.server['port'])))
    wsgi.server(sock, application)
    # srv = simple_server.make_server('', 8080, application)
    # srv.serve_forever()
