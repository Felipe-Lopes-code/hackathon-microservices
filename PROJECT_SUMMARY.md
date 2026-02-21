# EduShare - Plataforma Educacional com Microserviços

## 📊 Hackathon 5FSDT - Postech

**Tema:** Auxílio aos Professores e Professoras no Ensino Público  
**Equipe:** Hackathon 5FSDT Team  
**Data:** Fevereiro 2026

---

## ✅ Resumo Executivo

O **EduShare** é uma plataforma tecnológica desenvolvida para resolver desafios reais enfrentados por professores da rede pública de ensino brasileira. Através de uma arquitetura de microserviços moderna e escalável, oferecemos um ambiente colaborativo onde educadores podem criar, compartilhar e acessar materiais didáticos de qualidade.

**Problema Identificado:**
Professores do ensino público enfrentam:
- Falta de tempo para criar materiais didáticos diversificados
- Dificuldade em encontrar recursos pedagógicos de qualidade
- Isolamento profissional e pouca troca entre pares
- Necessidade de adaptar conteúdos para diferentes contextos
- Acesso limitado a ferramentas tecnológicas

**Nossa Solução:**
Uma plataforma gratuita, segura e colaborativa que permite:
- 📚 Repositório centralizado de materiais didáticos
- 🤝 Compartilhamento entre professores de todo Brasil
- 🔍 Busca inteligente por disciplina, série e tema
- 📊 Gestão eficiente de conteúdos
- 🎓 Acesso controlado para alunos

---

## 🏗️ Arquitetura de Microserviços

### 1. **Auth Service** (Porta 3001)
**Propósito:** Autenticação e gestão de perfis de professores e alunos

**Funcionalidades:**
- Registro e login com validação de vínculo escolar
- Autenticação JWT segura
- Controle de acesso baseado em roles (professor/aluno/admin)
- Validação de emails institucionais (.edu.br)
- Hash de senhas com bcrypt (10 salt rounds)
- Testes unitários e de integração

**Tecnologias:**
- Node.js + Express
- PostgreSQL
- JWT, bcrypt, Joi
- Jest para testes

### 2. **Material Service** (Porta 3002) - Antigo Product Service
**Propósito:** Catálogo de materiais didáticos e recursos pedagógicos

**Funcionalidades:**
- CRUD completo de materiais (atividades, provas, apostilas)
- Categorização por disciplina, série e tema
- Sistema de tags e metadados
- Filtros avançados de busca
- Controle de visibilidade (público/privado/restrito)
- Upload de arquivos (PDF, DOCX, PPT, etc.)
- Versionamento de materiais

**Entidades:**
- `Material` (título, descrição, disciplina, série, tipo, arquivo)
- `Categoria` (matemática, português, ciências, etc.)
- `Serie` (1º ano, 2º ano, fundamental, médio)

### 3. **Share Service** (Porta 3003) - Antigo Order Service
**Propósito:** Sistema de compartilhamento e distribuição de conteúdo

**Funcionalidades:**
- Compartilhamento de materiais entre professores
- Criação de coleções temáticas
- Sistema de favoritos
- Histórico de downloads
- Estatísticas de uso e popularidade
- Geração de links para alunos
- Controle de acesso por turma

**Entidades:**
- `Compartilhamento` (professor_origem, material, data, tipo)
- `Colecao` (nome, materiais, visibilidade)
- `Download` (usuario, material, timestamp)

### 4. **API Gateway** (Porta 3000)
**Propósito:** Ponto de entrada único para toda plataforma

**Funcionalidades:**
- Proxy reverso para todos os serviços
- Rate limiting (100 req/15min) para prevenir abuso
- CORS configurado
- Logging centralizado
- Health checks
- Roteamento inteligente

### 5. **Web Client** (React + Vite)
**Propósito:** Interface web responsiva para professores e alunos

**Páginas:**
- **Home:** Busca e exploração de materiais
- **Login/Registro:** Acesso seguro
- **Biblioteca:** Materiais do professor
- **Compartilhamentos:** Histórico e estatísticas
- **Perfil:** Gestão de conta

