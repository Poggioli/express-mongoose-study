FROM node:16-slim as BUILDER
LABEL maintainer="João Pogiolli"

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY ./src ./src
COPY ./config ./config
COPY .babelrc ./
ENV NODE_ENV=prod
RUN npm run babel

FROM node:16-alpine

WORKDIR /app
ENV NODE_ENV 'prod'

COPY --from=BUILDER /app/dist ./dist
COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER /app/config ./config
COPY --from=BUILDER /app/package.json ./

EXPOSE 3002

CMD ["node", "dist/index.js"]
