# Деплой Dashboard

## Быстрый деплой (рекомендуется)

Откройте терминал в папке проекта и выполните:

```bash
bash setup_and_deploy.sh
```

Скрипт автоматически:
1. Применит миграцию D1 (`0002_calendar_unique.sql`)
2. Задеплоит воркер на Cloudflare Workers

---

## GitHub Actions (автодеплой при push)

Workflow уже настроен в `.github/workflows/deploy.yml`.

### Добавить секрет CLOUDFLARE_API_TOKEN:

1. Перейдите: https://dash.cloudflare.com/profile/api-tokens
2. Нажмите **Create Token**
3. Выберите шаблон **Edit Cloudflare Workers**
4. Нажмите **Continue to summary** → **Create Token**
5. Скопируйте токен

6. Перейдите в репозиторий GitHub: https://github.com/makominsk/Dashboard
7. **Settings** → **Secrets and variables** → **Actions**
8. Нажмите **New repository secret**
9. Name: `CLOUDFLARE_API_TOKEN`
10. Value: вставьте скопированный токен
11. Нажмите **Add secret**

После этого каждый `git push` будет автоматически деплоить воркер.

### Запустить деплой вручную через GitHub Actions:

1. Перейдите: https://github.com/makominsk/Dashboard/actions
2. Выберите workflow **Deploy to Cloudflare Workers**
3. Нажмите **Run workflow**

---

## Ручной деплой через терминал

```bash
# Применить миграцию
npx wrangler d1 migrations apply dashboard --remote

# Задеплоить воркер
npx wrangler deploy
```

---

## Переменные окружения (Cloudflare Secrets)

Секреты хранятся в Cloudflare Workers (не в коде):

```bash
npx wrangler secret put COMPOSIO_API_KEY
npx wrangler secret put BASIC_USER
npx wrangler secret put BASIC_PASS
```

---

## Структура проекта

```
Dashboard/
├── index.html          # Фронтенд дашборда
├── src/worker.js       # Cloudflare Worker (бэкенд)
├── wrangler.toml       # Конфигурация Cloudflare
├── migrations/
│   ├── 0001_init.sql              # Начальная схема БД
│   └── 0002_calendar_unique.sql   # UNIQUE на event_id
└── .github/workflows/deploy.yml   # GitHub Actions
```
