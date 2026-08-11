# ----------------- RG -----------------
variable "resource_group_name" {
  type        = string
  description = "Resource group name for Azure"
}

variable "resource_group_location" {
  type        = string
  description = "Name of the Azure region where the resource group will be created"
}

# ----------------- NETWORK -----------------
# ----------------- NSG -----------------
variable "network_security_group_name" {
  type        = string
  description = "Name of the Azure Network Security Group"
}

variable "allowed_ip_address" {
  type        = string
  description = "IP address allowed to access the VM"
}

# ----------------- VNET -----------------
variable "virtual_network_name" {
  type        = string
  description = "Name of the Azure Virtual Network"
}

# ----------------- Subnet -----------------
variable "subnet_name" {
  type        = string
  description = "Name of the Azure Subnet"
}

# ----------------- PIP -----------------
variable "public_ip_name" {
  type        = string
  description = "Name of the Azure Public IP"
}

variable "domain_name_label" {
  type        = string
  description = "Domain name label for the Azure Public IP"
}

# ----------------- NIC -----------------
variable "network_interface_name" {
  type        = string
  description = "Name of the Azure Network Interface"
}

# ----------------- VM -----------------
variable "vm_name" {
  type        = string
  description = "Name of the Azure Virtual Machine"
}

variable "vm_size" {
  type        = string
  description = "Size of the Azure Virtual Machine"
  default     = "Standard_B2ats_v2"
}

variable "vm_admin_username" {
  type        = string
  description = "Admin username for the Azure Virtual Machine"
}

# ----------------- Prometheus -----------------
variable "prometheus_disk_name" {
  type        = string
  description = "Managed disk name for Prometheus TSDB"
}

variable "prometheus_disk_size_gb" {
  type        = number
  description = "Prometheus data disk size in GB"
  default     = 64
}

variable "prometheus_disk_sku" {
  type        = string
  description = "Prometheus data disk SKU"
  default     = "StandardSSD_LRS"
}
