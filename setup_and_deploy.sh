#!/bin/bash
# Полный деплой: миграция D1 + воркер
# Запустите в терминале: bash setup_and_deploy.sh

set -e
cd "$(dirname "$0")"

export WRANGLER_HOME="/Users/macbookpro_ma-ko/Library/Preferences/.wrangler"

echo "========================================"
echo "  Dashboard — Деплой на Cloudflare"
echo "========================================"
echo ""

# Проверяем авторизацию wrangler
echo "Проверка авторизации wrangler..."
npx wrangler whoami 2>&1 | head -5 || true
echo ""

# Применяем миграцию
echo "=== Шаг 1: Миграция D1 ==="
npx wrangler d1 migrations apply dashboard --remote
echo "✓ Миграция применена"
echo ""

# Деплоим воркер
echo "=== Шаг 2: Деплой воркера ==="
npx wrangler deploy
echo "✓ Воркер задеплоен"
echo ""

echo "========================================"
echo "  Готово!"
echo "  URL: https://dashboard-backend.mako-maryia.workers.dev"
echo "========================================"
