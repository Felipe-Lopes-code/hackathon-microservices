# EduShare — Plataforma Colaborativa de Materiais Didáticos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hackathon](https://img.shields.io/badge/Hackathon-5FSDT%20Postech-blue.svg)](#)

Plataforma de microserviços para professores do ensino público brasileiro criarem, buscarem e compartilharem materiais didáticos gratuitamente.

> **Hackathon 5FSDT — Postech** | Tema: Auxílio aos Professores no Ensino Público

---

## Arquitetura

```
Web Client (:80)  →  API Gateway (:3000)  →  Auth Service (:3001)
                                           →  Material Service (:3002)
                                           →  Share Service (:3003)
                                                    ↓
                                              PostgreSQL (:5432)  +  Redis (:6379)
```

| Serviço | Porta | Diretório | Função |
|---------|-------|-----------|--------|
| **Auth Service** | 3001 | `services/auth-service` | Registro, login, JWT, perfis |
| **Material Service** | 3002 | `services/product-service` | CRUD de materiais, busca por texto, filtro por disciplina |
| **Share Service** | 3003 | `services/order-service` | Compartilhamento de materiais com alunos |
| **API Gateway** | 3000 | `api-gateway` | Roteamento, rate limiting, CORS, Swagger |
| **Web Client** | 80 | `web-client` | SPA React com catálogo, biblioteca e compartilhamento |

Cada serviço segue **Clean Architecture** (domain → application → infrastructure).

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite 7, Zustand, React Router 6 |
| Backend | Node.js 18/22, Express 4.18 |
| Banco | PostgreSQL 15 (bancos separados por serviço) |
| Cache | Redis 7 |
| Segurança | JWT, bcrypt, Helmet.js, rate limiting, Joi |
| Infra | Docker, Docker Compose, Terraform (AWS/Azure) |
| Testes | Jest, Supertest |

## Quick Start

```bash
# Clone e suba tudo
git clone https://github.com/Felipe-Lopes-code/hackathon-microservices.git
cd hackathon-microservices
docker compose up -d

# Seed de materiais didáticos (opcional — popula o catálogo com 17 exemplos)
docker cp seed-materials.sql hackathon-postgres:/tmp/seed.sql
docker exec hackathon-postgres psql -U postgres -d product_db -f /tmp/seed.sql

# Acesse
# Frontend:    http://localhost
# API Gateway: http://localhost:3000
# Swagger:     http://localhost:3000/api-docs
```

> **Windows:** se as portas 5432 ou 3000 já estiverem ocupadas, ajuste em `docker-compose.yml`.

## Endpoints Principais

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/register` | Criar conta | Não |
| POST | `/api/auth/login` | Login (retorna JWT) | Não |
| GET | `/api/auth/profile` | Perfil do usuário | Sim |
| GET | `/api/materials` | Listar materiais (filtros: `category`, `search`) | Não |
| GET | `/api/materials/:id` | Detalhe de um material | Não |
| POST | `/api/materials` | Criar material | Sim |
| POST | `/api/shares` | Compartilhar materiais com alunos | Sim |
| GET | `/api/shares/my-orders` | Meus compartilhamentos | Sim |

## Testes

```bash
# Unitários (por serviço)
cd services/auth-service && npm test
cd services/product-service && npm test
cd services/order-service && npm test

# Segurança e performance
cd tests && npm install && npm run test:security
```

Veja [tests/TEST_GUIDE.md](tests/TEST_GUIDE.md) para detalhes.

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [RELATORIO_PROJETO.md](RELATORIO_PROJETO.md) | Relatório oficial do Hackathon 5FSDT |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Diagramas de arquitetura e fluxos |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup de desenvolvimento local |
| [SECURITY.md](SECURITY.md) | Gestão de segredos e boas práticas |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guia de contribuição |
| [tests/TEST_GUIDE.md](tests/TEST_GUIDE.md) | Guia de execução dos testes |

## Licença

MIT — veja [LICENSE](LICENSE).

**Hackathon 5FSDT Team — Postech — 2026**