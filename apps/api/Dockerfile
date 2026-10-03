# API image. Build from the repository root:
#   docker build -f apps/api/Dockerfile -t kidty-api .
FROM node:22-slim AS build
WORKDIR /app
# npm workspaces need every workspace manifest to validate the lockfile.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/api ./apps/api
RUN npm ci --workspace @kidty/api --include-workspace-root=false \
 && npm run build --workspace @kidty/api \
 && npm prune --omit=dev --workspace @kidty/api

FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json /app/apps/api/prisma.config.ts ./apps/api/
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/dist ./apps/api/dist
WORKDIR /app/apps/api
USER node
EXPOSE 8088
# Apply pending migrations, then start the server.
CMD ["npm", "run", "start:prod"]
