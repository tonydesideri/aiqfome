# AiqFome API

## Introdução

A AiqFome API é uma aplicação backend desenvolvida em NestJS que oferece funcionalidades de gerenciamento de clientes e sistema de favoritos. A API integra com a FakeStore API para validação de produtos e utiliza autenticação JWT para proteger os endpoints.

O projeto segue uma arquitetura limpa (Clean Architecture) com separação clara entre domínio, aplicação e infraestrutura, garantindo alta testabilidade e manutenibilidade.

## Funcionalidades

### Autenticação
- **Login de usuários** com JWT
- **Proteção de rotas** com autenticação Bearer Token
- **Validação de credenciais** com hash de senha

### Gerenciamento de Clientes
- **Criar cliente** - Cadastro de novos clientes
- **Listar clientes** - Consulta paginada de todos os clientes
- **Buscar cliente** - Obter cliente por ID
- **Atualizar cliente** - Modificar dados do cliente
- **Excluir cliente** - Remover cliente do sistema

### Sistema de Favoritos
- **Adicionar favorito** - Adicionar produto à lista de favoritos
- **Listar favoritos** - Consultar favoritos de um cliente
- **Remover favorito** - Remover produto da lista de favoritos
- **Validação externa** - Integração com FakeStore API para validar produtos

## Arquitetura

O projeto segue os princípios da **Clean Architecture** com a seguinte organização:

```
src/
├── domain/                    # Camada de Domínio
│   ├── enterprise/           # Entidades de negócio
│   │   ├── client.entity.ts
│   │   ├── favorite.entity.ts
│   │   ├── product.entity.ts
│   │   └── user.entity.ts
│   └── application/          # Casos de uso e contratos
│       ├── use-cases/        # Implementação dos casos de uso
│       ├── repositories/     # Contratos dos repositórios
│       └── cryptography/     # Contratos de criptografia
├── infra/                    # Camada de Infraestrutura
│   ├── http/                 # Controllers, DTOs e Presenters
│   ├── database/             # Implementação do Prisma
│   ├── auth/                 # Estratégias de autenticação
│   ├── external/             # Integração com APIs externas
│   └── cryptography/         # Implementação de hash e JWT
└── common/                   # Utilitários compartilhados
    ├── env/                  # Configuração de ambiente
    ├── exception/            # Filtros de exceção
    ├── interceptor/          # Interceptadores
    └── logger/               # Serviço de logging
```

### Padrões Utilizados
- **Repository Pattern** - Abstração do acesso a dados
- **Use Case Pattern** - Encapsulamento da lógica de negócio
- **Presenter Pattern** - Transformação de dados para HTTP
- **Dependency Injection** - Inversão de controle
- **Result Pattern** - Tratamento de erros funcional

## Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para aplicações escaláveis
- **TypeScript** - Linguagem de programação tipada
- **Prisma** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas
- **class-validator** - Validação de dados
- **class-transformer** - Transformação de objetos

### Testes
- **Vitest** - Framework de testes unitários e de integração
- **Supertest** - Testes de API HTTP
- **Faker.js** - Geração de dados fake para testes

### Desenvolvimento
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de serviços
- **Biome** - Linter e formatação de código
- **SWC** - Compilador TypeScript rápido

### Documentação
- **Swagger/OpenAPI** - Documentação interativa da API

## Como Rodar o Projeto

### Com Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd aiqfome
   ```

2. **Execute o script de inicialização**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

   O script irá:
   - Verificar se o Docker está rodando
   - Criar o arquivo `.env` se não existir
   - Parar containers existentes
   - Construir e iniciar os serviços

3. **Acesse a aplicação**
   - API: http://localhost:3333
   - Swagger: http://localhost:3333/api
   - Banco de dados: localhost:5432

> **Nota:** O Docker Compose executa automaticamente as migrações e o seed, criando o usuário administrador necessário para login.

### Localmente (Sem Docker)

1. **Instale as dependências**
   ```bash
   yarn install
   ```

2. **Configure o ambiente**
   ```bash
   cp .env.example .env
   # Edite o .env com suas configurações
   ```

3. **Configure o banco de dados**
   ```bash
   # Instale e configure PostgreSQL localmente
   # Ou use Docker apenas para o banco:
   docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=aiqfome -p 5432:5432 -d postgres:15
   ```

4. **Execute as migrações**
   ```bash
   yarn prisma migrate deploy
   yarn prisma generate
   ```

5. **Popule o banco com dados iniciais**
   ```bash
   yarn seed
   ```
   
   > **Importante:** O seed cria automaticamente um usuário administrador com as credenciais:
   > - **Email:** `admin@admin.com`
   > - **Senha:** `admin123`
   > 
   > Este usuário é necessário para fazer login na API.

6. **Inicie a aplicação**
   ```bash
   # Desenvolvimento
   yarn start:dev
   
   # Produção
   yarn build
   yarn start:prod
   ```

### Migrações do Banco

```bash
# Gerar nova migração
yarn prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
yarn prisma migrate deploy

# Resetar banco (desenvolvimento)
yarn prisma migrate reset
```

### 🌱 Seed do Banco

```bash
# Executar seed para criar dados iniciais
yarn seed
```

O script de seed (`prisma/seed.ts`) cria automaticamente:
- **Usuário administrador** com credenciais para login
- **Dados de exemplo** (se necessário)

> **Importante:** Sempre execute o seed após as migrações para ter um usuário válido para autenticação.

### 🔧 Configuração do .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Ambiente
NODE_ENV=development

# Configurações do Banco de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aiqfome

# Configurações da Aplicação
PORT=3333
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 🚀 Comandos de Build e Start

```bash
# Desenvolvimento
yarn start:dev          # Modo watch
yarn start:debug        # Modo debug

