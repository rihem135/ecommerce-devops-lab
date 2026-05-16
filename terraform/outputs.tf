output "instance_public_ips" {
  value       = aws_instance.web[*].public_ip
  description = "IPs publiques des EC2, utilisées par Ansible"
}

output "alb_dns_name" {
  value       = aws_lb.alb.dns_name
  description = "DNS de l'ALB pour accéder à l'application"
}
