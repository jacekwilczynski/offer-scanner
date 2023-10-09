#!/usr/bin/env sh
set -e

yarn install
yarn prisma generate

exec "$(dirname "$0")/docker-entrypoint.base.sh" "$@"
