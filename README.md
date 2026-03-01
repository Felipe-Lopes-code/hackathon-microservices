# EduShare - Plataforma de Auxílio aos Professores do Ensino Público

[![CI/CD](https://github.com/Felipe-Lopes-code/hackathon-microservices/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/Felipe-Lopes-code/hackathon-microservices/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: Audited](https://img.shields.io/badge/Security-Audited-green.svg)](AUDIT_REPORT.md)
[![Performance: Tested](https://img.shields.io/badge/Performance-Tested-blue.svg)](tests/performance.test.js)

**Plataforma educacional completa construída com arquitetura de microserviços para auxiliar professores do ensino público brasileiro na criação, compartilhamento e gestão de materiais didáticos.**

> **🎓 Hackathon 5FSDT - Postech** | **Tema:** Auxílio aos Professores no Ensino Público  
> **🔒 Projeto Auditado:** [Ver Relatório Completo](AUDIT_REPORT.md) | **Score: 93.75%** | **Status: ✅ APROVADO**

## 📚 Sobre o Projeto

A educação é um dos pilares fundamentais para o desenvolvimento social e econômico. Professores do ensino público brasileiro enfrentam inúmeros desafios: falta de recursos tecnológicos, necessidade de adaptar conteúdos para diferentes perfis de alunos, e dificuldade em compartilhar boas práticas com colegas.

**EduShare** é uma solução tecnológica que potencializa o trabalho dos educadores, oferecendo:
- 📝 **Repositório de Materiais Didáticos** - Acesso a atividades, provas e conteúdos criados por outros professores
- 🤝 **Compartilhamento Colaborativo** - Professores podem compartilhar e baixar materiais livremente
- 🎯 **Gestão de Conteúdo** - Organização eficiente de materiais por disciplina, série e tema
- 🔐 **Ambiente Seguro** - Acesso controlado para professores e alunos da rede pública

### Arquitetura de Microserviços

1. **Auth Service** - Autenticação e gestão de perfis
   - Cadastro e login de professores e alunos
   - Controle de acesso baseado em roles (professor/aluno)
   - Validação de vínculo com escola pública

2. **Material Service** - Catálogo de materiais didáticos
   - CRUD de atividades, provas, apostilas e recursos
   - Filtros por disciplina, série, tema e tipo
   - Sistema de categorização e tags
   - Controle de visibilidade (público/privado)

3. **Share Service** - Sistema de compartilhamento
   - Distribuição de materiais entre professores
   - Histórico de downloads e compartilhamentos
   - Sistema de favoritos e coleções
   - Estatísticas de uso

4. **Frontend Web** 
   - Interface responsiva construída com React
   - Biblioteca de recursos pedagógicos
   - Painel de gestão para professores
   - Portal de acesso para alunos

5. **Infraestrutura**
   - PostgreSQL para persistência de dados
   - Docker para containerização
   - CI/CD com GitHub Actions
   - Pronto para deploy em AWS/Azure

### 💡 Problemas Resolvidos

**Para Professores:**
- ✅ Dificuldade em criar materiais didáticos do zero
- ✅ Falta de tempo para elaborar atividades diversificadas
- ✅ Isolamento profissional e falta de troca de experiências
- ✅ Dificuldade em encontrar recursos de qualidade
- ✅ Necessidade de adaptar conteúdos para diferentes realidades

**Para Alunos:**
- ✅ Acesso limitado a materiais complementares
- ✅ Recursos concentrados apenas em sala de aula
- ✅ Dificuldade de estudar em casa

### 🛠️ Stack Tecnológica

- **Frontend:** React 18, Vite, CSS Modules
- **Backend:** Node.js 18+ com Express
- **Database:** PostgreSQL 15
- **Cache:** Redis (opcional)
- **Containerização:** Docker & Docker Compose
- **Cloud:** AWS (ECS, RDS) e Azure (ACI, PostgreSQL)
- **Testes:** Jest, Supertest
- **CI/CD:** GitHub Actions
- **Segurança:** JWT, bcrypt, Helmet.js, rate limiting

### 🏗️ Clean Architecture

Cada microserviço implementa Clean Architecture com separação clara de responsabilidades:

```
src/
├── domain/              # Entidades e regras de negócio
│   ├── entities/       # Material, Professor, Aluno
│   └── repositories/   # Interfaces
├── application/         # Casos de uso
│   └── useCases/       # Criar material, compartilhar, buscar
└── infrastructure/      # Implementações técnicas
    ├── database/       # Repositórios PostgreSQL
    ├── http/           # Controllers, rotas, middlewares
    └── logger/         # Sistema de logs
```

### 🔒 Segurança e Conformidade

**Proteções Implementadas:**
- ✅ Autenticação JWT com expiração
- ✅ Hash de senhas com bcrypt (10 salt rounds)
- ✅ Proteção contra SQL Injection (queries parametrizadas)
- ✅ Proteção contra XSS (Helmet.js + sanitização)
- ✅ Rate Limiting (100 requisições/15min)
- ✅ CORS configurado
- ✅ Validação de entrada (Joi)
- ✅ Headers de segurança (Helmet)
- ✅ LGPD compliant (dados educacionais protegidos)

**Auditoria de Segurança:** Score 93.75% ⭐⭐⭐⭐⭐

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Git

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/Felipe-Lopes-code/hackathon-microservices.git
cd hackathon-microservices

# 2. Inicie todos os serviços com Docker
docker-compose up -d

# Ou use os scripts auxiliares:
./start.sh  # Linux/Mac
start.bat   # Windows

# 3. Acesse a aplicação
# Frontend: http://localhost:3000
# API Gateway: http://localhost:3000/api
```

### Configuração Manual (Desenvolvimento)

```bash
# 1. Configure as variáveis de ambiente
cp api-gateway/.env.example api-gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
cp services/product-service/.env.example services/product-service/.env   # Material Service
cp services/order-service/.env.example services/order-service/.env       # Share Service

# 2. Instale as dependências
npm install

# 3. Inicie o banco de dados
docker-compose up -d postgres redis

# 4. Execute as migrações
npm run migrate

# 5. Inicie os serviços (em terminais separados)
cd api-gateway && npm run dev
cd services/auth-service && npm run dev
cd services/product-service && npm run dev   # Material Service
cd services/order-service && npm run dev     # Share Service
cd web-client && npm run dev
```

## 📖 Uso da Plataforma

### Para Professores

1. **Cadastro**
   - Acesse a plataforma e registre-se como professor
   - Informe dados da escola pública vinculada
   - Aguarde validação (automática para domínios .edu.br)

2. **Criar Material**
   - Acesse "Meus Materiais"
   - Clique em "Novo Material"
   - Preencha: título, descrição, disciplina, série, tipo
   - Faça upload de arquivos (PDF, DOCX, etc.)
   - Publique ou salve como rascunho

3. **Buscar e Compartilhar**
   - Use filtros por disciplina, série, tipo
   - Visualize materiais de outros professores
   - Baixe e adapte para sua realidade
   - Favorite materiais úteis

4. **Compartilhar com Alunos**
   - Selecione materiais da sua biblioteca
   - Gere link de acesso para turma
   - Acompanhe downloads e visualizações

### Para Alunos

1. **Acesso**
   - Cadastre-se com email da escola
   - Use código fornecido pelo professor

2. **Visualizar Materiais**
   - Acesse materiais compartilhados pelo professor
   - Baixe PDFs e arquivos
   - Estude em casa ou offline

## 🧪 Testes

```bash
# Testes unitários
cd services/auth-service && npm test

# Testes de integração
cd services/material-service && npm test

# Testes de segurança
cd tests && npm run test:security

# Testes de performance
cd tests && npm run load-test
```

## 📚 Documentação Completa

- **[README.md](README.md)** - Este arquivo (visão geral e quick start)
- **[RELATORIO_HACKATHON.md](RELATORIO_HACKATHON.md)** - 📊 Relatório oficial do Hackathon 5FSDT
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitetura detalhada com diagramas
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumo executivo do projeto
- **[TESTING.md](TESTING.md)** - Guia completo de testes
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guia de desenvolvimento
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Como contribuir com o projeto
- **[AUDIT_REPORT.md](AUDIT_REPORT.md)** - 🔒 Relatório de auditoria de segurança
- **[AUDIT_SUMMARY.md](AUDIT_SUMMARY.md)** - 📊 Resumo executivo da auditoria
- **[tests/TEST_GUIDE.md](tests/TEST_GUIDE.md)** - 🧪 Guia de execução de testes

## 🎯 Casos de Uso Reais

### Caso 1: Professora cadastra e publica material didático
**Problema:** Criou uma apostila de Matemática e quer disponibilizar para outros professores

**Solução EduShare:**
1. Registra-se na plataforma via `POST /auth/register` (nome, e-mail, senha)
2. Faz login e obtém token JWT via `POST /auth/login`
3. Cadastra o material via `POST /products` informando: título, descrição, categoria "Matemática" e imagem de capa
4. O material fica disponível no catálogo público para qualquer professor consultar

**Impacto:** O material criado por um professor fica acessível a toda a rede, reduzindo retrabalho

### Caso 2: Professor busca materiais por disciplina
**Problema:** Precisa de materiais de História mas não quer criar tudo do zero

**Solução EduShare:**
1. Acessa o catálogo público via `GET /products?category=História`
2. Visualiza a lista de materiais disponíveis com título, descrição e thumbnail
3. Consulta detalhes de um material específico via `GET /products/:id`
4. Identifica os mais relevantes para sua turma

**Impacto:** Encontra rapidamente recursos já prontos, filtrando por disciplina

### Caso 3: Professor solicita compartilhamento de materiais
**Problema:** Selecionou materiais de colegas e quer registrar uma solicitação formal de compartilhamento

**Solução EduShare:**
1. Autentica-se na plataforma (JWT)
2. Cria uma solicitação de compartilhamento via `POST /orders` com a lista de materiais desejados (itens e quantidades)
3. Acompanha o status da solicitação via `GET /orders/my-orders` (pending → confirmed → processing → shipped → delivered)
4. Recebe atualização quando o status muda via `PATCH /orders/:id/status`

**Impacto:** Fluxo organizado de distribuição de materiais com rastreabilidade de cada etapa

## 🏆 Diferenciais da Solução

| Característica | EduShare | Alternativas |
|---------------|----------|--------------|
| **Foco** | Professores públicos brasileiros | Geral/Internacional |
| **Custo** | Gratuito e open-source | Assinaturas pagas |
| **Catálogo** | CRUD completo de materiais por categoria | Repositórios estáticos |
| **Compartilhamento** | Fluxo de solicitação com status rastreável | Sem controle de distribuição |
| **Tecnologia** | Microserviços, Docker, CI/CD | Monolitos legados |
| **Segurança** | JWT, bcrypt, Helmet, rate limiting | Proteções básicas |
| **Arquitetura** | Clean Architecture com separação de camadas | Código acoplado |

## 🚀 Roadmap Futuro

### Fase 2 (Q2 2026)
- [ ] App mobile (React Native) para acesso offline
- [ ] Sistema de avaliação e rating de materiais
- [ ] Comunidade de discussão entre professores
- [ ] IA para sugestão de materiais personalizados

### Fase 3 (Q3 2026)
- [ ] Gamificação (badges, pontos para contribuidores)
- [ ] Integração com Google Classroom
- [ ] Editor de conteúdo integrado
- [ ] Vídeoaulas e webinars

### Fase 4 (Q4 2026)
- [ ] Analytics para gestores educacionais
- [ ] API pública para integração
- [ ] Marketplace de cursos para professores
- [ ] Certificação de materiais por especialistas

## 👥 Equipe Hackathon 5FSDT

- **Desenvolvimento Backend** - Arquitetura de microserviços
- **Desenvolvimento Frontend** - Interface React responsiva
- **DevOps & Infraestrutura** - Docker, CI/CD, Cloud
- **Segurança** - Auditoria e proteções
- **Documentação** - Guias e relatórios

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja [LICENSE](LICENSE) para detalhes.

**Copyright (c) 2026 Hackathon 5FSDT Team - Postech**

## 🤝 Como Contribuir

Aceitamos contribuições! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Reportar bugs
- Sugerir funcionalidades
- Enviar pull requests
- Melhorar documentação

## 📞 Contato e Suporte

- **Issues:** Use GitHub Issues para bugs e sugestões
- **Discussões:** GitHub Discussions para dúvidas
- **Email:** team@hackathon5fsdt.dev

---

**🎓 Desenvolvido para o Hackathon 5FSDT - Postech**  
**Tema:** Auxílio aos Professores e Professoras no Ensino Público  
**Data:** Fevereiro 2026