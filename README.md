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
npm run dev
```
**Acesse:** http://localhost:3000

---

## 🗄️ **Banco de Dados**

### **📊 Dados Demo Incluídos**
O projeto vem com dados de demonstração:
- **Usuários** já cadastrados para teste
- **Colaborações** de exemplo sobre vinhos

### **🔄 Comandos de Banco**
```bash
npm run db:reset    # Banco zerado (vazio)
npm run db:demo     # Restaurar dados demo
npm run db:status   # Ver status dos arquivos
```

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
npm run docker:build      # Build da imagem TypeScript
npm run docker:prod:d     # Rodar produção (porta 80)
npm run docker:logs       # Ver logs
npm run docker:stop       # Parar containers
```

### **💻 Local**
```bash
npm run dev              # Desenvolvimento (ts-node)
npm run build            # Compilar TypeScript → JavaScript
npm start                # Produção (node dist/)
npm run migrate          # Criar banco de dados
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
npm run db:reset
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