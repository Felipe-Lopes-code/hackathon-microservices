# Azure Resource Group
resource "azurerm_resource_group" "main" {
  name     = "hackathon-rg"
  location = var.azure_location
}

# Azure Container Registry
resource "azurerm_container_registry" "main" {
  name                = "hackathonacr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Azure Container Instances for Microservices
resource "azurerm_container_group" "auth_service" {
  name                = "auth-service"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  dns_name_label      = "hackathon-auth"

  container {
    name   = "auth-service"
    image  = "${azurerm_container_registry.main.login_server}/auth-service:latest"
    cpu    = "0.5"
    memory = "1.0"

    ports {
      port     = 3001
      protocol = "TCP"
    }

    environment_variables = {
      NODE_ENV = "production"
      PORT     = "3001"
    }

    secure_environment_variables = {
      DB_PASSWORD = azurerm_postgresql_flexible_server.main.administrator_password
      JWT_SECRET  = random_password.jwt_secret.result
    }
  }

  image_registry_credential {
    server   = azurerm_container_registry.main.login_server
    username = azurerm_container_registry.main.admin_username
    password = azurerm_container_registry.main.admin_password
  }
}

# Azure PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "hackathon-postgres"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  administrator_login    = "psqladmin"
  administrator_password = random_password.db_password.result

  storage_mb = 32768
  sku_name   = "B_Standard_B1ms" # Free tier eligible

  backup_retention_days = 7
}

# Azure Key Vault for Secrets
resource "azurerm_key_vault" "main" {
  name                = "hackathon-kv"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
}

resource "azurerm_key_vault_secret" "db_password" {
  name         = "db-password"
  value        = random_password.db_password.result
  key_vault_id = azurerm_key_vault.main.id
}

resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = random_password.jwt_secret.result
  key_vault_id = azurerm_key_vault.main.id
}

# Random Passwords
resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

# Data Source
data "azurerm_client_config" "current" {}

# Variables
variable "azure_location" {
  default = "East US"
}

# Outputs
output "acr_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.main.fqdn
}
