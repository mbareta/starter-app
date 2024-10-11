# syntax=docker/dockerfile:1

FROM node:22.8.0-bookworm-slim@sha256:377674fd5bb6fc2a5a1ec4e0462c4bfd4cee1c51f705bbf4bda0ec2c9a73af72 AS base
  RUN apt update && apt install -y --no-install-recommends dumb-init
  ENTRYPOINT ["dumb-init", "--"]

FROM base AS install
  WORKDIR /usr/src/app
  ENV NODE_ENV production
  COPY package*.json .
  RUN npm ci

FROM base as configure
  WORKDIR /usr/src/app
  ENV NODE_ENV production
  COPY --chown=node:node . .
  COPY --chown=node:node --from=install /usr/src/app/node_modules ./node_modules
  RUN chown -R node:node /usr/src/app

FROM configure AS server
  WORKDIR /usr/src/app
  ENV NODE_ENV production
  USER node
  CMD npm run build && npx mikro-orm migration:up && npm start:prod
