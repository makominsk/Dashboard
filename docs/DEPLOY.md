# Деплой и настройка (по шагам)

## 1) Установка и логин в Wrangler
```bash
npm i -g wrangler
wrangler login
```

## 2) Создание D1 и KV
```bash
wrangler d1 create dashboard
wrangler kv:namespace create KV
```

Скопируйте выданные `database_id` и `id` в `wrangler.toml`:
- `[[d1_databases]].database_id`
- `[[kv_namespaces]].id`

## 3) Секреты и переменные
Секреты:
```bash
wrangler secret put COMPOSIO_API_KEY
wrangler secret put BASIC_USER
wrangler secret put BASIC_PASS
```

Переменные в `wrangler.toml` уже заполнены, проверьте:
- `COMPOSIO_API_BASE`
- `COMPOSIO_EXECUTE_PATH`
- `SHEETS_ID`
- `IG_USER_ID`
- `CALENDAR_ID`
- `SHEETS_MAX_ROWS`

Также задайте connection IDs (если хотите как vars, можно добавить в `wrangler.toml`):
- `COMPOSIO_CONN_IG=ac_MrrJZzCfy2Jy`
- `COMPOSIO_CONN_SHEETS=ac_MrrJZzCfy2Jy` (или другой, если отдельный)
- `COMPOSIO_CONN_CALENDAR=ac_2UnTItt_Dsp-`

В текущем коде значения читаются из env, поэтому добавьте их либо в `wrangler.toml`, либо через `wrangler secret/vars`.

## 4) Миграции D1
```bash
wrangler d1 execute dashboard --file=./migrations/0001_init.sql
```

## 5) Деплой воркера
```bash
wrangler deploy
```

## 6) Подключение фронтенда
В `index.html` уже добавлены:
- Кнопка **«Обновить все данные»**
- Вызовы `POST /api/refresh-all` и `POST /api/instagram/refresh`

Если фронт размещён отдельно (Vercel), задайте базу API и auth:
```html
<script>
  window.DASHBOARD_API_BASE = "https://<your-worker>.workers.dev";
  window.DASHBOARD_AUTH = "Basic <base64(user:pass)>";
</script>
```

## 7) Проверка
1. Нажать «Обновить» в Instagram — обновляются метрики.
2. Нажать «Обновить все данные» — синк всех источников.
3. Каждые 30 мин — Google Sheets.
4. В 00:00 МСК — календарь.

