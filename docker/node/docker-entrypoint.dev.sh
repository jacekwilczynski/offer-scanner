#!/bin/sh
set -e

yarn install --frozen-lockfile
yarn orm:sync

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
