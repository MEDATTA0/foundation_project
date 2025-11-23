data "digitalocean_ssh_key" "DigitalOcean" {
  name = "DigitalOcean"
}

resource "digitalocean_droplet" "server-1" {
  name     = "server-1"
  region   = "lon1"
  size     = "s-1vcpu-1gb"
  image    = "ubuntu-24-04-x64"
  ssh_keys = [data.digitalocean_ssh_key.DigitalOcean.id]
}

resource "local_file" "ansible_inventory" {
  content  = templatefile("${path.module}/inventory.tpl", { ip = digitalocean_droplet.server-1.ipv4_address })
  filename = "${path.module}/inventory.ansible.yaml"
}
