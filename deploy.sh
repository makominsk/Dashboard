#!/bin/bash
set -e

echo "=== Dashboard Deploy ==="
echo ""

echo "1. Применяем миграцию БД..."
npx wrangler d1 migrations apply dashboard --remote
echo "✓ Миграция применена"
echo ""

echo "2. Деплоим воркер..."
npx wrangler deploy
echo "✓ Воркер задеплоен"
echo ""

echo "=== Готово! ==="
echo "URL: https://dashboard-backend.mako-maryia.workers.dev"
