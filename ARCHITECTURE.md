# Arquitetura do Sistema

## Visão Geral

```
                          ┌──────────────────────┐
                          │      Web Client       │
                          │   React 18 + Vite 7   │
                          │       (Nginx:80)      │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │    API Gateway :3000  │
                          │  Rate Limiting, CORS  │
                          │  Swagger, Proxy       │
                          └──────────┬───────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
    │  Auth Service    │ │ Material Service │ │  Share Service   │
    │     :3001        │ │     :3002        │ │     :3003        │
    │                  │ │                  │ │                  │
    │  Register/Login  │ │  CRUD materiais  │ │  Compartilhar    │
    │  JWT, Perfis     │ │  Busca (ILIKE)   │ │  Listar, Status  │
    │                  │ │  Filtro categ.   │ │                  │
    └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
             │                    │                    │
             ▼                    ▼                    ▼
         auth_db             product_db            order_db
                      ┌───────────────────────┐
                      │   PostgreSQL 15 :5432  │
                      └───────────────────────┘
                      ┌───────────────────────┐
                      │   Redis 7 :6379       │
                      │   (Cache/Session)     │
                      └───────────────────────┘
```

## Clean Architecture (por serviço)

```
src/
├── domain/                  # Regras de negócio puras
│   ├── entities/            # Product, Order, User
│   └── repositories/        # Interfaces (contratos)
├── application/             # Casos de uso
│   └── useCases/            # CreateProduct, GetAllProducts, CreateOrder
└── infrastructure/          # Implementações concretas
    ├── database/            # PostgresProductRepository, etc.
    └── http/
        ├── controllers/     # ProductController, OrderController
        ├── routes/          # Express Router
        └── middlewares/     # authMiddleware
```

A dependência flui de fora para dentro: `infrastructure → application → domain`.

## Fluxos Principais

### Autenticação

```
Client  ──POST /api/auth/register──▶  Gateway  ──proxy──▶  Auth Service
                                                                │
                                                          bcrypt hash
                                                          salvar em auth_db
                                                                │
Client  ◀──── { accessToken, refreshToken } ◀────────────── JWT gerado
```

### Busca de Materiais

```
Client  ──GET /api/materials?search=cordel&category=Português──▶  Gateway
                                                                     │
                                                               proxy ──▶ Material Service
                                                                              │
                                                                  SELECT * FROM products
                                                                  WHERE name ILIKE '%cordel%'
                                                                    OR description ILIKE '%cordel%'
                                                                  AND category = 'Português'
                                                                              │
Client  ◀──── { success: true, data: [...], count: N } ◀───────────────────────
```

### Compartilhamento

```
Client  ──POST /api/shares { items: [{productId, quantity}] }──▶  Gateway
         (JWT no header)                                             │
                                                               proxy ──▶ Share Service
                                                                              │
                                                              1. Valida cada material
                                                                 via GET product-service
                                                              2. Cria registro em order_db
                                                                              │
Client  ◀──── { success: true, data: { id, items, status: "pending" } } ◀─────
```

## Roteamento do Gateway

| Rota pública | Rota interna | Serviço |
|---|---|---|
| `/api/auth/*` | `/api/auth/*` | auth-service:3001 |
| `/api/materials/*` | `/api/products/*` | product-service:3002 |
| `/api/shares/*` | `/api/orders/*` | order-service:3003 |

O proxy é configurado **antes** do `express.json()` body parser para não consumir o body stream de requisições POST.

## Segurança (camadas)

| Camada | Mecanismo |
|--------|-----------|
| Gateway | Helmet.js, CORS, rate limiting (100 req/15 min) |
| Autenticação | JWT (access + refresh tokens), bcrypt (10 rounds) |
| Validação | Joi schemas, queries parametrizadas (SQL Injection) |
| Dados | Bancos isolados por serviço, senhas nunca retornadas |

## Deployment

### Docker Compose (desenvolvimento)

7 containers: `postgres`, `redis`, `auth-service`, `product-service`, `order-service`, `api-gateway`, `web-client`.

### Cloud (produção)

Terraform configurado para AWS (ECS + RDS + ALB) e Azure (ACI + PostgreSQL). Veja `infrastructure/`.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite 7, Zustand, React Router 6 |
| Gateway | Express, http-proxy-middleware, swagger-jsdoc |
| Backend | Node.js 18, Express 4.18, Joi, bcrypt, jsonwebtoken |
| Banco | PostgreSQL 15 |
| Cache | Redis 7 |
| Infra | Docker, Docker Compose, Nginx, Terraform |
| Testes | Jest, Supertest |
