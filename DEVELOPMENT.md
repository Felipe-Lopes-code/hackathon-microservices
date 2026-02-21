# Development Environment Setup

Este guia descreve como configurar o ambiente de desenvolvimento local.

## Pré-requisitos

- **Node.js 18+**: [Download](https://nodejs.org/)
- **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop/)
- **Git**: [Download](https://git-scm.com/)
- **VS Code** (recomendado): [Download](https://code.visualstudio.com/)

### Extensões VS Code Recomendadas

- ESLint
- Prettier
- Docker
- GitLens
- Thunder Client (para testar APIs)

## Setup Inicial

### 1. Clone o repositório

```bash
git clone https://github.com/Felipe-Lopes-code/hackathon-microservices.git
cd hackathon-microservices
```

### 2. Inicialização Rápida

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
start.bat
```

### 3. Desenvolvimento Individual de Serviços

#### Auth Service

```bash
cd services/auth-service
npm install
cp .env.example .env

# Edite o .env se necessário
# Inicie o PostgreSQL separadamente ou use Docker

# Modo desenvolvimento
npm run dev

# Testes
npm test

# Testes com watch
npm run test:watch
```

#### Product Service

```bash
cd services/product-service
npm install
cp .env.example .env
npm run dev
```

#### Order Service

```bash
cd services/order-service
npm install
cp .env.example .env
npm run dev
```

#### API Gateway

```bash
cd api-gateway
npm install
cp .env.example .env
npm run dev
```

#### Web Client

```bash
cd web-client
npm install
cp .env.example .env
npm run dev
```

## Desenvolvimento com Docker Compose

Para rodar todos os serviços juntos:

```bash
# Build e start
docker-compose -f docker-compose-prod.yml up --build

# Modo detached (background)
docker-compose -f docker-compose-prod.yml up -d

# Ver logs
docker-compose -f docker-compose-prod.yml logs -f

# Ver logs de um serviço específico
docker-compose -f docker-compose-prod.yml logs -f auth-service

# Parar todos os serviços
docker-compose -f docker-compose-prod.yml down

# Parar e remover volumes
docker-compose -f docker-compose-prod.yml down -v
```

## Banco de Dados

### Conectar ao PostgreSQL

```bash
# Via Docker
docker exec -it hackathon-postgres psql -U postgres

# Via cliente local
psql -h localhost -p 5432 -U postgres -d auth_db
```

### Criar dados de teste

```sql
-- No psql
\c auth_db

-- Inserir usuário de teste
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@test.com',
  '$2a$10$XqjXNPgFNYgXqLcWqWzwJOYPvW0vVgY8LvMZYoJnXqg1234567890', -- password123
  'Admin User',
  'admin'
);

-- Verificar
SELECT * FROM users;
```

## Debugging

### Node.js (VS Code)

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Auth Service",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/services/auth-service/src/index.js",
      "cwd": "${workspaceFolder}/services/auth-service",
      "envFile": "${workspaceFolder}/services/auth-service/.env"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Product Service",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/services/product-service/src/index.js",
      "cwd": "${workspaceFolder}/services/product-service",
      "envFile": "${workspaceFolder}/services/product-service/.env"
    }
  ]
}
```

### Docker Logs

```bash
# Todos os serviços
docker-compose -f docker-compose-prod.yml logs -f

# Serviço específico
docker-compose -f docker-compose-prod.yml logs -f auth-service

# Últimas 100 linhas
docker-compose -f docker-compose-prod.yml logs --tail=100 auth-service
```

## Testes

### Testes Unitários

```bash
# Todos os serviços
npm test --workspaces

# Serviço específico
cd services/auth-service
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Testes de Integração

```bash
# Certifique-se de que todos os serviços estão rodando
docker-compose -f docker-compose-prod.yml up -d

# Execute os testes
./test-integration.sh
```

### Testes de Carga (k6)

```bash
# Instale k6: https://k6.io/docs/getting-started/installation/

# Execute teste de carga
k6 run tests/load/api-load-test.js
```

## Troubleshooting

### Porta já em uso

```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker: Limpar tudo

```bash
# Parar todos os containers
docker stop $(docker ps -aq)

# Remover todos os containers
docker rm $(docker ps -aq)

# Remover todas as imagens
docker rmi $(docker images -q)

# Limpar volumes
docker volume prune

# Limpar tudo (cuidado!)
docker system prune -a --volumes
```

### Problemas com node_modules

```bash
# Remover e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou use npm ci para instalação limpa
npm ci
```

### Problemas com permissões (Linux/Mac)

```bash
# Dar permissão de execução aos scripts
chmod +x start.sh
chmod +x test-integration.sh
```

## Fluxo de Trabalho Recomendado

1. **Crie uma branch**
   ```bash
   git checkout -b feature/minha-feature
   ```

2. **Desenvolva e teste**
   ```bash
   npm run dev
   npm test
   ```

3. **Commit com mensagens descritivas**
   ```bash
   git add .
   git commit -m "feat: adiciona validação de email"
   ```

4. **Push e crie PR**
   ```bash
   git push origin feature/minha-feature
   ```

## Variáveis de Ambiente

### Auth Service

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
JWT_SECRET=CHANGE_ME_USE_RANDOM_STRING_MIN_32_CHARS
JWT_EXPIRES_IN=24h
```

### Product Service

```env
PORT=3002
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_db
DB_USER=postgres
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
AUTH_SERVICE_URL=http://localhost:3001
```

### Order Service

```env
PORT=3003
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_db
DB_USER=postgres
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
```

## Recursos Adicionais

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)
- [React Docs](https://react.dev/)
