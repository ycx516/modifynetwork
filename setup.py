# -*- coding: utf-8 -*-
from os import listdir
from os.path import abspath, isfile, join

try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

def _datafiles(dir):
    _path = join(abspath("."), dir)
    return [join(dir, f) for f in listdir(_path) if isfile(join(_path, f))]

setup(
    name='awstackhcl',
    version='0.1',
    description='',
    author='',
    author_email='',
    install_requires=[
        "pecan",
    ],
    test_suite='awstackhcl',
    zip_safe=False,
    include_package_data=True,
    packages=find_packages(exclude=['ez_setup']),
    entry_points={
        'console_scripts': [
            'awstack-hcl = awstackhcl.app:main',
        ],},
    data_files=[('/usr/lib/python2.7/site-packages/awstackhcl', ['config.py']),
                ('/usr/lib/python2.7/site-packages/awstackhcl/public/css', _datafiles("public/css")),
                ('/usr/lib/python2.7/site-packages/awstackhcl/public/js', _datafiles("public/js")),
                ('/usr/lib/python2.7/site-packages/awstackhcl/public/img', _datafiles("public/img")),
                ('/usr/lib/python2.7/site-packages/awstackhcl/public/frontend_static/', _datafiles("public/frontend_static")),
                ('/usr/lib/python2.7/site-packages/awstackhcl/public/less/', _datafiles("public/less")),
                ('/usr/lib/python2.7/site-packages/awstackhcl/public/tmpl', _datafiles("public/tmpl")),
                ('/usr/lib/python2.7/site-packages/awstackhcl/templates/', _datafiles("awstackhcl/templates"))
                ]
)
