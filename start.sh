#!/bin/bash

# Script de inicialização rápida do projeto

echo "🚀 Inicializando Hackathon Microservices..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

echo "✅ Docker está rodando"

# Criar arquivos .env se não existirem
echo "📝 Criando arquivos de configuração..."

if [ ! -f "services/auth-service/.env" ]; then
    cp services/auth-service/.env.example services/auth-service/.env
    echo "✅ Auth service .env criado"
fi

if [ ! -f "services/product-service/.env" ]; then
    cp services/product-service/.env.example services/product-service/.env
    echo "✅ Product service .env criado"
fi

if [ ! -f "services/order-service/.env" ]; then
    cp services/order-service/.env.example services/order-service/.env
    echo "✅ Order service .env criado"
fi

if [ ! -f "api-gateway/.env" ]; then
    cp api-gateway/.env.example api-gateway/.env
    echo "✅ API Gateway .env criado"
fi

if [ ! -f "web-client/.env" ]; then
    cp web-client/.env.example web-client/.env
    echo "✅ Web client .env criado"
fi

# Build e start dos containers
echo "🔨 Building containers..."
docker-compose -f docker-compose-prod.yml build

echo "🚀 Starting services..."
docker-compose -f docker-compose-prod.yml up -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 15

# Health checks
echo "🏥 Verificando saúde dos serviços..."

check_service() {
    local service=$1
    local url=$2
    
    if curl -s "$url" > /dev/null; then
        echo "✅ $service está saudável"
    else
        echo "❌ $service não está respondendo"
    fi
}

check_service "API Gateway" "http://localhost:3000/health"
check_service "Auth Service" "http://localhost:3001/api/auth/health"
check_service "Product Service" "http://localhost:3002/api/products/health/check"
check_service "Order Service" "http://localhost:3003/health"

echo ""
echo "🎉 Aplicação iniciada com sucesso!"
echo ""
echo "📍 URLs disponíveis:"
echo "   Web Client:    http://localhost"
echo "   API Gateway:   http://localhost:3000"
echo "   Auth Service:  http://localhost:3001"
echo "   Product Service: http://localhost:3002"
echo "   Order Service: http://localhost:3003"
echo ""
echo "📊 Para ver logs: docker-compose -f docker-compose-prod.yml logs -f"
echo "🛑 Para parar: docker-compose -f docker-compose-prod.yml down"
