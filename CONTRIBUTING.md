# Guia de Contribuição

Obrigado por considerar contribuir com este projeto! Este documento fornece diretrizes para colaborar.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Melhorias](#sugerir-melhorias)

## Código de Conduta

Este projeto segue um código de conduta. Ao participar, você concorda em respeitar todos os colaboradores.

### Nossas Promessas

- Ser acolhedor e inclusivo
- Respeitar diferentes pontos de vista
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade

## Como Contribuir

### 1. Fork o Projeto

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/hackathon-microservices.git
cd hackathon-microservices

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/hackathon-microservices.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch descritiva
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e legível
- Siga os padrões do projeto
- Adicione testes para novas funcionalidades
- Atualize a documentação se necessário

### 4. Commit

Use commits semânticos:

```bash
# Tipos de commit
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Adicionar testes
chore: Tarefas de manutenção

# Exemplos
git commit -m "feat: adiciona validação de email"
git commit -m "fix: corrige filtro de disciplinas"
git commit -m "docs: atualiza README com instruções"
```

### 5. Push e Pull Request

```bash
git push origin feature/nome-da-feature
```

Depois, abra um Pull Request no GitHub.

## Padrões de Código

### JavaScript/Node.js

```javascript
// ✅ BOM
const getUserById = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }
  
  return await userRepository.findById(id);
};

// ❌ RUIM
const getUser = async (i) => {
  return await userRepository.findById(i);
};
```

### Regras ESLint

```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Nomenclatura

- **Variáveis e Funções**: camelCase
- **Classes**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Arquivos**: kebab-case ou PascalCase (classes)

```javascript
// Variáveis
const userName = 'John';
const totalAmount = 100;

// Funções
function calculateTotal() { }
const getUserData = () => { };

// Classes
class UserService { }
class ProductRepository { }

// Constantes
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
```

## Estrutura de Testes

### Testes Unitários

```javascript
describe('RegisterUserUseCase', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    useCase = new RegisterUserUseCase(mockRepository);
  });

  it('should register a new user', async () => {
    mockRepository.findUserByEmail.mockResolvedValue(null);
    mockRepository.createUser.mockResolvedValue({ id: 1 });

    const result = await useCase.execute({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });
});
```

### Testes de Integração

```javascript
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

## Processo de Pull Request

### Checklist

Antes de submeter um PR, verifique:

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Todos os testes passam
- [ ] Documentação foi atualizada
- [ ] Commits seguem o padrão semântico
- [ ] Branch está atualizada com main

### Template de PR

```markdown
## Descrição

Breve descrição das mudanças.

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)

## Checklist

- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Code review solicitado
```

## Reportar Bugs

### Template de Issue para Bug

```markdown
**Descrição do Bug**
Descrição clara do problema.

**Como Reproduzir**
1. Passo 1
2. Passo 2
3. Passo 3

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável.

**Ambiente**
- OS: [e.g. Windows 11]
- Node.js: [e.g. 18.17.0]
- Docker: [e.g. 24.0.0]

**Logs**
Cole logs relevantes aqui.
```

## Sugerir Melhorias

### Template de Issue para Feature

```markdown
**Descrição da Feature**
Descrição clara da funcionalidade sugerida.

**Problema que Resolve**
Qual problema esta feature resolve?

**Solução Proposta**
Como você imagina que isso funcione?

**Alternativas Consideradas**
Outras abordagens que você considerou?

**Contexto Adicional**
Qualquer outra informação relevante.
```

## Áreas de Contribuição

### Backend

- Novos microserviços
- Melhorias de performance
- Segurança
- Testes

### Frontend

- Interface de usuário
- Componentes reutilizáveis
- Responsividade
- Acessibilidade

### DevOps

- CI/CD
- Docker
- Kubernetes
- Monitoramento

### Documentação

- README
- Guias
- Tutoriais
- API docs

## Desenvolvimento Local

Veja [DEVELOPMENT.md](DEVELOPMENT.md) para instruções detalhadas.

## Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm test -- --coverage

# Testes de integração
./test-integration.sh

# Lint
npm run lint
```

## Dúvidas?

- Abra uma issue
- Entre em contato com os maintainers
- Consulte a documentação

## Reconhecimento

Todos os contribuidores serão reconhecidos no README.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT.

---

Obrigado por contribuir! 🎉
