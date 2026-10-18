# ─── Stage 1: Build ──────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10 && npm ci --ignore-scripts --no-audit --no-fund --prefer-offline && npm rebuild bcrypt sharp
COPY . .
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────
FROM node:22-slim
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