# Produção
yarn build             # Compilar TypeScript
yarn start:prod        # Executar build de produção

# Linting e formatação
yarn lint              # Verificar código
yarn format            # Formatar código
yarn format:check      # Verificar formatação
yarn organize          # Organizar imports
```

## Como Rodar os Testes

### Testes Unitários
```bash
# Executar todos os testes
yarn test

# Modo watch
yarn test:watch

# Com cobertura
yarn test:cov

# Modo debug
yarn test:debug
```

### Testes End-to-End
```bash
# Executar testes E2E
yarn test:e2e

# Modo watch E2E
yarn test:e2e:watch
```

### Configuração de Testes
- Os testes unitários usam **Vitest** com configuração em `vitest.config.ts`
- Os testes E2E usam **Supertest** com configuração em `vitest.config.e2e.ts`
- Cada teste E2E roda em um schema isolado do banco de dados
- Dados de teste são gerados com **Faker.js**

## Endpoints da API

### Autenticação

#### POST /auth/sign-in
**Descrição:** Autentica um usuário e retorna um token JWT

**Corpo da requisição:**
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Resposta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200` - Login realizado com sucesso
- `401` - Credenciais inválidas
- `400` - Dados inválidos

### Clientes

#### POST /clients
**Descrição:** Cria um novo cliente

**Autenticação:** Bearer Token

**Corpo da requisição:**
```json
{
  "name": "João Silva",
  "email": "joao.silva@email.com"
}
```

**Resposta (201):**
```json
{
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /clients
**Descrição:** Lista todos os clientes

**Autenticação:** Bearer Token

**Resposta (200):**
```json
{
  "clients": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "email": "joao.silva@email.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /clients/:id
**Descrição:** Busca um cliente por ID

**Autenticação:** Bearer Token

**Resposta (200):**
```json
{
  "client": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /clients/:id
**Descrição:** Atualiza um cliente

**Autenticação:** Bearer Token

**Corpo da requisição:**
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@email.com"
}
```

#### DELETE /clients/:id
**Descrição:** Remove um cliente

**Autenticação:** Bearer Token

**Resposta (204):** Sem conteúdo

### Favoritos

#### POST /favorites
**Descrição:** Adiciona um produto à lista de favoritos

**Autenticação:** Bearer Token

**Corpo da requisição:**
```json
{
  "clientId": "123e4567-e89b-12d3-a456-426614174000",
  "productId": "1"
}
```

**Resposta (201):**
```json
{
  "favorite": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "clientId": "123e4567-e89b-12d3-a456-426614174000",
    "productId": "1",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /favorites/:clientId
**Descrição:** Lista os favoritos de um cliente

**Autenticação:** Bearer Token

**Resposta (200):**
```json
{
  "favorites": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "clientId": "123e4567-e89b-12d3-a456-426614174000",
      "productId": "1",
      "product": {
        "id": "1",
        "title": "Fjallraven - Foldsack No. 1 Backpack",
        "price": 109.95,
        "description": "Your perfect pack for everyday use...",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### DELETE /favorites/:id
**Descrição:** Remove um favorito

**Autenticação:** Bearer Token

**Resposta (204):** Sem conteúdo

## Autenticação

### Como Funciona
1. **Login:** Faça uma requisição POST para `/auth/sign-in` com email e senha
2. **Token:** Receba um JWT token válido por 24 horas
3. **Uso:** Inclua o token no header `Authorization: Bearer <token>`

### Credenciais Padrão
- **Email:** `admin@admin.com`
- **Senha:** `admin123`

> **Nota:** Estas credenciais são criadas automaticamente pelo script de seed (`yarn seed`). Se você não executou o seed, o login não funcionará.

### Estrutura do JWT
```json
{
  "sub": "user-id",
  "email": "admin@admin.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Proteção de Rotas
- Todas as rotas (exceto `/auth/sign-in`) requerem autenticação
- Use o decorator `@Public()` para rotas públicas
- O guard `JwtAuthGuard` valida automaticamente os tokens

## Integração Externa

### FakeStore API
A API integra com a **FakeStore API** (https://fakestoreapi.com) para:

- **Validação de produtos** antes de adicionar aos favoritos
- **Busca de produtos** por ID
- **Listagem de produtos** disponíveis

### Implementação
- **Serviço:** `FakeStoreApiService` em `src/infra/external/`
- **Mapper:** `FakeStoreProductMapper` para conversão de dados
- **Contrato:** Implementa `ProductRepository` do domínio

### Endpoints Utilizados
- `GET /products/:id` - Buscar produto específico
- `GET /products` - Listar todos os produtos

### Tratamento de Erros
- Produtos inexistentes retornam `null`
- Falhas de rede retornam array vazio
- Timeout configurado para evitar travamentos

## Variáveis de Ambiente

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `NODE_ENV` | enum | Ambiente da aplicação | `development`, `production`, `test` |
| `DATABASE_URL` | string | URL de conexão com PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `PORT` | number | Porta da aplicação | `3333` |
| `JWT_SECRET` | string | Chave secreta para JWT | `your-super-secret-key` |

### Configurações por Ambiente

#### Desenvolvimento
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aiqfome
PORT=3333
JWT_SECRET=dev-secret-key
```

#### Produção
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/aiqfome
PORT=3333
JWT_SECRET=production-super-secret-key
```

#### Testes
```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aiqfome_test
PORT=3334
JWT_SECRET=test-secret-key
```

