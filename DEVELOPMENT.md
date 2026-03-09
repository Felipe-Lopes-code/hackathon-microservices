# Guia de Desenvolvimento

## Pré-requisitos

- **Docker Desktop** — [download](https://www.docker.com/products/docker-desktop/)
- **Node.js 18+** (22+ para o web-client) — [download](https://nodejs.org/)
- **Git** — [download](https://git-scm.com/)

## Setup com Docker (recomendado)

```bash
git clone https://github.com/Felipe-Lopes-code/hackathon-microservices.git
cd hackathon-microservices

# Subir todos os serviços
docker compose up -d

# Verificar status
docker compose ps

# Seed de materiais (opcional)
docker cp seed-materials.sql hackathon-postgres:/tmp/seed.sql
docker exec hackathon-postgres psql -U postgres -d product_db -f /tmp/seed.sql

# Logs (todos ou de um serviço)
docker compose logs -f
docker compose logs -f product-service
```

### URLs após subir

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| API Gateway | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |

> Se a porta 5432 estiver ocupada, altere o mapeamento em `docker-compose.yml` (ex: `5433:5432`).

## Desenvolvimento Local (sem Docker)

Inicie PostgreSQL e Redis manualmente ou via Docker:

```bash
docker compose up -d postgres redis
```

Depois, em terminais separados:

```bash
# Auth Service
cd services/auth-service
npm install
npm run dev    # porta 3001

# Material Service
cd services/product-service
npm install
npm run dev    # porta 3002

# Share Service
cd services/order-service
npm install
npm run dev    # porta 3003

# API Gateway
cd api-gateway
npm install
npm run dev    # porta 3000

# Web Client (requer Node 22+)
cd web-client
npm install --legacy-peer-deps
npm run dev    # porta 5173
```

### Variáveis de Ambiente

Cada serviço precisa de um `.env`. Use os `.env.example` como base:

```bash
cp services/auth-service/.env.example services/auth-service/.env
cp services/product-service/.env.example services/product-service/.env
cp services/order-service/.env.example services/order-service/.env
cp api-gateway/.env.example api-gateway/.env
```

Variáveis principais:

| Variável | Valor padrão | Descrição |
|----------|-------------|-----------|
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | — | Senha do banco |
| `JWT_SECRET` | — | Segredo para assinar tokens (min 32 chars) |
| `JWT_EXPIRES_IN` | `24h` | Expiração do token |

## Estrutura de Diretórios

```
services/
├── auth-service/        # Autenticação (JWT, perfis)
├── product-service/     # Catálogo de materiais (CRUD, busca)
└── order-service/       # Compartilhamento de materiais
api-gateway/             # Proxy, rate limiting, Swagger
web-client/              # SPA React
shared/                  # Utilitários compartilhados (cache, pool, token)
infrastructure/          # Terraform (AWS, Azure)
tests/                   # Testes de segurança e performance
```

## Testes

```bash
# Unitários por serviço
cd services/auth-service && npm test
cd services/product-service && npm test
cd services/order-service && npm test

# Com cobertura
npm test -- --coverage

# Segurança e performance (requer serviços rodando)
cd tests && npm install && npm run test:security
```

## Banco de Dados

```bash
# Conectar via Docker
docker exec -it hackathon-postgres psql -U postgres

# Listar bancos
\l

# Conectar a um banco específico
\c product_db
SELECT id, name, category FROM products;
```

Bancos: `auth_db`, `product_db`, `order_db` (criados automaticamente via `init-databases.sql`).

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Porta ocupada (5432, 3000) | Altere o mapeamento em `docker-compose.yml` |
| `npm ci` falha no Docker | Use `npm install` (package-lock.json está na raiz do workspace) |
| Web-client build falha | Requer Node 22+; use `--legacy-peer-deps` para eslint |
| POST via gateway retorna 504 | Proxy deve estar antes de `express.json()` em `api-gateway/src/index.js` |
| Containers não conectam ao banco | Verifique se postgres está `healthy` com `docker compose ps` |
