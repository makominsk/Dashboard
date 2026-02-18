-- Добавляем UNIQUE constraint на event_id в calendar_events
-- чтобы ON CONFLICT(event_id) DO UPDATE работал корректно

-- SQLite не поддерживает ADD CONSTRAINT на существующую таблицу,
-- поэтому пересоздаём таблицу через rename + create + copy + drop

ALTER TABLE calendar_events RENAME TO calendar_events_old;

CREATE TABLE calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  summary TEXT,
  start_time TEXT,
  end_time TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS calendar_start_idx ON calendar_events(start_time);

INSERT INTO calendar_events (id, event_id, summary, start_time, end_time, updated_at)
SELECT id, event_id, summary, start_time, end_time, updated_at
FROM calendar_events_old
WHERE event_id IS NOT NULL AND event_id != ''
GROUP BY event_id
HAVING id = MIN(id);

DROP TABLE calendar_events_old;
