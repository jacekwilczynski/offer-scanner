#!/usr/bin/env sh

set -e

docker compose -f docker-compose.prod.yml build
doctl registry login
docker push registry.digitalocean.com/offer-scanner/node
