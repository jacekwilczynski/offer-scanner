#!/bin/sh
set -e

yarn install
yarn drizzle-kit push:pg

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
