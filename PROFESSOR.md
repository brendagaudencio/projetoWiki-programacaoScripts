# 🍷 PROJETO OUIWINE - ENTREGA FINAL

> **Sistema Fullstack sobre Degustação de Vinhos**  
> **Disciplina:** Programação de Scripts | **Fatec Mogi Mirim**  
> **Período:** 4º Semestre ADS | **Ano:** 2025

---

## 👥 **DESENVOLVEDORES**

- **[Brenda Gaudêncio](https://github.com/brendagaudencio)** - Frontend, Design & UX
- **[Marcos Moreira (Jamal)](https://github.com/JamalShadowDev)** - Backend & DevOps

---

## ⚡ **EXECUÇÃO RÁPIDA**

### **🐳 OPÇÃO 1: Docker**
```bash
# TypeScript (Versão Principal)
docker run -d -p 80:3000 jamalshadowdev/ouiwine:typescript
# Acesse: http://localhost

# JavaScript (Versão Alternativa)
docker run -d -p 80:3000 jamalshadowdev/ouiwine:javascript  
# Acesse: http://localhost
```

### **💻 OPÇÃO 2: Local**
```bash
git clone https://github.com/brendagaudencio/projetoWiki-programacaoScripts
cd projetoWiki-programacaoScripts
npm install
npm run dev
# Acesse: http://localhost:3000
```

---

## 🐳 **IMAGENS DOCKERHUB**

| Versão | Link DockerHub | Tecnologia |
|--------|---------------|------------|
| **Principal** | [`jamalshadowdev/ouiwine:typescript`](https://hub.docker.com/r/jamalshadowdev/ouiwine) | TypeScript + Node.js |
| **Alternativa** | [`jamalshadowdev/ouiwine:javascript`](https://hub.docker.com/r/jamalshadowdev/ouiwine) | JavaScript + Node.js |
| **Latest** | [`jamalshadowdev/ouiwine:latest`](https://hub.docker.com/r/jamalshadowdev/ouiwine) | (aponta para TypeScript) |

---

## 🔐 **USUÁRIOS DEMO PARA TESTE**

| Email | Senha | Tipo |
|-------|-------|------|
| `admin@ouiwine.com` | `admin123` | Administrador |
| `migration@test.com` | `123456` | Usuário comum |

### **Dados Demo Incluídos:**
- ✅ **2 usuários** cadastrados para login
- ✅ **Colaborações de teste** para validação do sistema
- ✅ **Conteúdo educativo** sobre degustação

---

## 📋 **REQUISITOS ATENDIDOS**

### ✅ **Banco de Dados SQLite - 2 Funcionalidades**
1. **Cadastro/Login de usuários** (tabela `Users`)
2. **Sistema de colaborações** (tabela `Colaboracoes`)
3. **Relacionamento:** Users → Colaboracoes (chave estrangeira)

### ✅ **Node.js + Express**
- Servidor Express (porta 3000 desenvolvimento | porta 80 produção)
- Middleware de sessão e autenticação

### ✅ **MVC - Separação de Responsabilidades**
- **Models:** `src/models/` (User.ts, Colaboracao.ts)
- **Views:** `views/` (EJS templates com partials)
- **Controllers:** `src/controllers/` (AuthController.ts, ColaboracaoController.ts)

### ✅ **TypeScript**
- Todo backend em TypeScript (`src/`)
- Interfaces tipadas (`src/types/`)
- Compilação para JavaScript (`dist/`)

### ✅ **EJS Templates**
- Views 100% EJS com partials reutilizáveis
- JavaScript embarcado (loops, condicionais, variáveis)
- Dados dinâmicos do backend

### ✅ **UX - Experiência do Usuário**
- Interface responsiva Bootstrap
- Tema visual consistente OuiWine
- Flash messages para feedback
- Validações em tempo real
- Navegação intuitiva

---

## 🌿 **ESTRATÉGIA DE BRANCHES**

### **Linha do Tempo de Desenvolvimento:**
```
main (v2.0.0-typescript) ← Versão Final TypeScript
 ↑
v1.0.0-javascript ← Versão JavaScript Legado
 ↑  
v1.0-legado ← Primeira versão HTML puro
```

### **Justificativa Técnica:**
- **v1.0-legado:** Protótipo inicial HTML/CSS puro
- **v1.0.0-javascript:** Primeira versão fullstack JavaScript
- **v2.0.0-typescript:** Migração para TypeScript com melhorias

Esta estratégia permitiu:
1. **Versionamento claro** de cada tecnologia
2. **Compatibilidade** com ambas as stacks
3. **Evidência da evolução** técnica do projeto
4. **Deploy independente** de cada versão

---

## 🍷 **FUNCIONALIDADES PRINCIPAIS**

### **🏠 Wiki Educativa**
- Conteúdo sobre degustação de vinhos
- Tipos de vinhos e harmonizações
- Curiosidades e dicas

### **🔐 Sistema de Autenticação**
- Cadastro de usuários
- Login com sessão
- Middleware de proteção

### **📝 Colaborações**
- Formulário para compartilhar experiências
- Validação de CPF e dados
- Lista pública de colaborações
- Filtros por texto e data

---

## 🛠️ **STACK TÉCNICA**

### **Backend**
- Node.js + Express + TypeScript
- Sequelize ORM + SQLite
- bcryptjs + express-session

### **Frontend**
- EJS Templates + Bootstrap 5.3.4
- CSS customizado + JavaScript vanilla

### **DevOps**
- Docker + docker-compose
- GitHub + DockerHub

---

## 📁 **ESTRUTURA DO PROJETO**

```
ouiwine/
├── src/                     # Código TypeScript
│   ├── controllers/         # Lógica de negócio
│   ├── middleware/          # Autenticação
│   ├── models/             # Models Sequelize
│   ├── routes/             # Rotas da aplicação
│   ├── types/              # Interfaces TypeScript
│   └── server.ts           # Entry point
├── dist/                   # JavaScript compilado
├── views/                  # Templates EJS
├── public/                 # Assets estáticos
├── config/                 # Configurações
├── migrations/             # Banco de dados
├── Dockerfile              # Container
├── docker-compose.yml      # Orquestração
└── package.json            # Dependências
```

---

## 🎯 **DIFERENCIAIS TÉCNICOS**

### **Arquitetura Profissional**
- Separação clara de responsabilidades
- Interfaces TypeScript tipadas
- Middleware customizado de autenticação
- Sistema de migrations do banco

### **DevOps & Deploy**
- Docker multi-stage para otimização
- Imagens no DockerHub públicas
- Scripts npm organizados
- Graceful shutdown do servidor

### **Qualidade de Código**
- TypeScript para type safety
- Validações no frontend e backend
- Error handling estruturado
- Logs detalhados para debug

---

## 🚀 **COMANDOS ÚTEIS**

```bash
# Desenvolvimento
npm run dev              # Desenvolvimento com hot reload (porta 3000)
npm run build            # Compilar TypeScript
npm start                # Produção (JavaScript compilado)

# Banco de Dados
npm run db:reset         # Banco zerado (vazio)
npm run db:demo          # Restaurar dados demo
npm run migrate          # Executar migrations

# Docker
docker-compose up -d     # Rodar em produção (porta 80)
docker logs ouiwine      # Ver logs
```

---

## 📚 **CONTEXTO ACADÊMICO**

**Instituição:** Fatec Mogi Mirim "Arthur de Azevedo"  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Disciplina:** Programação de Scripts  
**Professor:** FRANCISCO ADÃO ELOY JUNIOR  
**Período:** 4º Semestre | 2025

### **Objetivos Alcançados:**
✅ Aplicação prática de Node.js + Express  
✅ Implementação de padrão MVC  
✅ Uso avançado de TypeScript  
✅ Integração com banco de dados  
✅ Deploy com containers Docker  
✅ Versionamento e colaboração Git  

---

## 🎓 **CONSIDERAÇÕES FINAIS**

Este projeto demonstra a evolução técnica dos desenvolvedores ao longo da disciplina, partindo de um protótipo HTML simples até uma aplicação fullstack profissional com TypeScript e Docker.

A escolha do tema "degustação de vinhos" permitiu criar uma experiência rica em conteúdo, validações complexas e design atrativo, superando os requisitos mínimos propostos.

---

**💡 Para execução imediata, recomendamos a versão Docker TypeScript:**
```bash
docker run -d -p 80:3000 jamalshadowdev/ouiwine:typescript
```

*Desenvolvido com 🍷 por Brenda Gaudêncio e Marcos Moreira*