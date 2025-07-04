FROM node:20-slim AS base
WORKDIR /workspace

FROM base AS builder

RUN npm install -g turbo
RUN npm install -g pnpm@10.10.0

COPY . .
RUN turbo prune --scope=shop --docker

FROM base AS installer

WORKDIR /workspace
COPY --from=builder /workspace/out/json/ ./

RUN npm install -g pnpm@10.10.0
RUN pnpm install --frozen-lockfile

COPY --from=builder /workspace/out/full/ ./
COPY  apps/shop/.env.production ./apps/shop/.env.production

RUN pnpm run build --filter=shop

FROM node:20-slim AS runner

WORKDIR /workspace

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs


COPY --from=installer  --chown=nextjs:nodejs /workspace/apps/shop/.next/standalone ./.next/standalone
COPY --from=installer  --chown=nextjs:nodejs /workspace/apps/shop/.next/static \
      ./.next/standalone/apps/shop/.next/static
COPY --from=installer  --chown=nextjs:nodejs /workspace/apps/shop/public \
      ./.next/standalone/apps/shop/public

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".next/standalone/apps/shop/server.js"]
