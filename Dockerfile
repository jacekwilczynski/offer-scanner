FROM node:16.20.0-alpine3.18

WORKDIR /app

RUN apk add apk-cron
COPY docker/node/crontab /etc/crontabs/root
