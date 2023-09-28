#!/bin/sh
set -e

yarn install
yarn prisma db push

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
