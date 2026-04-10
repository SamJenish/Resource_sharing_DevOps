output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.kubernetes.id
}

output "instance_public_ip" {
  description = "EC2 instance public IP"
  value       = aws_instance.kubernetes.public_ip
}

output "instance_dns" {
  description = "EC2 instance public DNS"
  value       = aws_instance.kubernetes.public_dns
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.main.id
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "Subnet ID"
  value       = aws_subnet.public.id
}

output "ssh_command" {
  description = "SSH command to connect to instance"
  value       = "ssh -i smart-resource-key.pem ubuntu@${aws_instance.kubernetes.public_ip}"
}
