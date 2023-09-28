#!/bin/sh
set -e

yarn install

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
