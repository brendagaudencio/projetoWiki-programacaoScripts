# 🍷 OuiWine - Multi-stage TypeScript Build
FROM node:18-alpine AS builder

# Instalar dependências do sistema para SQLite
RUN apk add --no-cache sqlite python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte TypeScript
COPY src/ ./src/

# Copiar configurações Sequelize necessárias para build
COPY config/ ./config/
COPY migrations/ ./migrations/
COPY .sequelizerc ./

# Build TypeScript → JavaScript
RUN npm run build

# Verificar se build foi criado
RUN ls -la dist/

# ===== STAGE PRODUCTION =====
FROM node:18-alpine AS production

# Instalar SQLite no stage final
RUN apk add --no-cache sqlite

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ouiwine -u 1001

# Copiar package.json para instalar apenas dependencies
COPY package*.json ./

# Instalar apenas dependencies de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado do stage builder
COPY --from=builder /app/dist ./dist

# Copiar arquivos necessários para runtime
COPY views/ ./views/
COPY public/ ./public/

# Copiar configurações Sequelize para runtime
COPY config/ ./config/
COPY migrations/ ./migrations/
COPY .sequelizerc ./
COPY controllers/ ./controllers/

# Criar diretório para banco de dados SQLite
RUN mkdir -p /app/data

# Dar permissões para usuário ouiwine
RUN chown -R ouiwine:nodejs /app && \
    chmod -R 755 /app

# Trocar para usuário não-root
USER ouiwine

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para iniciar aplicação TypeScript compilada
CMD ["npm", "start"]