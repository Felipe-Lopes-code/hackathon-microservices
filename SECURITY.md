# Segurança - Gestão de Segredos e Boas Práticas

## ⚠️ Conteúdos Sensíveis

Este projeto utiliza variáveis de ambiente para gerenciar todas as credenciais. **NUNCA** commite segredos diretamente no código-fonte.

### O que NÃO deve ser commitado

| Tipo | Exemplo | Risco |
|------|---------|-------|
| Senhas de banco | `DB_PASSWORD=postgres123` | Acesso não autorizado ao banco |
| Segredos JWT | `JWT_SECRET=minha-chave` | Falsificação de tokens de autenticação |
| Chaves de API | `AWS_ACCESS_KEY_ID=AKIA...` | Acesso a recursos cloud |
| Certificados | `*.pem`, `*.key` | Interceptação de tráfego TLS |
| Arquivos `.env` | `.env`, `.env.production` | Exposição de todas as credenciais |

### Arquivos protegidos pelo `.gitignore`

```
.env
.env.local
.env.*.local
.env.production
.env.staging
*.tfstate
*.tfvars
*.pem
*.key
*.crt
*.p12
```

---

## 🔧 Configuração Inicial

### 1. Copie os templates de ambiente

```bash
# Raiz do projeto (usado pelo docker-compose)
cp .env.example .env

# Serviços individuais (para desenvolvimento local)
cp services/auth-service/.env.example services/auth-service/.env
cp services/product-service/.env.example services/product-service/.env
cp services/order-service/.env.example services/order-service/.env
cp api-gateway/.env.example api-gateway/.env
cp web-client/.env.example web-client/.env
```

### 2. Gere credenciais seguras

```bash
# Linux/macOS - gerar senha aleatória
openssl rand -base64 32

# PowerShell - gerar senha aleatória
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

### 3. Edite o `.env` com valores seguros

```env
POSTGRES_PASSWORD=<senha_gerada_acima>
JWT_SECRET=<outra_senha_gerada_acima>
```

> **Importante:** A `JWT_SECRET` deve ter pelo menos 32 caracteres para segurança adequada.

---

## 🛡️ Boas Práticas

### Desenvolvimento
- Use o arquivo `.env.example` como referência — ele contém apenas placeholders
- Nunca copie credenciais de produção para o ambiente de desenvolvimento
- Use senhas diferentes para cada ambiente (dev, staging, prod)

### Produção
- Utilize um gerenciador de segredos (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
- Rotacione credenciais periodicamente
- Habilite autenticação Redis com senha (`requirepass`)
- Use conexões TLS para o banco de dados
- A infraestrutura Terraform já está configurada para usar `random_password` e gerenciadores de segredos

### CI/CD
- Configure segredos via GitHub Secrets (já implementado no workflow)
- Nunca logue variáveis de ambiente com credenciais nos pipelines
- Use OIDC em vez de chaves estáticas quando possível

---

## 🔍 Verificação de Segredos

### Usando Gitleaks (recomendado)

```bash
# Instalar
# macOS: brew install gitleaks
# Windows: choco install gitleaks
# Linux: snap install gitleaks

# Verificar repositório inteiro
gitleaks detect --source . --verbose

# Verificar antes de cada commit (pre-commit hook)
gitleaks protect --staged --verbose
```

### Git pre-commit hook

Crie o arquivo `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook para detectar segredos

# Verificar se gitleaks está instalado
if command -v gitleaks &> /dev/null; then
    gitleaks protect --staged --verbose
    if [ $? -ne 0 ]; then
        echo "❌ Segredos detectados! Commit bloqueado."
        echo "Remova os segredos antes de commitar."
        exit 1
    fi
fi

# Verificar padrões comuns de segredos
if git diff --cached --name-only | xargs grep -l -i 'password\s*=\s*[a-zA-Z0-9]' 2>/dev/null | grep -v '.example\|\.md\|tests/'; then
    echo "❌ Possível senha hardcoded detectada!"
    exit 1
fi
```

---

## 📋 Checklist de Segurança

- [ ] Arquivo `.env` NÃO está no controle de versão
- [ ] Senhas de banco de dados são fortes (>16 caracteres, aleatórias)
- [ ] `JWT_SECRET` tem pelo menos 32 caracteres aleatórios
- [ ] Redis possui autenticação configurada em produção
- [ ] Conexões de banco usam TLS em produção
- [ ] GitHub Secrets configurados para CI/CD
- [ ] Gitleaks ou ferramenta similar configurada
- [ ] Credenciais são diferentes entre ambientes (dev/staging/prod)
- [ ] Rotação de segredos está agendada
