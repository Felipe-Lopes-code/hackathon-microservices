# Arquitetura do Sistema

## Visão Geral

```
                                    ┌─────────────────────┐
                                    │                     │
                                    │    INTERNET         │
                                    │                     │
                                    └──────────┬──────────┘
                                               │
                                               │ HTTPS
                                               │
                          ┌────────────────────▼──────────────────────┐
                          │                                            │
                          │         Load Balancer (AWS ALB)            │
                          │                                            │
                          └────────────┬───────────────────────────────┘
                                       │
                   ┌───────────────────┼───────────────────┐
                   │                   │                   │
                   ▼                   ▼                   ▼
          ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
          │                │  │                │  │                │
          │  Web Client    │  │  Web Client    │  │  Web Client    │
          │  (Container)   │  │  (Container)   │  │  (Container)   │
          │                │  │                │  │                │
          └───────┬────────┘  └───────┬────────┘  └───────┬────────┘
                  │                   │                   │
                  └───────────────────┼───────────────────┘
                                      │
                                      ▼
                          ┌──────────────────────┐
                          │                      │
                          │    API Gateway       │
                          │  - Rate Limiting     │
                          │  - Authentication    │
                          │  - Routing           │
                          │                      │
                          └──────────┬───────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
    │                  │ │                  │ │                  │
    │  Auth Service    │ │ Product Service  │ │  Order Service   │
    │                  │ │                  │ │                  │
    │  - Register      │ │  - CRUD          │ │  - Create        │
    │  - Login         │ │  - Search        │ │  - List          │
    │  - JWT Token     │ │  - Stock Mgmt    │ │  - Update Status │
    │                  │ │                  │ │                  │
    └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
             │                    │                    │
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  │
                                  ▼
                      ┌───────────────────────┐
                      │                       │
                      │   PostgreSQL          │
                      │                       │
                      │  ┌─────────────────┐ │
                      │  │   auth_db       │ │
                      │  ├─────────────────┤ │
                      │  │  product_db     │ │
                      │  ├─────────────────┤ │
                      │  │  order_db       │ │
                      │  └─────────────────┘ │
                      │                       │
                      └───────────────────────┘

                                  │
                                  ▼
                      ┌───────────────────────┐
                      │                       │
                      │      Redis            │
                      │   (Cache/Session)     │
                      │                       │
                      └───────────────────────┘
```

## Fluxo de Dados

### 1. Autenticação

```
┌──────────┐    1. POST /register    ┌─────────────┐
│          │ ───────────────────────> │             │
│  Client  │                          │   Gateway   │
│          │ <─────────────────────── │             │
└──────────┘    2. JWT Token          └──────┬──────┘
                                              │
                                              │ 3. Forward
                                              │
                                         ┌────▼─────┐
                                         │   Auth   │
                                         │ Service  │
                                         └────┬─────┘
                                              │
                                              │ 4. Save
                                              │
                                         ┌────▼─────┐
                                         │   DB     │
                                         └──────────┘
```

### 2. Criação de Pedido

```
┌──────────┐                          ┌─────────────┐
│          │  1. POST /orders         │             │
│  Client  │ ───────────────────────> │   Gateway   │
│          │  (JWT Token)             │             │
└──────────┘                          └──────┬──────┘
                                              │
                                              │ 2. Verify Token
                                              │
                                         ┌────▼─────┐
                                         │   Auth   │
                                         │ Service  │
                                         └──────────┘
                                              │
                                              │ 3. Valid
                                              │
                                         ┌────▼─────┐
                                         │  Order   │
                                         │ Service  │
                                         └────┬─────┘
                                              │
                                              │ 4. Check Stock
                                              │
                                         ┌────▼────────┐
                                         │  Product    │
                                         │  Service    │
                                         └─────────────┘
```

## Padrões de Comunicação

### Síncrona (HTTP/REST)

- Client ↔ API Gateway
- Gateway ↔ Services
- Service ↔ Service

### Assíncrona (Futura implementação)

- Message Queue (RabbitMQ/Kafka)
- Event-driven architecture
- Pub/Sub pattern

## Segurança

