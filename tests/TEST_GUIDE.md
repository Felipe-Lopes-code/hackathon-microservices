# 🔍 Guia de Execução dos Testes

## 📋 Índice
- [Testes de Segurança](#testes-de-segurança)
- [Testes de Performance](#testes-de-performance)
- [Testes de Integração](#testes-de-integração)
- [Interpretação de Resultados](#interpretação-de-resultados)

---

## 🔒 Testes de Segurança

### Instalação

```bash
cd tests
npm install
```

### Executar Todos os Testes de Segurança

```bash
npm run test:security
```

### Testes Incluídos

1. **SQL Injection Protection**
   - Testa 10 payloads maliciosos
   - Verifica que não há exposição de erros SQL
   - Valida queries parametrizadas

2. **XSS Protection**
   - Testa 8 payloads de scripts maliciosos
   - Verifica sanitização de inputs
   - Valida headers de segurança

3. **Authentication & Authorization**
   - Testa 15 cenários de autenticação
   - Valida JWT tokens
   - Verifica controle de acesso

4. **Rate Limiting**
   - Envia 105 requisições rápidas
   - Verifica status 429 (Too Many Requests)
   - Valida limites configurados

5. **Input Validation**
   - Testa emails inválidos
   - Testa senhas fracas
   - Testa valores negativos

6. **CORS Protection**
   - Verifica headers CORS
   - Testa preflight requests
   - Valida origens permitidas

7. **Security Headers**
   - Verifica Helmet.js headers
   - Valida X-Content-Type-Options
   - Valida X-Frame-Options

8. **Error Disclosure**
   - Verifica que stack traces não são expostos
   - Valida mensagens de erro genéricas
   - Testa endpoints inexistentes

9. **Password Security**
   - Verifica que senhas não são retornadas
   - Valida hashing de senhas
   - Testa força das senhas

10. **Mass Assignment**
    - Testa escalação de privilégios
    - Verifica proteção contra role injection
    - Valida campos permitidos

### Resultados Esperados

```
PASS tests/security.test.js
  Security Tests
    SQL Injection Protection
      ✓ should prevent SQL injection in email field (150ms)
      ✓ should prevent SQL injection in product search (45ms)
    XSS Protection
      ✓ should sanitize XSS in registration (120ms)
    Authentication & Authorization
      ✓ should reject requests without token (25ms)
      ✓ should reject invalid tokens (30ms)
      ✓ should reject expired tokens (35ms)
      ✓ should reject malformed Authorization header (40ms)
    Rate Limiting
      ✓ should enforce rate limits (25000ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
Time:        28.5s
```

---

## ⚡ Testes de Performance

### Executar Testes de Performance

```bash
# Testes com Jest
npm run test:performance

# Load Testing com Autocannon
npm run load-test
```

### Testes Incluídos

1. **Response Time Tests**
   - Health check: <100ms
   - Product listing: <500ms
   - Authentication: <300ms

2. **Database Query Optimization**
   - Consultas com índices
   - Múltiplos filtros
   - Joins otimizados

3. **Pagination Performance**
   - Páginas grandes
   - Limites de tamanho
   - Offset vs Cursor

4. **Memory Leak Detection**
   - 100 requisições sequenciais
   - Monitoramento de heap
   - Garbage collection

### Load Testing com Autocannon

O load test executa 3 cenários:

#### 1. Health Check Load Test
```
Connections: 100
Duration: 10s
Target: >1000 req/sec
```

#### 2. Product API Load Test
```
Connections: 50
Duration: 10s
Target: >500 req/sec
```

#### 3. Authentication Load Test
```
Connections: 20
Duration: 10s
Target: >100 req/sec
```

### Resultados Esperados

```
🔥 Starting Load Tests with Autocannon...

Test 1: Gateway Health Check
Requests/sec: 1250.5
Latency avg: 78ms
Throughput: 245000 bytes/sec

Test 2: Product Listing
Requests/sec: 620.3
Latency avg: 95ms
Throughput: 180000 bytes/sec

Test 3: Authentication Load
Requests/sec: 145.7
Latency avg: 135ms
Throughput: 65000 bytes/sec

📊 Performance Benchmarks:
✅ Health Check: PASS (Target: >1000 req/sec)
✅ Product API: PASS (Target: >500 req/sec)
✅ Auth API: PASS (Target: >100 req/sec)
✅ Latency: PASS (Target: <100ms)

📝 Performance report saved to: performance-report.json
```

### Relatório JSON Gerado

```json
{
  "timestamp": "2024-01-25T10:30:00.000Z",
  "tests": [
    {
      "name": "Health Check",
      "requestsPerSec": 1250.5,
      "latencyMs": 78,
      "throughput": 245000
    },
    {
      "name": "Product Listing",
      "requestsPerSec": 620.3,
      "latencyMs": 95,
      "throughput": 180000
    },
    {
      "name": "Authentication",
      "requestsPerSec": 145.7,
      "latencyMs": 135,
      "throughput": 65000
    }
  ]
}
```

---

## 🧪 Testes de Integração (Auth Service)

### Executar Testes de Integração

```bash
cd services/auth-service
npm test
```

### Cobertura de Código

```bash
npm test -- --coverage
```

### Resultados Esperados

```
PASS tests/integration/auth.integration.test.js
  Auth Service Integration Tests
    POST /api/auth/register
      ✓ should register a new user (150ms)
      ✓ should prevent duplicate email (45ms)
      ✓ should validate email format (30ms)
      ✓ should validate password length (35ms)
    POST /api/auth/login
      ✓ should login with correct credentials (120ms)
      ✓ should reject wrong password (80ms)
      ✓ should reject non-existent user (75ms)
    GET /api/auth/profile
      ✓ should return user profile with valid token (60ms)
      ✓ should reject without token (25ms)
      ✓ should reject with invalid token (30ms)
    POST /api/auth/verify
      ✓ should verify valid token (40ms)
      ✓ should reject invalid token (35ms)
    GET /health
      ✓ should return health status (20ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Coverage:    75% statements, 72% branches, 78% functions, 75% lines
```

---

## 📊 Interpretação de Resultados

### Testes de Segurança

#### ✅ PASS - Todos os testes passaram
- Sistema está protegido contra vulnerabilidades testadas
- Headers de segurança configurados corretamente
- Validações funcionando adequadamente

#### ⚠️ FAIL - Alguns testes falharam
- Revisar logs para identificar vulnerabilidade
- Verificar configuração de segurança
- Aplicar correções necessárias

#### ❌ ERROR - Erros de execução
- Verificar se serviços estão rodando
- Confirmar variáveis de ambiente
- Revisar logs de erro detalhados

### Testes de Performance

#### Métricas Aceitáveis

| Métrica | Alvo | Status |
|---------|------|--------|
| Health Check | >1000 req/sec | ✅ PASS |
| Product API | >500 req/sec | ✅ PASS |
| Auth API | >100 req/sec | ✅ PASS |
| Latency | <100ms | ✅ PASS |

#### Métricas Abaixo do Alvo

Se alguma métrica estiver abaixo do alvo:

1. **Verificar Recursos**
   - CPU: <80% uso
   - Memória: <70% uso
   - Disco: I/O <60%

2. **Otimizações Possíveis**
   - Adicionar cache Redis
   - Otimizar queries SQL
   - Aumentar pool de conexões
   - Adicionar índices no banco

3. **Escalabilidade**
   - Aumentar réplicas do serviço
   - Configurar load balancing
   - Implementar auto-scaling

---

## 🔧 Troubleshooting

### Testes de Segurança Falhando

**Problema:** Rate limiting test falha
```
Expected at least 1 rate limited response
Received: 0
```

**Solução:**
- Verificar se rate limiting está ativo no API Gateway
- Aumentar número de requisições no teste
- Verificar logs do gateway

---

**Problema:** Authentication tests falham
```
Token validation failed
```

**Solução:**
- Verificar JWT_SECRET nas variáveis de ambiente
- Confirmar que Auth Service está rodando
- Verificar formato do token

---

### Testes de Performance Ruins

**Problema:** Latência alta (>200ms)

**Diagnóstico:**
```bash
# Verificar conexões do banco
docker exec postgres pg_stat_activity

# Verificar uso de CPU
docker stats

# Verificar logs
docker logs auth-service
```

**Soluções:**
1. Adicionar cache Redis
2. Otimizar queries com EXPLAIN
3. Aumentar pool de conexões
4. Revisar índices do banco

---

**Problema:** Requests/sec baixo

**Diagnóstico:**
- Verificar se há gargalo no banco
- Monitorar threads/workers
- Verificar rate limiting

**Soluções:**
1. Escalar horizontalmente (mais containers)
2. Otimizar código assíncrono
3. Implementar connection pooling
4. Usar cache para leituras

---

## 📝 Boas Práticas

### Antes de Executar Testes

1. **Ambiente Limpo**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

2. **Aguardar Serviços**
   ```bash
   # Verificar health checks
   curl http://localhost:3000/health
   curl http://localhost:3001/api/auth/health
   ```

3. **Limpar Cache**
   ```bash
   redis-cli FLUSHALL
   ```

### Durante os Testes

- Não executar outros processos pesados
- Monitorar recursos do sistema
- Capturar logs de erro
- Documentar resultados

### Após os Testes

- Salvar relatórios gerados
- Comparar com benchmarks anteriores
- Identificar regressões
- Planejar otimizações

---

## 🎯 Objetivos dos Testes

### Testes de Segurança
- ✅ Verificar proteção contra vulnerabilidades OWASP Top 10
- ✅ Validar autenticação e autorização
- ✅ Confirmar sanitização de inputs
- ✅ Verificar headers de segurança

### Testes de Performance
- ✅ Estabelecer baseline de performance
- ✅ Identificar gargalos
- ✅ Validar escalabilidade
- ✅ Detectar memory leaks

### Testes de Integração
- ✅ Validar fluxos completos
- ✅ Testar comunicação entre services
- ✅ Verificar consistência de dados
- ✅ Confirmar tratamento de erros

---

## 📚 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Autocannon Documentation](https://github.com/mcollina/autocannon)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

*Última atualização: ${new Date().toLocaleDateString('pt-BR')}*
