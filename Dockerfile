# ========== BUILD STAGE ==========
FROM node:20-alpine AS builder

WORKDIR /app

# зависимости
COPY package*.json ./
RUN npm install --legacy-peer-deps

# исходники
COPY . .

# сборка
RUN npm run build


# ========== PRODUCTION STAGE ==========
FROM node:20-alpine

WORKDIR /app

# только production зависимости (НО ВАЖНО: vite НЕ ломается)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# билд из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public 2>/dev/null || true

# если есть .env
COPY .env ./.env 2>/dev/null || true

# порт (меняешь под себя через docker-compose)
EXPOSE 3000

# запуск
CMD ["node", "dist/server.cjs"]
