#!/bin/sh
set -e

yarn install --frozen-lockfile
yarn build
yarn drizzle-kit push:pg

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
