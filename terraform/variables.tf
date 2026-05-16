variable "aws_region" {
  default = "us-east-1"
}

variable "key_name" {
  description = "Nom de ta paire de clés SSH AWS"
  type        = string
}

variable "instance_count" {
  default = 2
}
