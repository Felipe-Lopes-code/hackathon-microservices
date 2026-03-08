<div align="center">

# 📘 RELATÓRIO DO PROJETO

### EduShare — Plataforma Colaborativa de Materiais Didáticos para Professores do Ensino Público

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: Audited](https://img.shields.io/badge/Security-Audited-green.svg)](AUDIT_REPORT.md)
[![Hackathon](https://img.shields.io/badge/Hackathon-5FSDT%20Postech-blue.svg)](#)

</div>

---

| Campo | Detalhe |
|:---|:---|
| **Evento** | Hackathon 5FSDT — Postech |
| **Tema** | Auxílio aos Professores e Professoras no Ensino Público |
| **Equipe** | Hackathon 5FSDT Team |
| **Data de Entrega** | Fevereiro de 2026 |
| **Licença** | MIT (Open Source) |
| **Repositório** | [github.com/Felipe-Lopes-code/hackathon-microservices](https://github.com/Felipe-Lopes-code/hackathon-microservices) |

---

# 📋 1. Resumo Executivo

O **EduShare** é uma plataforma tecnológica open-source, construída sobre uma arquitetura de microserviços moderna e escalável, desenvolvida para enfrentar desafios estruturais vivenciados por professores da rede pública de ensino brasileira. A solução funciona como um **repositório colaborativo** — um "GitHub para educadores" — onde docentes podem criar, publicar, buscar, baixar, compartilhar e adaptar materiais didáticos de qualidade de forma **gratuita, segura e descentralizada**.

### Objetivo Central

Democratizar o acesso a recursos pedagógicos de qualidade, reduzir o tempo de preparação de aulas e fomentar a colaboração entre professores da rede pública, criando uma comunidade nacional de troca de conhecimento e boas práticas educacionais.

### Impacto Esperado

| Público-Alvo | Impacto |
|---|---|
| **Professores** | Economia de 4–6 horas semanais em criação de materiais |
| **Alunos** | Acesso a conteúdos diversificados e de qualidade |
| **Escolas** | Redução de custos com fotocópias e materiais impressos |
| **Rede Pública** | Padronização e melhoria da qualidade educacional |

### Metas em 6 Meses

- 1.000 professores cadastrados  
- 5.000 materiais didáticos compartilhados  
- 50.000 downloads realizados  
- Cobertura em pelo menos 5 estados brasileiros  

> **Score de Auditoria de Segurança: 93,75%** — classificação "Excelente", aprovado em todas as categorias avaliadas (Segurança, Performance, Arquitetura, Código Limpo, Testes e Conformidade LGPD).

---

# 🔍 2. Problema Identificado

## 2.1 Contexto da Educação Pública Brasileira

A educação é um dos pilares fundamentais para o desenvolvimento social e econômico do Brasil. No entanto, professores do ensino público — que representam a maioria dos 2,2 milhões de docentes do país (INEP, 2024) — enfrentam barreiras estruturais que impactam diretamente a qualidade do ensino oferecido.

## 2.2 Desafios Principais

### Falta de Recursos Tecnológicos e Materiais
- 67% das escolas públicas **não possuem** acesso adequado a materiais didáticos atualizados  
- Orçamento limitado para aquisição de livros, apostilas e recursos pedagógicos  
- Infraestrutura tecnológica precária em grande parte das unidades escolares  

### Sobrecarga de Trabalho
- Professores dedicam em média **10-15 horas semanais** exclusivamente à criação de materiais  
- Jornadas duplas ou triplas comprometem o tempo dedicado à preparação de aulas  
- Necessidade constante de personalizar conteúdos para diferentes perfis de alunos  

### Isolamento Profissional
- Falta de canais efetivos de comunicação entre professores de diferentes escolas  
- Dificuldade em compartilhar experiências e boas práticas com colegas  
- Ausência de comunidades colaborativas estruturadas no contexto público  

### Desigualdade Regional
- Professores em regiões remotas têm acesso ainda mais limitado a recursos  
- Disparidade significativa na qualidade dos materiais entre zonas urbanas e rurais  
- Dificuldade de atualização profissional contínua em localidades isoladas  

### Adaptação ao Contexto Local
- Materiais genéricos não consideram realidades socioeconômicas específicas  
- Necessidade de adequar conteúdos à diversidade cultural brasileira  
- Dificuldade em encontrar exemplos e casos práticos contextualizados  

## 2.3 Dados Quantitativos

| Indicador | Valor |
|---|---|
| Professores na rede pública brasileira | **2,2 milhões** (INEP, 2024) |
| Relatam falta de tempo para preparar aulas | **70%** |
| Gastos anuais por escola com fotocópias | **R$ 3.000 – 5.000** |
| Gostariam de mais ferramentas digitais de apoio | **85%** |
| Têm acesso regular a repositórios de materiais | **Apenas 30%** |

## 2.4 Consequências Observadas

- Queda progressiva na qualidade do ensino  
- Desmotivação profissional e aumento do *burnout* entre docentes  
- Evasão escolar de alunos em contextos mais vulneráveis  
- Desperdício de tempo e recursos com retrabalho  
- Perpetuação de desigualdades educacionais entre regiões  

## 2.5 Justificativa

Investir em ferramentas que auxiliem professores é **multiplicar impacto**:

- **1 professor** atende em média **150 alunos/ano**  
- **1.000 professores** impactam **150.000 alunos**  
- Materiais compartilhados podem ser reutilizados infinitamente  
- Tecnologia tem baixo custo marginal de distribuição  

> **ROI Social:** cada hora economizada pelo professor é diretamente reinvestida em melhorias pedagógicas, planejamento e atenção individualizada aos alunos.

---

# 💡 3. Descrição da Solução

## 3.1 Visão Geral

O **EduShare** é uma plataforma web gratuita e open-source que funciona como um repositório colaborativo de materiais didáticos. Professores podem:

- **Criar e publicar** materiais didáticos (atividades, provas, apostilas, slides)  
- **Buscar e baixar** recursos criados por outros professores  
- **Compartilhar** materiais com alunos de forma controlada  
- **Organizar** conteúdos em coleções temáticas  
- **Colaborar** com colegas de todo o Brasil  
- **Adaptar** materiais para suas realidades locais  

## 3.2 Funcionalidades Principais

### Para Professores

| Funcionalidade | Descrição |
|---|---|
| **Repositório de Materiais** | Upload de PDF, DOCX, PPT, XLSX, imagens; categorização por disciplina, série, tema e tipo; sistema de tags; versionamento; controle de visibilidade |
| **Busca Avançada** | Busca textual inteligente com filtros por disciplina, série, tipo, popularidade e novidade; resultados ranqueados por relevância |
| **Compartilhamento P2P** | Compartilhamento peer-to-peer entre professores; geração de links para alunos; controle de acesso por turma; estatísticas de uso |
| **Gestão de Coleções** | Criação de coleções temáticas; coleções públicas ou privadas; colaboração entre professores; export completo |
| **Perfil e Comunidade** | Perfil público; sistema de reputação; badges e reconhecimentos |

### Para Alunos

| Funcionalidade | Descrição |
|---|---|
| **Acesso a Materiais** | Visualização do conteúdo compartilhado pelo professor; download para estudo offline; interface simplificada |
| **Organização Pessoal** | Biblioteca pessoal de materiais; marcação de favoritos; histórico de acesso |

## 3.3 Como a Solução Atende ao Problema

| Problema | Solução EduShare |
|---|---|
| Falta de tempo para criar materiais | Repositório com milhares de materiais prontos para baixar e adaptar |
| Isolamento profissional | Comunidade colaborativa nacional com compartilhamento P2P |
| Falta de recursos tecnológicos | Plataforma 100% gratuita e open-source, acessível via navegador |
| Desigualdade regional | Acesso universal via internet; download offline para áreas de conectividade limitada |
| Materiais genéricos | Sistema de tags e filtros que permite encontrar conteúdos contextualizados |

## 3.4 Diferenciais Competitivos

| Característica | EduShare | Google Drive | Plataformas Comerciais |
|---|---|---|---|
| **Foco** | Professores públicos BR | Geral | Internacional/pago |
| **Custo** | 100% Gratuito | Freemium | R$ 30–100/mês |
| **Descoberta** | Busca semântica pedagógica | Busca por nome | Catálogo fechado |
| **Colaboração** | P2P entre professores | Compartilhamento manual | Top-down |
| **Contexto** | Realidade brasileira | Genérico | Descontextualizado |
| **LGPD** | Compliant desde o dia 1 | Genérico | Variável |
| **Open Source** | Sim (MIT) | Não | Não |

## 3.5 Fluxo de Uso

### Jornada do Professor

```
 1. Cadastro/Login
       │
 2. Buscar materiais existentes
       ├── Encontrou? → Baixar e adaptar
       └── Não encontrou? → Criar novo material
       │
 3. Upload de material
       ├── Preencher metadados (disciplina, série, tags)
       ├── Fazer upload do arquivo
       └── Definir visibilidade (público/privado/restrito)
       │
 4. Publicar no repositório
       │
 5. Compartilhar
       ├── Com outros professores (link público)
       └── Com alunos (link/código da turma)
       │
 6. Acompanhar estatísticas (downloads, curtidas, visualizações)
```

### Jornada do Aluno

```
 1. Receber link ou código do professor
       │
 2. Acessar a plataforma
       │
 3. Visualizar materiais disponíveis
       │
 4. Baixar para estudo offline
       │
 5. (Opcional) Criar conta para biblioteca pessoal
```

---

# 🚀 4. Processo de Desenvolvimento

## 4.1 Metodologia

A equipe adotou uma abordagem **Ágil e Iterativa** fundamentada em **Design Thinking**, organizada em seis fases sequenciais:

### Fase 1 — Empatia e Pesquisa (1 dia)

- **Mapa de Empatia**: identificação de dores, ganhos e necessidades reais de professores  
- **Persona**: criação da "Professora Ana" — 35 anos, ensina Matemática no ensino médio público, jornada de 40h/semana, sem tempo para criar materiais do zero  
- **Benchmark**: análise de soluções existentes (Google Classroom, Khan Academy, Nova Escola)  
- **Dados**: levantamento de estatísticas oficiais sobre a educação pública no Brasil (INEP, 2024)  

### Fase 2 — Definição do Problema (0,5 dia)

- **Problem Statement**: *"Professores da rede pública precisam de uma forma fácil, rápida e colaborativa de acessar e compartilhar materiais didáticos de qualidade, porque não têm tempo nem recursos para criar tudo do zero"*  
- **Priorização**: matriz Impacto × Esforço para seleção de funcionalidades  
- **MVP**: definição do escopo mínimo viável  

### Fase 3 — Ideação (0,5 dia)

- **Brainstorming**: mais de 50 ideias geradas pela equipe  
- **Crazy 8**: cada membro desenhou 8 soluções em 8 minutos  
- **Votação**: seleção das 3 melhores propostas  
- **Convergência**: plataforma de compartilhamento P2P de materiais didáticos  

### Fase 4 — Prototipação (1 dia)

- **Wireframes**: prototipação no Figma com 12 telas principais  
- **User Flow**: mapeamento detalhado das jornadas de professor e aluno  
- **Arquitetura**: desenho da arquitetura de microserviços  
- **Stack**: definição das tecnologias e ferramentas  

### Fase 5 — Desenvolvimento (3 dias)

| Sprint | Foco | Entregáveis |
|---|---|---|
| **Sprint 1** | Auth Service + Estrutura base | Registro, login, JWT, Clean Architecture |
| **Sprint 2** | Material Service + Upload | CRUD de materiais, busca, categorização |
| **Sprint 3** | Share Service + Interface | Compartilhamento, frontend React, integração |

- **Daily Standups**: sincronização diária de 15 minutos  

### Fase 6 — Testes e Validação (1 dia)

- **Testes Unitários**: Jest com cobertura > 60%  
- **Testes de Integração**: Supertest para APIs  
- **Testes de Segurança**: validação contra OWASP Top 10  
- **Testes de Usabilidade**: 3 professores testaram a plataforma  

## 4.2 Ferramentas de Colaboração

| Categoria | Ferramenta |
|---|---|
| Comunicação | Discord (mensagens) + Zoom (reuniões) |
| Gerenciamento | Trello (Kanban board) |
| Design | Figma (protótipos) + Miro (brainstorming) |
| Código | GitHub (versionamento + CI/CD) |
| Documentação | Markdown + GitHub Wiki |

## 4.3 Divisão de Tarefas

| Membro | Responsabilidade | Entregáveis |
|---|---|---|
| **Dev 1** | Backend — Autenticação | Auth Service, JWT, segurança, LGPD |
| **Dev 2** | Backend — Materiais | Material Service, upload, busca, categorização |
| **Dev 3** | Backend — Compartilhamento | Share Service, estatísticas, favoritos |
| **Dev 4** | Frontend | Interface React, componentes, UX |
| **Dev 5** | DevOps & Infra | Docker, CI/CD, documentação, Terraform |

## 4.4 Desafios e Soluções

| Desafio | Solução Adotada | Resultado |
|---|---|---|
| Tempo limitado de desenvolvimento | Priorização rigorosa de funcionalidades com MoSCoW | Core features funcionais entregues no prazo |
| Sincronização entre microserviços | API Gateway centralizado com contratos bem definidos | Integração fluida entre todos os serviços |
| Upload de arquivos grandes | Streams do Node.js com validação de tamanho | Upload eficiente de PDFs até 50 MB |
| Conformidade LGPD | Implementação desde o início (Privacy by Design) | Score de auditoria de **93,75%** |

---

# ⚙️ 5. Detalhes Técnicos

## 5.1 Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Função |
|---|---|---|
| **Node.js** | 18 LTS | Runtime JavaScript server-side |
| **Express.js** | 4.18 | Framework HTTP para APIs REST |
| **PostgreSQL** | 15 | Banco de dados relacional principal |
| **Redis** | 7 | Cache e gerenciamento de sessões (opcional) |
| **pg (node-postgres)** | — | Driver nativo para PostgreSQL |
| **jsonwebtoken** | — | Autenticação JWT stateless |
| **bcryptjs** | — | Hash seguro de senhas (10 salt rounds) |
| **Joi** | — | Validação de schemas de entrada |
| **Helmet.js** | — | Security headers HTTP |
| **express-rate-limit** | — | Rate limiting (100 req/15min) |
| **Winston** | — | Sistema de logging estruturado |

### Frontend

| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 18 | Biblioteca de interface de usuário |
| **Vite** | 4 | Build tool e dev server |
| **Zustand** | — | State management minimalista |
| **React Router** | 6 | Roteamento client-side (SPA) |
| **Axios** | — | Cliente HTTP para consumo de APIs |
| **CSS Modules** | — | Estilização com escopo isolado |

### Infraestrutura e DevOps

| Tecnologia | Função |
|---|---|
| **Docker** + **Docker Compose** | Containerização e orquestração local |
| **Nginx** | Web server para servir o frontend |
| **GitHub Actions** | Pipeline CI/CD (build, test, deploy) |
| **Terraform** | Infraestrutura como código (AWS e Azure) |
| **ESLint** + **Prettier** | Qualidade e padronização de código |
| **Jest** + **Supertest** | Testes unitários e de integração |

### Cloud — Infraestrutura como Código

| Provider | Recursos |
|---|---|
| **AWS** | ECS (containers), RDS (PostgreSQL), ALB (load balancer), Secrets Manager |
| **Azure** | ACI (containers), PostgreSQL Flexible Server, Key Vault |

## 5.2 Arquitetura do Sistema

O EduShare adota uma **arquitetura de microserviços** com **Clean Architecture (DDD)** em cada serviço, garantindo escalabilidade horizontal, independência de deploy e alta testabilidade.

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE APRESENTAÇÃO                    │
│                                                             │
│   ┌───────────────────────────────────────────────────┐     │
│   │            Web Client (React + Vite)              │     │
│   │   • Interface responsiva para desktop e mobile    │     │
│   │   • Componentes reutilizáveis                     │     │
│   │   • State management com Zustand                  │     │
│   └─────────────────────┬─────────────────────────────┘     │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP / REST
┌─────────────────────────▼───────────────────────────────────┐
│                   CAMADA DE APLICAÇÃO                       │
│                                                             │
│   ┌───────────────────────────────────────────────────┐     │
│   │              API Gateway (:3000)                  │     │
│   │   • Proxy reverso e roteamento inteligente        │     │
│   │   • Rate Limiting (100 req/15min)                 │     │
│   │   • CORS configurado por domínio                  │     │
│   │   • Logging centralizado (Winston)                │     │
│   └───────┬────────────┬──────────────┬───────────────┘     │
│           │            │              │                     │
│   ┌───────▼──────┐ ┌──▼────────┐ ┌───▼──────────┐          │
│   │ Auth Service │ │ Material  │ │   Share      │          │
│   │   (:3001)    │ │ Service   │ │  Service     │          │
│   │              │ │  (:3002)  │ │   (:3003)    │          │
│   │ • Register   │ │ • CRUD    │ │ • P2P Share  │          │
│   │ • Login      │ │ • Upload  │ │ • Downloads  │          │
│   │ • JWT/RBAC   │ │ • Search  │ │ • Favoritos  │          │
│   │ • Profiles   │ │ • Tags    │ │ • Stats      │          │
│   └───────┬──────┘ └──┬────────┘ └───┬──────────┘          │
│           │            │              │                     │
└───────────┼────────────┼──────────────┼─────────────────────┘
            │            │              │
┌───────────▼────────────▼──────────────▼─────────────────────┐
│                   CAMADA DE DADOS                           │
│                                                             │
│   ┌───────────────────────────────────────────────────┐     │
│   │              PostgreSQL 15                        │     │
│   │   • auth_db     (usuários, roles, escolas)        │     │
│   │   • material_db (materiais, tags, categorias)     │     │
│   │   • share_db    (compartilhamentos, downloads)    │     │
│   └───────────────────────────────────────────────────┘     │
│                                                             │
│   ┌───────────────────────────────────────────────────┐     │
│   │              Redis 7 (Cache)                      │     │
│   │   • Cache de sessões e tokens                     │     │
│   │   • Cache de consultas frequentes                 │     │
│   └───────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Clean Architecture — Estrutura Interna dos Microserviços

Cada microserviço segue princípios de **Clean Architecture** e **Domain-Driven Design**, com três camadas claramente separadas:

```
src/
├── domain/                 # Camada de Domínio (regras de negócio puras)
│   ├── entities/           #   Material, Professor, Compartilhamento
│   └── repositories/       #   Interfaces (IMaterialRepository, etc.)
│
├── application/            # Camada de Aplicação (casos de uso)
│   └── useCases/           #   CriarMaterial, BuscarMaterial, Compartilhar
│
└── infrastructure/         # Camada de Infraestrutura (implementações)
    ├── database/           #   PostgresRepositories (implementação concreta)
    ├── http/               #   Controllers, Routes, Middlewares
    └── logger/             #   Winston logger
```

**Vantagens desta arquitetura:**
- Independência de frameworks e bibliotecas externas  
- Alta testabilidade (domínio puro, sem side effects)  
- Regras de negócio isoladas e reutilizáveis  
- Fácil substituição de dependências (ex.: trocar PostgreSQL por MongoDB)  

### Modelo de Dados

#### Auth Service (`auth_db`)

```sql
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('professor','aluno','admin')),
    school_name     VARCHAR(255),
    school_state    VARCHAR(2),
    school_city     VARCHAR(100),
    verified        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Material Service (`material_db`)

```sql
CREATE TABLE materials (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    author_id        INTEGER NOT NULL,
    discipline       VARCHAR(50) NOT NULL,
    grade_level      VARCHAR(50) NOT NULL,
    material_type    VARCHAR(50) NOT NULL,
    tags             TEXT[],
    file_url         VARCHAR(500),
    visibility       VARCHAR(20) DEFAULT 'public',
    downloads_count  INTEGER DEFAULT 0,
    likes_count      INTEGER DEFAULT 0,
    views_count      INTEGER DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Share Service (`share_db`)

```sql
CREATE TABLE shares (
    id              SERIAL PRIMARY KEY,
    material_id     INTEGER NOT NULL,
    shared_by       INTEGER NOT NULL,
    share_type      VARCHAR(20) CHECK (share_type IN ('professor','aluno','public')),
    access_code     VARCHAR(50) UNIQUE,
    expires_at      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE downloads (
    id              SERIAL PRIMARY KEY,
    material_id     INTEGER NOT NULL,
    user_id         INTEGER,
    downloaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    id              SERIAL PRIMARY KEY,
    material_id     INTEGER NOT NULL,
    user_id         INTEGER NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(material_id, user_id)
);
```

### APIs e Endpoints

#### Auth Service (`:3001`)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar novo usuário |
| `POST` | `/api/auth/login` | Fazer login e obter JWT |
| `POST` | `/api/auth/verify` | Verificar validade do token |
| `GET` | `/api/auth/profile` | Obter perfil do usuário logado |
| `PUT` | `/api/auth/profile` | Atualizar perfil |
| `GET` | `/api/auth/health` | Health check |

#### Material Service (`:3002`)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/materials` | Criar novo material |
| `GET` | `/api/materials` | Listar materiais (com filtros) |
| `GET` | `/api/materials/:id` | Obter material específico |
| `PUT` | `/api/materials/:id` | Atualizar material |
| `DELETE` | `/api/materials/:id` | Deletar material |
| `POST` | `/api/materials/:id/upload` | Upload de arquivo |
| `GET` | `/api/materials/search` | Busca avançada |
| `GET` | `/api/materials/my` | Materiais do usuário logado |

#### Share Service (`:3003`)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/shares` | Criar compartilhamento |
| `GET` | `/api/shares` | Listar compartilhamentos |
| `GET` | `/api/shares/:code` | Acessar via código |
| `POST` | `/api/downloads` | Registrar download |
| `GET` | `/api/downloads/stats` | Estatísticas de downloads |
| `POST` | `/api/favorites` | Adicionar favorito |
| `GET` | `/api/favorites` | Listar favoritos |
| `DELETE` | `/api/favorites/:id` | Remover favorito |

### Segurança Implementada

| Camada | Proteções |
|---|---|
| **Autenticação** | JWT com expiração de 24h; refresh tokens; Role-Based Access Control (professor/aluno/admin) |
| **Proteção de Dados** | Hash bcrypt (10 rounds); variáveis de ambiente para secrets; HTTPS ready; validação Joi |
| **Proteções Web** | Helmet.js (security headers); CORS (whitelist); Rate limiting (100 req/15min/IP); Anti SQL Injection; Anti XSS |
| **Conformidade LGPD** | Consentimento explícito; política de privacidade; direito ao esquecimento; portabilidade de dados; minimização de coleta |

#### Resultado da Auditoria de Segurança

| Categoria | Score | Status |
|---|---|---|
| Segurança | 95/100 | ✅ Excelente |
| Performance | 75/100 | ✅ Bom |
| Arquitetura | 95/100 | ✅ Excelente |
| Código Limpo | 90/100 | ✅ Excelente |
| Testes | 80/100 | ✅ Bom |
| Conformidade LGPD | 95/100 | ✅ Excelente |
| **Score Global** | **93,75%** | **✅ APROVADO** |

### Containerização e Deploy

Todos os serviços são containerizados com **Docker** e orquestrados com **Docker Compose**:

| Container | Porta | Descrição |
|---|---|---|
| `web-client` | 3000 | Frontend React (servido por Nginx) |
| `api-gateway` | 3000 | Proxy reverso e roteamento |
| `auth-service` | 3001 | Serviço de autenticação |
| `product-service` | 3002 | Serviço de materiais didáticos |
| `order-service` | 3003 | Serviço de compartilhamento |
| `postgres` | 5432 | PostgreSQL 15 (3 databases isolados) |
| `redis` | 6379 | Cache Redis 7 |

### CI/CD Pipeline (GitHub Actions)

```
 Push / PR → Lint (ESLint) → Build → Testes Unitários → Testes de Integração → Deploy
```

---

# 🔗 6. Links Úteis

## Repositório de Código

| Recurso | Link |
|---|---|
| **GitHub (repositório principal)** | [github.com/Felipe-Lopes-code/hackathon-microservices](https://github.com/Felipe-Lopes-code/hackathon-microservices) |

### Estrutura do Repositório

```
hackathon-microservices/
│
├── api-gateway/              # API Gateway (Node.js + Express)
│   └── src/
│       ├── proxy/            # Configuração de proxy reverso
│       ├── swagger/          # Documentação Swagger das APIs
│       └── utils/            # Logger e utilitários
│
├── services/
│   ├── auth-service/         # Serviço de Autenticação
│   │   ├── src/              # Código-fonte (Clean Architecture)
│   │   └── tests/            # Testes unitários e integração
│   │
│   ├── product-service/      # Serviço de Materiais Didáticos
│   │   ├── src/              # Código-fonte (Clean Architecture)
│   │   └── tests/            # Testes unitários
│   │
│   └── order-service/        # Serviço de Compartilhamento
│       ├── src/              # Código-fonte (Clean Architecture)
│       └── tests/            # Testes unitários
│
├── web-client/               # Frontend React + Vite
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       ├── pages/            # Páginas da aplicação
│       ├── services/         # Chamadas API (Axios)
│       └── store/            # Estado global (Zustand)
│
├── shared/                   # Utilitários compartilhados
│   ├── cache/                # Cache manager (Redis)
│   ├── database/             # Pool manager (PostgreSQL)
│   └── utils/                # Token generator, helpers
│
├── infrastructure/           # Infraestrutura como Código
│   ├── aws/                  # Terraform para AWS
│   └── azure/                # Terraform para Azure
│
├── tests/                    # Testes globais
│   ├── security.test.js      # Testes de segurança
│   ├── performance.test.js   # Testes de carga
│   └── swagger-validation.test.js
│
├── docker-compose.yml        # Orquestração (desenvolvimento)
├── docker-compose-prod.yml   # Orquestração (produção)
├── init-databases.sql        # Inicialização dos bancos
│
├── ARCHITECTURE.md           # Documentação de arquitetura
├── DEVELOPMENT.md            # Guia para desenvolvedores
├── TESTING.md                # Guia de testes
├── SECURITY.md               # Políticas de segurança
└── README.md                 # Visão geral do projeto
```

## Protótipos Visuais

| Ferramenta | Uso |
|---|---|
| **Figma** | Wireframes com 12 telas principais da plataforma (cadastro, login, home, busca, upload, perfil, etc.) |
| **Miro** | Brainstorming, mapa de empatia, matriz Impacto × Esforço, user flows |

## Documentos Adicionais

| Documento | Descrição |
|---|---|
| [`README.md`](README.md) | Visão geral, quick start e instruções de instalação |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Arquitetura detalhada com diagramas |
| [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) | Resumo completo do projeto |
| [`DEVELOPMENT.md`](DEVELOPMENT.md) | Setup do ambiente de desenvolvimento |
| [`TESTING.md`](TESTING.md) | Guia de testes e endpoints |
| [`SECURITY.md`](SECURITY.md) | Políticas de segurança e gestão de secrets |
| [`AUDIT_REPORT.md`](AUDIT_REPORT.md) | Relatório de auditoria de segurança |
| [`IMPROVEMENT_PLAN.md`](IMPROVEMENT_PLAN.md) | Plano de melhorias e correções |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Guia de contribuição open-source |

## Deploy e Demonstração

| Item | Detalhes |
|---|---|
| **Demo Local** | Via Docker Compose — veja `README.md` para instruções |
| **Comando de Inicialização** | Windows: `start.bat` / Linux: `./start.sh` |

---

# 🌱 7. Aprendizados e Próximos Passos

## 7.1 O Que a Equipe Aprendeu

### Aprendizados Técnicos

| Tema | Aprendizado |
|---|---|
| **Microserviços** | Compreensão prática dos benefícios (escalabilidade, independência) e desafios (complexidade operacional, consistência eventual) de arquiteturas distribuídas |
| **Clean Architecture** | A separação rigorosa de responsabilidades melhora dramaticamente a testabilidade e facilita a manutenção a longo prazo |
| **Docker** | Containerização elimina o clássico "funciona na minha máquina" e simplifica tanto o desenvolvimento local quanto o deployment |
| **Segurança** | LGPD e OWASP Top 10 devem ser considerados **desde o início** do projeto — adotar *Privacy by Design* é muito mais eficiente do que corrigir depois |
| **Testes** | Investir em cobertura de testes economiza tempo significativo em debugging e aumenta a confiança em deploys |

### Aprendizados de Soft Skills

| Tema | Aprendizado |
|---|---|
| **Trabalho em equipe** | Comunicação clara e frequente é essencial em projetos com múltiplos componentes |
| **Gerenciamento de tempo** | Priorização rigorosa (MoSCoW) foi crucial para entregar valor dentro do prazo do hackathon |
| **Design Thinking** | Empatia genuína com o usuário final gera soluções mais relevantes e impactantes |
| **Agilidade** | Iterações rápidas e feedback constante permitem ajustes frequentes na direção correta |

### Aprendizados Sobre Educação

| Tema | Aprendizado |
|---|---|
| **Impacto social** | Tecnologia aplicada à educação pode democratizar acesso a conteúdos de qualidade em escala nacional |
| **Contexto importa** | Soluções genéricas ou importadas não atendem adequadamente a realidade brasileira — é preciso desenvolver com empatia local |
| **Efeito multiplicador** | Impactar **1 professor** significa impactar **150 alunos por ano** — o ROI social é extraordinário |

## 7.2 O Que Pode Ser Aprimorado ou Adicionado no Futuro

### Curto Prazo (1–2 meses)

- [ ] **Aplicativo mobile** — React Native para iOS e Android  
- [ ] **Editor de texto integrado** — criar materiais sem sair da plataforma  
- [ ] **Sistema de notificações** — alertas de novos materiais relevantes  
- [ ] **Comentários e avaliações** — sistema de feedback sobre materiais  
- [ ] **Busca semântica com IA** — recomendações personalizadas por perfil  

### Médio Prazo (3–6 meses)

- [ ] **Gamificação** — badges, pontos, rankings para incentivar contribuições  
- [ ] **Integração Google Classroom** — import/export de materiais  
- [ ] **Suporte a videoaulas** — hospedagem e streaming de vídeos educacionais  
- [ ] **Comunidade e fórum** — espaço de discussão entre professores  
- [ ] **API pública** — permitir integrações com sistemas educacionais de terceiros  
- [ ] **Analytics avançados** — dashboards para gestores escolares e secretarias  

### Longo Prazo (6–12 meses)

- [ ] **Certificação de materiais** — validação por especialistas do MEC  
- [ ] **Marketplace de cursos** — capacitação continuada de professores  
- [ ] **IA generativa para conteúdo** — geração automática de atividades, provas e quizzes  
- [ ] **Tradução automática** — expansão para América Latina (espanhol)  
- [ ] **Integração com INEP/MEC** — conectar aos dados oficiais de escolas públicas  
- [ ] **Parcerias com editoras** — disponibilizar conteúdo premium gratuitamente  

## 7.3 Visão de Futuro

| Horizonte | Meta |
|---|---|
| **6 meses** | 1.000 professores · 5.000 materiais · 50.000 downloads · 5 estados |
| **1 ano** | 10.000 professores · 50.000 materiais · 500.000 downloads · 27 estados |
| **3 anos** | 100.000 professores · 500.000 materiais · 5M downloads · app mobile · expansão LATAM |
| **5 anos** | 500.000 professores (20% da rede pública BR) · 2M materiais · 50M downloads · 10M alunos impactados |

---

# 🎯 Conclusão

O **EduShare** representa muito mais do que uma solução tecnológica — é uma **ferramenta de transformação social**. Ao empoderar professores da rede pública com recursos de qualidade e uma comunidade colaborativa, estamos investindo diretamente no futuro de milhões de alunos brasileiros.

Com uma arquitetura robusta, segura e escalável, o projeto está preparado para crescer de um MVP funcional para uma plataforma nacional de referência em tecnologia educacional. A combinação de microserviços, Clean Architecture, containerização Docker e conformidade LGPD garante que o EduShare pode evoluir de forma sustentável, mantendo qualidade técnica e confiabilidade.

> *"Porque educação de qualidade é direito de todos."*

---

| Campo | Detalhe |
|:---|:---|
| **Projeto** | EduShare — Plataforma Colaborativa de Materiais Didáticos |
| **Equipe** | Hackathon 5FSDT Team — Postech |
| **Versão do Documento** | 1.0 |
| **Formato** | Markdown (GitHub-Flavored Markdown) |
| **Licença** | MIT (Open Source) |

---

<div align="center">

*Documento elaborado pela equipe Hackathon 5FSDT como parte do hackathon Postech — Tema: Auxílio aos Professores e Professoras no Ensino Público.*

</div>