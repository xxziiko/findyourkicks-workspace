# ------------------------
# 1. Base 환경 정의
# ------------------------
FROM node:20-slim AS base
WORKDIR /workspace

# ------------------------
# 2. Prune 작업을 위한 빌더 단계
# ------------------------
FROM base AS builder

RUN npm install -g turbo
RUN npm install -g pnpm@10.10.0

COPY . .
RUN turbo prune --scope=admin --docker

# ------------------------
# 3. 설치 및 빌드
# ------------------------
FROM base AS installer

WORKDIR /workspace
COPY --from=builder /workspace/out/json/ ./
COPY apps/admin/.env.production ./apps/admin/.env.production

RUN npm install -g pnpm@10.10.0
RUN pnpm install --frozen-lockfile

COPY --from=builder /workspace/out/full/ ./
RUN pnpm run build --filter=admin

# ------------------------
# 4. 러너 이미지
# ------------------------------
FROM node:20-slim AS runner

WORKDIR /workspace

RUN npm install -g serve

# 사용자 권한 설정
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 adminuser
USER adminuser

# 빌드된 정적 파일 복사
COPY --from=installer /workspace/apps/admin/dist ./apps/admin/dist
COPY --from=installer /workspace/apps/admin/public ./apps/admin/public

EXPOSE 3000
CMD ["serve", "-s", "apps/admin/dist", "-l", "3000"]