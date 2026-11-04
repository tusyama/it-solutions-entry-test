#!/bin/sh
set -eu

export PATH="/app/node_modules/.bin:$PATH"

attempts=0
until prisma migrate deploy; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge 10 ]; then
    echo "migrate deploy failed" >&2
    exit 1
  fi
  sleep 2
done

prisma db seed
exec node dist/main.js
