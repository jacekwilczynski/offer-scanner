############
#   BASE   #
############

FROM node:18.18.0-alpine3.18 AS base

WORKDIR /app



############
#   DEV   #
############

FROM base AS dev

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.dev.sh"]



############
#   PROD   #
############

FROM base AS prod

# app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# entrypoint
COPY docker/node/docker-entrypoint.base.sh docker/node/docker-entrypoint.prod.sh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.prod.sh"]
CMD ["yarn", "app:watch"]

# prisma
COPY prisma/ ./prisma
RUN yarn prisma generate

# sources
COPY tsconfig.json ./
COPY src/ ./src
