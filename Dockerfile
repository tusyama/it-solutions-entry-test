FROM node:22-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma7.config.ts ./prisma7.config.ts
COPY --from=build /app/src/generated/prisma ./src/generated/prisma
COPY --from=build /app/src/prisma/create-pg-adapter.ts ./src/prisma/create-pg-adapter.ts
COPY --from=build /app/src/profile/profile.constants.ts ./src/profile/profile.constants.ts
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker/entrypoint.sh"]