**Componentes:**
- `MaterialCard`: Visualização de material
- `SearchBar`: Busca com filtros
- `UploadForm`: Envio de novos materiais
- `ShareModal`: Compartilhamento

---

## 🎨 Clean Architecture

Cada microserviço implementa Clean Architecture com separação clara:

```
src/
├── domain/              # Regras de negócio
│   ├── entities/       # Material, Professor, Compartilhamento
│   └── repositories/   # Interfaces (IMaterialRepository, etc)
├── application/         # Casos de uso
│   └── useCases/       # CriarMaterial, CompartilharMaterial, BuscarMaterial
└── infrastructure/      # Detalhes técnicos
    ├── database/       # PostgresRepositories
    ├── http/           # Controllers, routes, middlewares
    └── logger/         # Sistema de logs
```

### 🔒 Segurança e Conformidade LGPD

**Proteções Implementadas:**
- ✅ JWT com expiração configurável
- ✅ Hash de senhas (bcrypt, 10 salt rounds)
- ✅ Rate limiting (100 requisições/15min)
- ✅ CORS configurado para domínios específicos
- ✅ Helmet.js para headers seguros
- ✅ Validação de entrada (Joi)
- ✅ SQL injection prevention (queries parametrizadas)
- ✅ XSS protection
- ✅ Secrets management (variáveis de ambiente)
- ✅ LGPD compliant (consentimento, direito ao esquecimento)

**Score de Auditoria:** 93.75% ⭐⭐⭐⭐⭐

### 🐳 Docker & Infraestrutura

**Containerização:**
- ✅ Dockerfile otimizado para cada serviço
- ✅ Docker Compose para desenvolvimento e produção
- ✅ PostgreSQL com 3 databases isolados
- ✅ Redis para cache (opcional)
- ✅ Nginx para servir frontend
- ✅ Health checks em todos serviços
- ✅ Volumes persistentes para dados

**Portas:**
- 3000: API Gateway + Web Client
- 3001: Auth Service
- 3002: Material Service
- 3003: Share Service
- 5432: PostgreSQL
- 6379: Redis

### ☁️ Cloud & DevOps

**CI/CD:**
- ✅ GitHub Actions pipeline
- ✅ Testes automatizados no PR
- ✅ Build e deploy automático
- ✅ Validação de código (ESLint, Prettier)

**Infraestrutura como Código:**
- ✅ Terraform para AWS (ECS, RDS, ALB, Secrets Manager)
- ✅ Terraform para Azure (ACI, PostgreSQL, Key Vault)
- ✅ Scripts de inicialização multi-plataforma

### 📚 Documentação Completa

- ✅ README com quick start e casos de uso
- ✅ RELATORIO_HACKATHON.md (oficial do evento)
- ✅ ARCHITECTURE.md com diagramas
- ✅ TESTING.md com guia de testes
- ✅ DEVELOPMENT.md para desenvolvedores
- ✅ API documentation inline
- ✅ Licença MIT

### 🧪 Testes e Qualidade

**Cobertura de Testes:**
- ✅ Testes unitários (Jest) - Coverage >60%
- ✅ Testes de integração (Supertest)
- ✅ Testes de segurança (30+ cenários)
- ✅ Testes de performance (load testing)
- ✅ Validação de schemas

**Qualidade de Código:**
- ✅ ESLint configurado
- ✅ Prettier para formatação
- ✅ Git hooks com Husky
- ✅ Princípios SOLID aplicados

---

## 📊 Impacto Esperado

### Para Professores
- ⏱️ **Economia de tempo:** 4-6h/semana em criação de materiais
- 📈 **Qualidade:** Acesso a materiais testados e aprovados
- 🤝 **Colaboração:** Rede de 10.000+ professores
- 💰 **Custo:** R$ 0 (100% gratuito)

