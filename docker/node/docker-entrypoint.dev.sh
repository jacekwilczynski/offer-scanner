#!/bin/sh
set -e

yarn install
yarn prisma generate

dbConnectionAttemptsLeft=20
until yarn prisma migrate deploy; do
    dbConnectionAttemptsLeft=$((dbConnectionAttemptsLeft - 1))

    if [ "$dbConnectionAttemptsLeft" -gt 0 ]; then
        echo "Database schema creation failed. Most likely, the database isn't responding yet. Will retry in 1s."
    else
        echo "Database schema creation failed despite 20 attempts. Quitting."
        exit 1
    fi
done

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
