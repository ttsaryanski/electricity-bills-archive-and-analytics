output "rg_name" {
  value = azurerm_resource_group.arg.name
}

output "vm_name" {
  value = azurerm_linux_virtual_machine.app-vm.name
}

output "vm_public_ip" {
  value = azurerm_public_ip.app-pip.ip_address
}

output "ssh" {
  value = "ssh ${var.vm_admin_username}@${azurerm_public_ip.app-pip.ip_address}"
}

output "prometheus_disk_id" {
  value = azurerm_managed_disk.prometheus_data_disk.id
}

