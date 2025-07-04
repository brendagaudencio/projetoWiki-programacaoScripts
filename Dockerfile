# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências do sistema para SQLite
RUN apk add --no-cache sqlite

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração primeiro (cache layer)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ouiwine -u 1001

# STAGE FINAL
FROM node:18-alpine AS production

# Instalar SQLite e wget no stage final
RUN apk add --no-cache sqlite wget

WORKDIR /app

# Criar usuário ANTES de usar no COPY
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ouiwine -u 1001

# Copiar node_modules do stage anterior
COPY --from=base /app/node_modules ./node_modules

# Copiar código da aplicação
COPY --chown=ouiwine:nodejs . .

# Criar diretório para banco de dados e dar permissão total para /app
RUN mkdir -p /app/data && \
    chown -R ouiwine:nodejs /app && \
    chmod -R 755 /app

# Trocar para usuário não-root
USER ouiwine

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]