```
┌────────────────────────────────────────────────────┐
│                   Security Layers                   │
├────────────────────────────────────────────────────┤
│  1. Network Layer                                  │
│     - HTTPS/TLS                                    │
│     - Firewall rules                               │
│     - VPC isolation                                │
├────────────────────────────────────────────────────┤
│  2. API Gateway Layer                              │
│     - Rate Limiting                                │
│     - CORS                                         │
│     - Request validation                           │
├────────────────────────────────────────────────────┤
│  3. Service Layer                                  │
│     - JWT Authentication                           │
│     - Authorization (RBAC)                         │
│     - Input validation (Joi)                       │
├────────────────────────────────────────────────────┤
│  4. Data Layer                                     │
│     - Password hashing (bcrypt)                    │
│     - Prepared statements                          │
│     - Database encryption                          │
└────────────────────────────────────────────────────┘
```

## Escalabilidade

### Horizontal Scaling

```
                    Load Balancer
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   Service 1         Service 2         Service 3
   Container         Container         Container
```

### Database Scaling

```
    Primary DB ─────> Replica DB 1
        │
        └────────────> Replica DB 2
```

## Monitoramento

```
┌─────────────────────────────────────────────────┐
│                 Observability                    │
├─────────────────────────────────────────────────┤
│  Logs (Winston)                                 │
│    ↓                                            │
│  CloudWatch / Application Insights              │
│    ↓                                            │
│  Dashboards & Alerts                            │
├─────────────────────────────────────────────────┤
│  Metrics (Prometheus)                           │
│    ↓                                            │
│  Grafana                                        │
├─────────────────────────────────────────────────┤
│  Tracing (Jaeger)                               │
│    ↓                                            │
│  Distributed tracing                            │
└─────────────────────────────────────────────────┘
```

## Deployment

### Development

```
Docker Compose
    │
    ├─ postgres
    ├─ redis
    ├─ auth-service
    ├─ product-service
    ├─ order-service
    ├─ api-gateway
    └─ web-client
```

### Production (AWS)

```
AWS ECS Cluster
    │
    ├─ Task Definition 1 (Auth)
    ├─ Task Definition 2 (Product)
    ├─ Task Definition 3 (Order)
    ├─ Task Definition 4 (Gateway)
    └─ Task Definition 5 (Web)
         │
         └─> ALB (Application Load Balancer)
              │
              └─> Route 53 (DNS)
```

## Resiliência

### Circuit Breaker Pattern

```javascript
// Implementação futura
const circuitBreaker = new CircuitBreaker(serviceCall, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});
```

### Retry Logic

```javascript
// Implementação atual
const retryRequest = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1));
    }
  }
};
```

## Performance

### Caching Strategy

```
Client Request
    │
    ▼
Check Redis Cache
    │
    ├─ HIT ──> Return cached data
    │
    └─ MISS ──> Query Database
                    │
                    ▼
                Save to Redis
                    │
                    ▼
                Return data
```

### Database Indexing

```sql
-- Índices aplicados
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## Tecnologias por Camada

| Camada           | Tecnologia                    |
|------------------|-------------------------------|
| Frontend         | React, Vite, Zustand          |
| API Gateway      | Express, http-proxy-middleware|
| Services         | Node.js, Express              |
| Database         | PostgreSQL                    |
| Cache            | Redis                         |
| Authentication   | JWT, bcrypt                   |
| Validation       | Joi                           |
| Testing          | Jest, Supertest               |
| Containerization | Docker, Docker Compose        |
| CI/CD            | GitHub Actions                |
| Cloud            | AWS, Azure                    |
| IaC              | Terraform                     |
| Web Server       | Nginx                         |
| Logging          | Winston                       |

## Evolução Futura

### Fase 2
- [ ] Message Queue (RabbitMQ)
- [ ] Event Sourcing
- [ ] CQRS Pattern
- [ ] Service Mesh (Istio)

### Fase 3
- [ ] GraphQL Gateway
- [ ] Kubernetes orchestration
- [ ] Distributed caching
- [ ] Advanced monitoring

### Fase 4
- [ ] Machine Learning integration
- [ ] Real-time analytics
- [ ] Global CDN
- [ ] Multi-region deployment