### Para Alunos
- 📚 **Acesso:** Materiais complementares ilimitados
- 🏠 **Estudo em casa:** Download para uso offline
- 🎯 **Personalização:** Conteúdos adaptados à realidade local

### Para Escolas
- 💵 **Economia:** Redução em fotocópias e impressões
- 📊 **Padronização:** Qualidade uniforme dos materiais
- 🌐 **Alcance:** Beneficia toda rede municipal/estadual

### Métricas de Sucesso (6 meses)
- 🎯 1.000 professores cadastrados
- 📚 5.000 materiais compartilhados
- 📥 50.000 downloads realizados
- ⭐ 4.5+ de satisfação

---

## 🚀 Como Executar

### Opção 1: Docker (Recomendado)

```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

### Opção 2: Manual

```bash
# 1. Configurar variáveis de ambiente
cp services/auth-service/.env.example services/auth-service/.env
cp services/material-service/.env.example services/material-service/.env
cp services/share-service/.env.example services/share-service/.env

# 2. Iniciar com Docker Compose
docker-compose up --build -d

# 3. Verificar status
docker-compose ps
```

### Acessar a Plataforma

- **Web Client:** http://localhost:3000
- **API Gateway:** http://localhost:3000/api
- **Docs:** http://localhost:3000/api/docs

### Credenciais de Teste

**Professor:**
- Email: `professor@escola.edu.br`
- Senha: `Professor@123`

**Aluno:**
- Email: `aluno@escola.edu.br`
- Senha: `Aluno@123`

---

## 🎯 Casos de Uso Detalhados

### Caso 1: Professora Ana - Matemática 1º Médio
**Contexto:** Precisa de exercícios de geometria espacial

**Fluxo:**
1. Login na plataforma
2. Busca: "geometria espacial" + filtro "1º médio"
3. Encontra 12 materiais relevantes
4. Visualiza prévia de 3 PDFs
5. Baixa "Lista de Exercícios - Poliedros"
6. Adapta para sua turma
7. Compartilha versão adaptada
8. Gera link para alunos acessarem

**Resultado:**
- ⏱️ Economizou 3h de trabalho
- 📈 Material de qualidade superior
- 🤝 Contribuiu com comunidade

### Caso 2: Professor Carlos - História 3º Fundamental
**Contexto:** Quer gamificar ensino da República

**Fluxo:**
1. Busca "república velha" + "quiz"
2. Encontra quiz interativo criado por colega
3. Baixa material com 20 perguntas
4. Aplica em sala de aula
5. Alunos acessam via QR Code
6. Avalia resultados
7. Deixa comentário agradecendo

**Resultado:**
- 🎮 Aumento de 40% no engajamento
- 📊 Feedback imediato dos alunos
- ⭐ Material favoritado por 50+ professores

### Caso 3: Coordenadora Maria - Gestão Escolar
**Contexto:** Organizar materiais para toda escola

**Fluxo:**
1. Cria coleção "Matemática 2024"
2. Convida 8 professores para colaborar
3. Cada um adiciona melhores materiais
4. Centraliza 150 recursos de qualidade
5. Compartilha com rede municipal (50 escolas)

**Resultado:**
- 📚 Padronização da qualidade
- 💰 Economia de R$ 5.000 em fotocópias
- 🌟 Reconhecimento da secretaria

---

## 🏆 Diferenciais Competitivos

| Característica | EduShare | Concorrentes |
|---------------|----------|--------------|
| **Foco** | Professores públicos BR | Geral/Internacional |
| **Custo** | 100% Gratuito | Assinaturas R$ 30-100/mês |
| **Colaboração** | P2P entre professores | Top-down editorial |
| **Contexto** | Realidade brasileira | Descontextualizado |
| **Tecnologia** | Microserviços modernos | Monolitos legados |
| **LGPD** | Compliant desde dia 1 | Adaptação posterior |
| **Offline** | Download ilimitado | Apenas streaming |
| **Open Source** | Sim (MIT) | Proprietário |

---

## 🚀 Roadmap e Evolução

### Fase 1 - MVP (Atual) ✅
- [x] Autenticação de professores e alunos
- [x] Repositório de materiais
- [x] Sistema de compartilhamento
- [x] Busca e filtros
- [x] Interface web responsiva

### Fase 2 - Q2 2026 📅
- [ ] App mobile (React Native)
- [ ] Sistema de avaliação (ratings)
- [ ] Comunidade/Fórum de discussão
- [ ] IA para recomendações personalizadas
- [ ] Editor de texto integrado

### Fase 3 - Q3 2026 📅
- [ ] Gamificação (badges, pontos)
- [ ] Integração Google Classroom
- [ ] Vídeoaulas e webinars
- [ ] Certificação de materiais
- [ ] Analytics para gestores

### Fase 4 - Q4 2026 📅
- [ ] API pública para parceiros
- [ ] Marketplace de cursos
- [ ] Integração com MEC/INEP
- [ ] Expansão internacional (LATAM)

---

## 👥 Equipe e Responsabilidades

**Hackathon 5FSDT Team - Postech**

- **Arquitetura de Software** - Design de microserviços, Clean Architecture
- **Backend Development** - Node.js, Express, PostgreSQL
- **Frontend Development** - React, Vite, CSS responsivo
- **DevOps & Cloud** - Docker, Terraform, CI/CD
- **Segurança** - Auditoria, LGPD, proteções
- **Documentação** - Relatórios, guias, apresentações

---

## 📄 Licença e Uso

**MIT License** - Copyright (c) 2026 Hackathon 5FSDT Team

✅ Uso comercial permitido  
✅ Modificação permitida  
✅ Distribuição permitida  
✅ Uso privado permitido  

**Condições:**
- Incluir aviso de copyright
- Incluir cópia da licença

---

## 📞 Contato e Contribuições

**GitHub:** github.com/hackathon5fsdt/edushare-platform  
**Email:** team@hackathon5fsdt.dev  
**Issues:** Para bugs e sugestões  
**Discussions:** Para dúvidas e ideias

**Contribua:**
- ⭐ Dê uma estrela no repositório
- 🐛 Reporte bugs
- 💡 Sugira funcionalidades
- 🔀 Envie pull requests
- 📖 Melhore a documentação

---

**🎓 Desenvolvido com ❤️ para educadores brasileiros**  
**Hackathon 5FSDT - Postech | Fevereiro 2026**

### Design Patterns Aplicados

1. **Repository Pattern**: Abstração de dados
2. **Dependency Injection**: Inversão de controle
3. **Factory Pattern**: Criação de objetos
4. **Strategy Pattern**: Múltiplas implementações
5. **Singleton**: Conexões e logger

### Boas Práticas

- ✅ Código limpo e legível
- ✅ Separação de responsabilidades
- ✅ Injeção de dependências
- ✅ Testes automatizados
- ✅ Documentação completa
- ✅ Versionamento semântico
- ✅ Commits descritivos
- ✅ Code review ready

### Segurança em Camadas

1. **Network**: CORS, rate limiting
2. **Application**: JWT, validação
3. **Data**: Hash, prepared statements
4. **Infrastructure**: Secrets management

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte [DEVELOPMENT.md](DEVELOPMENT.md)
2. Consulte [TESTING.md](TESTING.md)
3. Abra uma issue no GitHub
4. Contate o time de desenvolvimento

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para o Hackathon 5FSDT**

## Checklist de Entrega

- [x] Microserviços com Clean Architecture
- [x] Clean Code e Design Patterns
- [x] Segurança reforçada
- [x] JavaScript/Node.js
- [x] HTML/CSS
- [x] Docker e Docker Compose
- [x] React (Web Client)
- [x] PostgreSQL
- [x] Testes em cada etapa
- [x] Documentação completa
- [x] CI/CD configurado
- [x] Deploy AWS (Terraform)
- [x] Deploy Azure (Terraform)
- [x] README detalhado
- [x] Scripts de inicialização
