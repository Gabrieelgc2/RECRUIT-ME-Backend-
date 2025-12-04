# 🚀 RecruitME Backend

Backend API completa para a plataforma RecruitME - Plataforma de Formação em TI.

## 📋 Sobre o Projeto

RecruitME é uma plataforma que centraliza e democratiza o acesso a programas de capacitação tecnológica, conectando **instituições** e **estudantes** de forma eficiente e intuitiva.

### Funcionalidades Principais

- ✅ **Autenticação JWT**: Login e registro de usuários
- ✅ **CRUD de Programas**: Criar, ler, atualizar e deletar programas de formação
- ✅ **Inscrições**: Sistema completo de inscrições em programas
- ✅ **Programas Salvos**: Possibilidade de salvar programas como favoritos
- ✅ **Perfil de Usuário**: Gerenciamento de dados do usuário
- ✅ **Banco de Dados**: Persistência completa com PostgreSQL e Prisma
- ✅ **Documentação Swagger**: API totalmente documentada

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express.js** | ^5.0 | Framework web minimalista |
| **TypeScript** | ^5.9 | Tipagem estática para JavaScript |
| **PostgreSQL** | 14+ | Banco de dados relacional |
| **Prisma** | ^5.21 | ORM moderno e type-safe |
| **JWT** | ^9.0 | Autenticação baseada em tokens |
| **Bcryptjs** | ^3.0 | Hash de senhas seguro |
| **Swagger** | ^6.2 | Documentação automática de API |
| **CORS** | ^2.8 | Controle de requisições cross-origin |

## 📦 Instalação

### Pré-requisitos

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/)) ou **Docker**
- **Git**

### 1. Clonar o Repositório

```bash
git clone https://github.com/lblima038/RecruitME-Backend.git
cd RecruitME-Backend
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` baseado em `.env.example`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/recruite_db"


# Ambiente
NODE_ENV="development"
PORT=3001

# Frontend URL para CORS
FRONTEND_URL="http://localhost:3000"
```

### 4. Configurar Banco de Dados e Docker

```bash
# Inicializar Docker
docker-compose up -d

# Executar comando para baixar dependências
npm intall 

# Executar migrations
npm run prisma:migrate

# Popular com dados
npm run prisma:seed

# Acessar o banco de dados
npm prisma studio
```

### 5. Iniciar o Servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev


O servidor estará disponível em `http://localhost:3001`


## 📚 Documentação da API

A documentação interativa está disponível em:

```
http://localhost:3001/docs
```

### Estrutura de Endpoints

```
GET  /health                    - Health check
GET  /                          - Info da API

AUTH
POST   /auth/signup             - Registrar novo usuário
POST   /auth/login              - Fazer login
GET    /auth/profile            - Obter perfil (autenticado)
PUT    /auth/profile            - Atualizar perfil (autenticado)

## 🔐 Autenticação

### Login

**Request:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

**Response (200):**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar Token

Adicione o token no header `Authorization`:

```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer seu_token_aqui"
```

## 📝 Exemplos de Requisições

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

## 🗄️ Estrutura do Banco de Dados

### Models

#### User
```prisma
- id: String (PK)
- name: String
- email: String (unique)
- password: String (hashed)
- phone: String?
- bio: String?
- avatar: String?
- role: String (student, company, admin)
- profileComplete: Int (percentual)
- emailVerified: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### Company
```prisma
- id: String (PK)
- name: String (unique)
- email: String (unique)
- cnpj: String (unique)
- logo: String?
- description: String?
- website: String?
- phone: String?
- address: String?
- city: String?
- state: String?
- userId: String (FK)
- createdAt: DateTime
- updatedAt: DateTime
```

## 🚀 Deployment

### Deploy em Render.com (Recomendado - Gratuito)

1. Criar conta em [render.com](https://render.com)
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

### Deploy em Railway.app

1. Criar conta em [railway.app](https://railway.app)
2. Conectar repositório
3. Railway detectará automaticamente que é Node.js
4. Configurar variáveis e fazer deploy

### Deploy em Vercel (Serverless)

Para serverless functions, crie a pasta `api/` e adicione:

```typescript
// api/index.ts - Entrada para função serverless
import app from '../src/server';

export default app;
```

## 🧪 Testes

Para criar uma Collection de testes no Postman:

1. Abra Postman
2. Importe o arquivo `postman-collection.json`
3. Configure variáveis de ambiente (URL base, token)
4. Execute os testes

## ⚠️ Variáveis de Ambiente Importantes

```env
DATABASE_URL           # URL de conexão PostgreSQL
JWT_SECRET            # Chave secreta para JWT (MUDE EM PRODUÇÃO!)
NODE_ENV              # development | production
PORT                  # Porta do servidor (padrão: 3001)
FRONTEND_URL          # URL do frontend para CORS
PRODUCTION_URL        # URL de produção do backend
```

## 📚 Recursos Úteis

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [JWT Intro](https://jwt.io/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **RecruitME Team** - [GitHub](https://github.com/lblima038)

---
