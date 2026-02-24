# Банк памяти проекта

## Назначение
Краткие заметки о контексте проекта, текущих целях и принятых решениях.

## Проект
- Название: Dashboard
- Репозиторий/папка: /Users/macbookpro_ma-ko/Documents/Вайбкодинг_курс 2/Dashboard

## Текущее состояние
- Стек/технологии: не зафиксировано
- Активные файлы: index.html

## Цели
- [ ] Определить ключевые страницы/экраны
- [ ] Зафиксировать дизайн-направление
- [ ] Описать требования к функционалу

## Решения и соглашения
- Пока не зафиксированы.

## Открытые вопросы
- Какой целевой функционал у Dashboard?
- Нужны ли интеграции/данные из API?

## История изменений
- 2026-02-17: создан файл банка памяти.

- 2026-02-17: добавлен файл `keys.env` для ключей и добавлен `keys.env` в `.gitignore`.

- 2026-02-17: сверстан новый фронтенд панели мониторинга в `index.html` с тремя блоками (Instagram аналитика, бронирования из Google Sheets, расписание недели + сегодня).

- 2026-02-17: добавлены даты смен в блок бронирований и обновлены строки таблицы в `index.html`.

- 2026-02-17: добавлен блок радио на дашборд и подключен скрипт RadioPotok в `index.html`.

- 2026-02-17: стилизована кнопка RadioPotok и контейнер радио, добавлены CSS-правила для аккуратного встраивания.

- 2026-02-17: дата перенесена под радио (число/месяц/день недели), убран бейдж даты из шапки.

- 2026-02-17: увеличены размеры даты под радио (число/месяц/день недели).

- 2026-02-17: дата под радио сделана крупнее и переведена на основной шрифт интерфейса.

- 2026-02-17: дата под радио увеличена до 88px и сдвинута ниже.

- 2026-02-17: месяц под радио теперь в родительном падеже (формат "17 февраля").

- 2026-02-17: реализован бэкенд на Cloudflare Workers + D1 + KV. Созданы файлы `src/worker.js`, `migrations/0001_init.sql`, `wrangler.toml`, `docs/COMPOSIO.md`, `docs/DEPLOY.md`. В `index.html` добавлена кнопка «Обновить все данные» и вызовы `/api/refresh-all` и `/api/instagram/refresh`, поддержка `window.DASHBOARD_API_BASE` и `window.DASHBOARD_AUTH`.

- 2026-02-17: эндпоинты воркера: `GET /api/dashboard`, `POST /api/instagram/refresh`, `POST /api/bookings/refresh`, `POST /api/calendar/refresh`, `POST /api/refresh-all`. Basic Auth включён через `BASIC_USER/BASIC_PASS` (если заданы). Cron: `*/30 * * * *` (Sheets), `0 * * * *` (Calendar по МСК).

- 2026-02-17: D1 database создан и подключён: `database_id = 79a1f7e8-2538-44e0-9bc9-788529a8f25d`. KV namespace создан и подключён: `id = 29f1b76f2de845d7b408f47a03f470bb`.

- 2026-02-17: деплой воркера успешен: `https://dashboard-backend.mako-maryia.workers.dev`.

- 2026-02-17: миграции выполнены локально и затем remote (`--remote`) успешно.

- 2026-02-17: секреты загружены: `COMPOSIO_API_KEY`, `BASIC_USER`, `BASIC_PASS`. Basic Auth проверен: `GET /api/dashboard` с корректной авторизацией даёт 200.

