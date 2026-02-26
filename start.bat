@echo off
REM Script de inicialização para Windows

echo Inicializando Hackathon Microservices...

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker não está rodando. Por favor, inicie o Docker Desktop.
    exit /b 1
)

echo Docker está rodando

REM Criar arquivos .env se não existirem
echo Criando arquivos de configuração...

if not exist ".env" (
    copy ".env.example" ".env"
    echo.
    echo =====================================================
    echo  ATENCAO: Arquivo .env criado a partir do template.
    echo  EDITE o arquivo .env na raiz do projeto e altere
    echo  POSTGRES_PASSWORD e JWT_SECRET antes de continuar!
    echo =====================================================
    echo.
    pause
)

if not exist "services\auth-service\.env" (
    copy "services\auth-service\.env.example" "services\auth-service\.env"
    echo Auth service .env criado
)

if not exist "services\product-service\.env" (
    copy "services\product-service\.env.example" "services\product-service\.env"
    echo Material service .env criado
)

if not exist "services\order-service\.env" (
    copy "services\order-service\.env.example" "services\order-service\.env"
    echo Share service .env criado
)

if not exist "api-gateway\.env" (
    copy "api-gateway\.env.example" "api-gateway\.env"
    echo API Gateway .env criado
)

if not exist "web-client\.env" (
    copy "web-client\.env.example" "web-client\.env"
    echo Web client .env criado
)

REM Build e start dos containers
echo Building containers...
docker-compose -f docker-compose-prod.yml build

echo Starting services...
docker-compose -f docker-compose-prod.yml up -d

echo Aguardando servicos ficarem prontos...
timeout /t 15 /nobreak

echo.
echo Aplicacao iniciada com sucesso!
echo.
echo URLs disponiveis:
echo    Web Client:    http://localhost
echo    API Gateway:   http://localhost:3000
echo    Auth Service:  http://localhost:3001
echo    Material Service: http://localhost:3002
echo    Share Service:    http://localhost:3003
echo.
echo Para ver logs: docker-compose -f docker-compose-prod.yml logs -f
echo Para parar: docker-compose -f docker-compose-prod.yml down

pause
