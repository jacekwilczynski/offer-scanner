#!/usr/bin/env sh
set -e

if [ "$1" != "sh" ]; then
    dbConnectionAttemptsLeft=20
    until yarn prisma migrate deploy; do
        dbConnectionAttemptsLeft=$((dbConnectionAttemptsLeft - 1))

        if [ "$dbConnectionAttemptsLeft" -gt 0 ]; then
            echo "Database migrations failed. Most likely, the database isn't responding yet. Will retry in 1s."
        else
            echo "Database migrations failed despite 20 attempts. Quitting."
            exit 1
        fi
    done
fi

exec "$(dirname "$0")/docker-entrypoint.sh" "$@"
