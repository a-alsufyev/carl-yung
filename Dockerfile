FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public 2>/dev/null || true

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
