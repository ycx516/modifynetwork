import logging
import subprocess
import sys

def run_ansible():
    vault_pass = ''.join([
        'a', 'C', '0', 'z', 'Z', 'b', 'o', 'k', 'B', 'B', 'V', '2', 'q',
        'Y', 'V', 'O', 'F', '2', 'k', 'r', 'L', 'Z', 'S', '2', 'B', 'O',
        'm', 'j', 'P', '5', 'R', 'w', 's', 'w', 'y', 's', 'y', 'Z', 's',
        'q', 'I', '6', '0', 'A', 'J', '7', '1', 'q', 'f', 'd', '8', '9',
        'G', 'U', '6', 'A', 'W', 'Y', 'y', 'i', 'h', 'v', 'x', 'S', 'y',
        'j', '3', '2', 'f', 'z', 'G', 'A', 'z', '8', 'P', 'B', 'z', 'q',
        'f', 'b', 'G', 'b', 'B', 'H', '5', 'L', 'A', 'J', 'Y', 'E', 'F',
        '4', 'I', 's', 'd', '1', '7', 'Y', 'Q', 'x', 'x', 'b', 'b', 'p',
        '3', 'S', '5', '3', '2', 'O', 'N', 'm', 'K', 'p', 'H', 'i', 'n',
        'z', 'I', 'b', 'H', 'Y', 'k', 'n', '6', 'g', 'Q', 'L'])
    playbook = '/usr/share/kolla/ansible/awstack-computeha.yml'
    files_dir = "/usr/lib/python2.7/site-packages/awstackhcl/controllers/ansible/roles/modify_mgmt_ip/files/"
    vault_pass_dir = files_dir + "vault_pass.txt"
    with open(vault_pass_dir, 'w') as f:
         f.write(vault_pass)

if __name__ == "__main__":
    run_ansible()
