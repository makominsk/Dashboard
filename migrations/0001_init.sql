CREATE TABLE IF NOT EXISTS instagram_user_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  reach INTEGER,
  total_interactions INTEGER,
  saves INTEGER,
  follower_count INTEGER,
  followers_total INTEGER,
  followers_delta_month INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS instagram_post_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL UNIQUE,
  date TEXT,
  reach INTEGER,
  likes INTEGER,
  comments INTEGER,
  saves INTEGER,
  shares INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings_raw (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sheet_name TEXT NOT NULL,
  row_index INTEGER NOT NULL,
  fio TEXT,
  contact_raw TEXT,
  phone TEXT,
  parent_name TEXT,
  hash TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_hash_idx ON bookings_raw(hash);
CREATE INDEX IF NOT EXISTS bookings_sheet_idx ON bookings_raw(sheet_name);
CREATE INDEX IF NOT EXISTS bookings_updated_idx ON bookings_raw(updated_at);

CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL,
  summary TEXT,
  start_time TEXT,
  end_time TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS calendar_start_idx ON calendar_events(start_time);

CREATE TABLE IF NOT EXISTS sync_state (
  source TEXT PRIMARY KEY,
  cursor TEXT,
  last_sync_at TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
