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

---

## 🛠️ **Comandos**

### **🐳 Docker**
```bash
# Via npm (recomendado)
npm run docker:build      # Build da imagem
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
npm run dev              # Desenvolvimento
npm start                # Produção
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

- **Backend:** Node.js + Express + Sequelize + SQLite
- **Frontend:** EJS + Bootstrap + CSS customizado
- **Container:** Docker + docker-compose
- **Autenticação:** express-session + bcryptjs

---

## 📁 **Estrutura**

```
ouiwine/
├── config/             # Configurações Sequelize
├── controllers/        # Lógica de negócio
├── middleware/         # Autenticação
├── migrations/         # Banco de dados
├── models/            # User, Colaboracao
├── public/            # CSS, JS, imagens
├── routes/            # Rotas da aplicação
├── views/             # Templates EJS
├── Dockerfile         # Container
├── docker-compose.yml # Orquestração
└── server.js          # Entry point
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

# Recriar banco
rm database.sqlite
npm run migrate
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