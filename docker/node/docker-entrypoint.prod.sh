#!/usr/bin/env sh
set -e

exec "$(dirname "$0")/docker-entrypoint.base.sh" "$@"
