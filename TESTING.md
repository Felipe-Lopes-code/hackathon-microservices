# Testes de Integração

Este documento descreve os testes de integração entre os microserviços.

## Fluxo de Teste Completo

### 1. Teste de Registro e Login

```bash
# Registrar novo usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Salve o token retornado
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### 2. Teste de Produtos

```bash
# Criar produto (requer autenticação)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Notebook Dell",
    "description": "Notebook i7, 16GB RAM, 512GB SSD",
    "price": 4500.00,
    "stock": 10,
    "category": "Eletrônicos",
    "imageUrl": "https://via.placeholder.com/300"
  }'

# Listar produtos (público)
curl http://localhost:3000/api/products

# Filtrar por categoria
curl "http://localhost:3000/api/products?category=Eletrônicos"

# Filtrar por preço
curl "http://localhost:3000/api/products?minPrice=1000&maxPrice=5000"
```

### 3. Teste de Pedidos

```bash
# Criar pedido
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'

# Listar meus compartilhamentos
curl -X GET http://localhost:3000/api/orders/my-orders \
  -H "Authorization: Bearer $TOKEN"

# Ver pedido específico
curl -X GET http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer $TOKEN"

# Atualizar status do pedido
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

### 4. Teste de Perfil de Usuário

```bash
# Obter perfil
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Testes Automatizados

### Script de Teste Completo

Crie um arquivo `test-integration.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000/api"

echo "=== Teste 1: Registro de Usuário ==="
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Integration Test User",
    "email": "integration@test.com",
    "password": "testpassword123"
  }')

echo $REGISTER_RESPONSE | jq .

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.accessToken')
echo "Token: $TOKEN"

echo "\n=== Teste 2: Login ==="
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration@test.com",
    "password": "testpassword123"
  }')

echo $LOGIN_RESPONSE | jq .

echo "\n=== Teste 3: Criar Produto ==="
PRODUCT_RESPONSE=$(curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test Description",
    "price": 100.00,
    "stock": 50,
    "category": "Test",
    "imageUrl": "https://via.placeholder.com/300"
  }')

echo $PRODUCT_RESPONSE | jq .
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.data.id')

echo "\n=== Teste 4: Listar Produtos ==="
curl -s $API_URL/products | jq .

echo "\n=== Teste 5: Criar Pedido ==="
ORDER_RESPONSE=$(curl -s -X POST $API_URL/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"items\": [
      {
        \"productId\": $PRODUCT_ID,
        \"quantity\": 2
      }
    ]
  }")

echo $ORDER_RESPONSE | jq .

echo "\n=== Teste 6: Listar Pedidos ==="
curl -s -X GET $API_URL/orders/my-orders \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "\n=== Testes Concluídos ==="
```

Execute:
```bash
chmod +x test-integration.sh
./test-integration.sh
```

## Validações de Segurança

### 1. Teste de Autenticação

```bash
# Tentar acessar recurso protegido sem token (deve falhar)
curl -X GET http://localhost:3000/api/orders/my-orders

# Tentar com token inválido (deve falhar)
curl -X GET http://localhost:3000/api/orders/my-orders \
  -H "Authorization: Bearer invalid_token"
```

### 2. Teste de Rate Limiting

```bash
# Fazer múltiplas requisições rapidamente
for i in {1..150}; do
  curl -X GET http://localhost:3000/api/products
  echo "Request $i"
done

# Após 100 requisições, deve retornar erro 429
```

### 3. Teste de Validação de Entrada

```bash
# Email inválido (deve falhar)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "password123"
  }'

# Senha curta (deve falhar)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "password": "123"
  }'
```

## Métricas de Teste

- ✅ Registro de usuário
- ✅ Login de usuário
- ✅ Autenticação com JWT
- ✅ CRUD de produtos
- ✅ Criação de pedidos
- ✅ Validação de estoque
- ✅ Rate limiting
- ✅ Validação de entrada
- ✅ Autorização baseada em roles

## Ferramentas Recomendadas

- **Postman**: Para testes manuais de API
- **Newman**: Para testes automatizados de coleções Postman
- **k6**: Para testes de carga
- **Jest**: Para testes unitários
- **Supertest**: Para testes de integração
