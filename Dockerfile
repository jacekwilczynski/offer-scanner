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

# cron
RUN apk add --no-cache apk-cron
COPY docker/node/crontab /etc/crontabs/root
CMD ["crond", "-f"]

# entrypoint
COPY docker/node/docker-entrypoint.base.sh docker/node/docker-entrypoint.prod.sh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.prod.sh"]

# prisma
COPY prisma/ ./prisma
RUN yarn prisma generate

# sources
COPY tsconfig.json ./
COPY src/ ./src
