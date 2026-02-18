#!/bin/bash
# Скрипт деплоя Dashboard на Cloudflare Workers
# Запустите: bash deploy.sh

set -e
cd "$(dirname "$0")"

export WRANGLER_HOME="/Users/macbookpro_ma-ko/Library/Preferences/.wrangler"

echo "=== 1. Применяем миграцию D1 ==="
npx wrangler d1 migrations apply dashboard --remote

echo ""
echo "=== 2. Деплоим воркер ==="
npx wrangler deploy

echo ""
echo "=== Готово! ==="
echo "Воркер: https://dashboard-backend.mako-maryia.workers.dev"
