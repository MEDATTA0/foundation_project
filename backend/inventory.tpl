---
all:
  hosts:
    ${ip}:
      ansible_user: root
      ansible_ssh_private_key_file: ./ssh_key
  children:
    servers:
      hosts:
        ${ip}: {}
