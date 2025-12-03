# Guia de Configuração do Ambiente Local

## 1. Configurar Banco de Dados PostgreSQL

### Opção A: PostgreSQL Instalado Localmente

```bash
# Windows (usando PostgreSQL instalado)
psql -U postgres

# Criar banco de dados
CREATE DATABASE recruite_db;
```

### Opção B: Docker (Recomendado)

```bash
# Iniciar containers PostgreSQL + PgAdmin
docker-compose up -d

# Verificar se está rodando
docker ps

# Acessar PgAdmin em: http://localhost:5050
# Email: admin@recruite.com
# Senha: admin

# Conectar ao banco:
# Host: postgres
# Port: 5432
# Database: recruite_db
# User: postgres
# Password: postgres
```

## 2. Configurar Backend

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados de exemplo
npm run prisma:seed

# Iniciar servidor em modo desenvolvimento
npm run dev
```

## 3. Verificar Banco de Dados

### Usando Prisma Studio (GUI Interativa)

```bash
npm run prisma:studio
```

Abrirá em: `http://localhost:5555`

### Usando PgAdmin (se usar Docker)

```
URL: http://localhost:5050
Email: admin@recruite.com
Senha: admin
```

## 4. Testar API

### Health Check

```bash
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "RecruitME API is running",
  "timestamp": "2025-12-03T18:00:00.000Z"
}
```

### Acessar Swagger Docs

```
http://localhost:3001/docs
```

### Login com Dados de Teste

Credenciais criadas pelo seed:

**Estudante:**
```json
{
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Empresa:**
```json
{
  "email": "contato@techcompany.com",
  "password": "empresa123456"
}
```

### Exemplo de Request no Terminal

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'

# Response:
# {
#   "message": "Login realizado com sucesso",
#   "user": {...},
#   "token": "eyJhbGc..."
# }

# Guardar o token em uma variável
TOKEN="seu_token_aqui"

# Obter perfil (usando o token)
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Listar programas (público, sem autenticação)
curl http://localhost:3001/programs
```

## 5. Variáveis de Ambiente

Arquivo `.env.local` deve conter:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruite_db"
JWT_SECRET="seu_segredo_jwt_super_seguro"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## 6. Troubleshooting

### PostgreSQL não conecta

```bash
# Verificar se servidor está rodando
psql -U postgres -h localhost

# Se usar Docker, verificar containers
docker ps
docker logs recruite-postgres
```

### Erro "Prisma Client is not ready"

```bash
npm run prisma:generate
```

### Resetar banco (desenvolvimento apenas)

```bash
npx prisma migrate reset
```

### Porta 3001 já em uso

```bash
# Windows (PowerShell)
Get-Process | Where-Object {$_.Port -eq 3001}

# ou mudar porta no .env.local
# PORT=3002
```

---

**Próximo passo:** Integrar com o frontend Next.js configurando `NEXT_PUBLIC_API_URL`
