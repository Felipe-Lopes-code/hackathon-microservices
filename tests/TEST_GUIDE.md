# Guia de Testes

## Pré-requisitos

Todos os serviços devem estar rodando (`docker compose up -d`).

```bash
cd tests
npm install
```

---

## Testes Unitários (por serviço)

```bash
cd services/auth-service && npm test
cd services/product-service && npm test
cd services/order-service && npm test

# Com cobertura
npm test -- --coverage
```

---

## Testes de Segurança

```bash
cd tests
npm run test:security
```

### O que é testado

| Categoria | Verificações |
|-----------|-------------|
| SQL Injection | 10 payloads maliciosos em campos de input |
| XSS | 8 payloads de script, headers de segurança |
| Autenticação | JWT válido/inválido/expirado/ausente |
| Rate Limiting | 105 requisições rápidas → espera status 429 |
| Validação de Input | Emails inválidos, senhas fracas, valores negativos |
| CORS | Headers, preflight requests |
| Security Headers | Helmet.js (X-Content-Type-Options, X-Frame-Options, etc.) |
| Error Disclosure | Stack traces não expostos, mensagens genéricas |
| Senhas | Nunca retornadas na API, hash com bcrypt |
| Mass Assignment | Proteção contra role injection |

---

## Testes de Performance

```bash
cd tests
npm run test:performance
npm run load-test          # Autocannon
```

### Cenários de carga

| Teste | Conexões | Duração | Meta |
|-------|----------|---------|------|
| Health Check | 100 | 10s | >1000 req/s |
| Listagem de materiais | 50 | 10s | >500 req/s |
| Autenticação | 20 | 10s | >100 req/s |

Também verifica: tempo de resposta (<100ms health, <500ms listagem, <300ms auth), memory leaks (100 requisições sequenciais).

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Rate limiting test falha | Verifique se rate limiting está ativo no gateway |
| Authentication tests falham | Confirme `JWT_SECRET` e que auth-service está rodando |
| Latência alta (>200ms) | `docker stats` para verificar recursos; adicione cache Redis |
| Baixo req/s | Verifique gargalo no banco (`EXPLAIN` nas queries) |

---

## Ambiente limpo para testes

```bash
docker compose down -v
docker compose up -d
# Aguardar health checks
curl http://localhost:3000/health
```