- 2026-02-17: Composio ответил 500 на sync, ошибка: “This endpoint is no longer available. Please upgrade to v3 APIs.” Переключено на v3: `COMPOSIO_EXECUTE_PATH = /api/v3/tools/execute`, формат запроса изменён на `connected_account_id` + `arguments`. Добавлена расширенная обработка ошибок (возврат текста/JSON). Нужен **повторный deploy** и повторный вызов sync для получения новой ошибки/успеха.
- 2026-02-18: **Соединения активны!** 🎉 Instagram sync теперь работает. Исправлены:
  - Тулы: `INSTAGRAM_GET_IG_USER_MEDIA` → `INSTAGRAM_GET_USER_MEDIA`, `INSTAGRAM_GET_IG_MEDIA_INSIGHTS` → `INSTAGRAM_GET_POST_INSIGHTS`
  - Метрики: `saves` vs `saved` (разные для user insights и post insights)
  - Формат дат: Unix timestamps → ISO строки (YYYY-MM-DD) для INSTAGRAM_GET_USER_INSIGHTS
  - IG_USER_ID обновлён на `34985356197729987` (правильный ID из connected account)
  - POST /api/instagram/refresh теперь возвращает HTTP 200 с `{"ok": true, "result": {"dates": 0, "posts": 25}}`
  - В таблицу instagram_post_metrics успешно вставлено 25 строк
  - Проверены Composio connected accounts: Instagram (ca_TGVA67AbNO78, ACTIVE), Calendar (ca_2UnTItt_Dsp-), Google Sheets (ca_OOCCclWP2CiQ), entity_id = "ma-ko"
  - Коммит: 06092e0 с сообщением "3"

- 2026-02-18: **Все три синхронизации работают!** ✅ Исправлена функция `syncSheets`:
  - Заменён инструмент: `GOOGLESHEETS_VALUES_GET` → `GOOGLESHEETS_BATCH_GET` (новый формат Composio v3)
  - Обновлена обработка ответа: `valueRanges[0].values` вместо `values`
  - Все уже-деновые параметры: `ranges` как массив вместо `range`
  - Статус синхронизаций:
    - ✅ Instagram: HTTP 200, 25 постов в D1
    - ✅ Sheets: HTTP 200, 0 вставлено (нет данных в листах)
    - ✅ Calendar: HTTP 200, 0 событий (нет событий в диапазоне)
  - Все три эндпоинта (`/api/instagram/refresh`, `/api/bookings/refresh`, `/api/calendar/refresh`) работают без ошибок
  - Коммит: 1afab6b "Fix: Change GOOGLESHEETS_VALUES_GET to GOOGLESHEETS_BATCH_GET - all syncs now working"

- 2026-02-24: Исправления Instagram и UI:
  - Период Instagram переключён на 3 месяца (90 дней) в расчётах и UI.
  - Починен CI build (убраны шаблонные строки внутри HTML_PAGE).
  - Добавлен fallback для метрик постов: likes/comments берутся из media list (fields: like_count, comments_count).
  - Сводка Instagram расширялась, затем удалены неработающие блоки ER/Сохранения/Репосты по запросу.
  - Переключение на `INSTAGRAM_GET_IG_MEDIA_INSIGHTS` для попытки получить saved/shares.
  - Дашборд Vercel должен ходить в Cloudflare Worker: `https://dashboard-backend.mako-maryia.workers.dev`.

- 2026-02-24: Блоки бронирований/мест:
  - Удалены большие дублирующие блоки «Подписчики» и «Посты».
  - Добавлены два блока: «Мест всего / Мест осталось» и «Забронировано / Предоплата».
  - Данные считаются из `bookings_raw`:
    - Забронировано: строки 9–58 по всем листам, где заполнена колонка B (fio).
    - Мест осталось = 300 − Забронировано.
    - Предоплата: по колонке K.
  - Добавлена миграция `migrations/0003_add_prepaid.sql` (колонка `prepaid`).
  - В `syncSheets` добавлено чтение предоплат:
    - По цвету (зелёная заливка) через `GOOGLESHEETS_GET_SPREADSHEET_BY_DATA_FILTER`.
    - По значению в `K9:K58` через `GOOGLESHEETS_VALUES_GET`.
    - Добавлено экранирование имён листов для A1-диапазонов (пробелы и спецсимволы).
  - Добавлен расчёт `bookingsSummary` в `/api/dashboard`: total=300, booked, prepaid, left.
