resource "cloudflare_dns_record" "dns1" {
  provider = cloudflare
  zone_id  = var.cloudflare_zone_id
  name     = "foundation_project"
  type     = "A"
  proxied  = true
  ttl      = 1
  content  = digitalocean_droplet.server-1.ipv4_address
  comment  = "Domain verification record"
}
