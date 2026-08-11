terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.66.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# ----------------- RG -----------------
resource "azurerm_resource_group" "arg" {
  name     = var.resource_group_name
  location = var.resource_group_location

  tags = {
    project = "PowerTrack"
    env     = "Production"
  }
}

# ----------------- NETWORK -----------------
# ----------------- NSG -----------------
resource "azurerm_network_security_group" "nsg" {
  name                = var.network_security_group_name
  location            = azurerm_resource_group.arg.location
  resource_group_name = azurerm_resource_group.arg.name

  security_rule {
    name                       = "ssh"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.allowed_ip_address
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "http"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "https"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    project = "PowerTrack"
    env     = "Production"
  }
}

# ----------------- VNET -----------------
resource "azurerm_virtual_network" "vnet" {
  name                = var.virtual_network_name
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.arg.location
  resource_group_name = azurerm_resource_group.arg.name

  tags = {
    project = "PowerTrack"
    env     = "Production"
  }
}

# ----------------- Subnet -----------------
resource "azurerm_subnet" "vsnet" {
  name                 = var.subnet_name
  resource_group_name  = azurerm_resource_group.arg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]

}

# ----------------- PIP -----------------
resource "azurerm_public_ip" "app-pip" {
  name                = var.public_ip_name
  location            = azurerm_resource_group.arg.location
  resource_group_name = azurerm_resource_group.arg.name
  allocation_method   = "Static"
  sku                 = "Standard"
  domain_name_label   = var.domain_name_label

  tags = {
    project = "PowerTrack"
    env     = "Production"
  }
}

# ----------------- NIC -----------------
resource "azurerm_network_interface" "app-nic" {
  name                = var.network_interface_name
  location            = azurerm_resource_group.arg.location
  resource_group_name = azurerm_resource_group.arg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.vsnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.app-pip.id
  }

  tags = {
    project = "PowerTrack"
    env     = "Production"
  }
}

# ----------------- NIC NSG Association -----------------
resource "azurerm_network_interface_security_group_association" "nic-nsg-assoc" {
  network_interface_id      = azurerm_network_interface.app-nic.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

# ----------------- VM -----------------
resource "azurerm_linux_virtual_machine" "app-vm" {
  name                            = var.vm_name
  resource_group_name             = azurerm_resource_group.arg.name
  location                        = azurerm_resource_group.arg.location
  size                            = var.vm_size
  disable_password_authentication = true
  admin_username                  = var.vm_admin_username

  network_interface_ids = [azurerm_network_interface.app-nic.id]

  admin_ssh_key {
    username   = var.vm_admin_username
    public_key = file(pathexpand("~/.ssh/azure_powertrack.pub"))
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "StandardSSD_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }

  identity {
    type = "SystemAssigned"
  }

  boot_diagnostics {}

  tags = {
    project = "PowerTrack"
    env     = "Production"
  }
}

# ----------------- Prometheus disk -----------------
resource "azurerm_managed_disk" "prometheus_data_disk" {
  name                 = var.prometheus_disk_name
  location             = azurerm_resource_group.arg.location
  resource_group_name  = azurerm_resource_group.arg.name
  storage_account_type = var.prometheus_disk_sku
  create_option        = "Empty"
  disk_size_gb         = var.prometheus_disk_size_gb

  tags = {
    project = "PowerTrack"
    env     = "Production"
    role    = "prometheus-data"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# ----------------- Prometheus disk attach to VM -----------------
resource "azurerm_virtual_machine_data_disk_attachment" "prometheus_data_attach" {
  managed_disk_id    = azurerm_managed_disk.prometheus_data_disk.id
  virtual_machine_id = azurerm_linux_virtual_machine.app-vm.id
  lun                = 10
  caching            = "ReadWrite"
}
