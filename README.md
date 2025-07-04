# 🍷 OuiWine - Sistema de Degustação de Vinhos

> **Sistema fullstack sobre vinhos - Programação de Scripts | Fatec Mogi Mirim**

## 🚀 **Execução Rápida**

### **🐳 Docker (Recomendado)**
```bash
git clone [repo]
cd ouiwine
npm run docker:build
npm run docker:prod:d
```
**Acesse:** http://localhost

### **💻 Local**
```bash
git clone [repo]
cd ouiwine
npm install
npm run migrate
npm run dev
```
**Acesse:** http://localhost:3000

---

## 📋 **Pré-requisitos**

**Para Docker:**
- Docker >= 20.0.0
- Docker Compose >= 2.0.0

**Para execução local:**
- Node.js >= 16.0.0
- npm >= 8.0.0
- TypeScript >= 4.0.0 (instalado automaticamente)

---

## 🛠️ **Comandos**

### **🐳 Docker**
```bash
# Via npm (recomendado)
npm run docker:build      # Build da imagem TypeScript
npm run docker:prod:d     # Rodar produção (porta 80)
npm run docker:logs       # Ver logs
npm run docker:stop       # Parar containers

# Comandos diretos
docker build -t ouiwine .
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### **💻 Local**
```bash
npm run dev              # Desenvolvimento (ts-node)
npm run build            # Compilar TypeScript → JavaScript
npm start                # Produção (node dist/)
npm run migrate          # Criar banco de dados
npm run migrate:undo     # Reverter migrations
```

---

## 🍷 **Funcionalidades**

- **Wiki educativa** sobre degustação de vinhos
- **Sistema de login** e cadastro
- **Compartilhamento** de experiências
- **Filtros** por texto e data

---

## ⚡ **Stack Técnica**

- **Backend:** Node.js + Express + TypeScript + Sequelize + SQLite
- **Frontend:** EJS + Bootstrap + CSS customizado
- **Container:** Docker + docker-compose (multi-stage build)
- **Autenticação:** express-session + bcryptjs
- **Build:** TypeScript Compiler (tsc) + ts-node

---

## 📁 **Estrutura**

```
ouiwine/
├── src/                   # Código TypeScript
│   ├── controllers/       # Lógica de negócio (TS)
│   ├── middleware/        # Autenticação (TS)
│   ├── models/           # User, Colaboracao (TS)
│   ├── routes/           # Rotas da aplicação (TS)
│   ├── types/            # Interfaces TypeScript
│   └── server.ts         # Entry point TypeScript
├── dist/                 # JavaScript compilado (build)
├── config/               # Configurações Sequelize
├── migrations/           # Banco de dados
├── controllers/          # HomeController.js (transitório)
├── public/               # CSS, JS, imagens
├── views/                # Templates EJS
├── Dockerfile            # Container multi-stage
├── docker-compose.yml    # Orquestração
├── tsconfig.json         # Configuração TypeScript
└── package.json          # Scripts e dependências
```

---

## 🎯 **Páginas**

| Rota | Descrição | Auth |
|------|-----------|------|
| `/` | Wiki sobre vinhos | Pública |
| `/auth/login` | Login/cadastro | Pública |
| `/colaborar` | Formulário experiências | Login |
| `/colaboracoes` | Lista de histórias | Pública |

---

## 🔧 **Configuração**

### **Ambiente**
```bash
# Copiar arquivo de exemplo
cp .env.example .env.development

# Configurar (opcional)
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-secret
```

### **Banco de Dados**
```bash
# Criar tabelas
npm run migrate

# Verificar
ls database.sqlite
```

### **TypeScript**
```bash
# Compilar código TypeScript
npm run build

# Verificar build
ls dist/

# Desenvolvimento com hot reload
npm run dev
```

---

## 🚨 **Problemas Comuns**

### **Docker**
```bash
# Porta 80 em uso
sudo service apache2 stop
sudo service nginx stop

# Limpar cache
docker system prune -a
```

### **Local**
```bash
# Porta 3000 em uso
kill -9 $(lsof -t -i:3000)

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Recompilar TypeScript
npm run build

# Recriar banco
rm database.sqlite
npm run migrate
```

### **TypeScript**
```bash
# Erros de compilação
npm run build

# Verificar tipos
npx tsc --noEmit

# Limpar build
rm -rf dist/
npm run build
```

---

## 👥 **Desenvolvedores**

- **[Brenda Gaudêncio](https://github.com/brendagaudencio)** - Frontend & Design
- **[Marcos Moreira](https://github.com/JamalShadowDev)** - Backend & DevOps

---

## 📚 **Contexto Acadêmico**

**Fatec Mogi Mirim "Arthur de Azevedo"**  
**Análise e Desenvolvimento de Sistemas**  
**Disciplina:** Programação de Scripts  

*Sistema desenvolvido para fins acadêmicos - 2025* 🎓