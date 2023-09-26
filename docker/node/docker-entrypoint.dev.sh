#!/bin/sh
set -e

yarn install --frozen-lockfile
yarn drizzle-kit push:pg

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
