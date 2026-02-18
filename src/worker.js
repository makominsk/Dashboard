const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (!checkAuth(request, env)) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          ...CORS_HEADERS,
          "WWW-Authenticate": 'Basic realm="Dashboard"',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (request.method === "GET" && path === "/api/dashboard") {
        const data = await getDashboard(env);
        return jsonResponse(data);
      }

      if (request.method === "POST" && path === "/api/instagram/refresh") {
        const result = await syncInstagram(env);
        return jsonResponse({ ok: true, result });
      }

      if (request.method === "POST" && path === "/api/bookings/refresh") {
        const result = await syncSheets(env);
        return jsonResponse({ ok: true, result });
      }

      if (request.method === "POST" && path === "/api/calendar/refresh") {
        const result = await syncCalendar(env, true);
        return jsonResponse({ ok: true, result });
      }

      if (request.method === "POST" && path === "/api/refresh-all") {
        const result = await refreshAll(env);
        return jsonResponse({ ok: true, result });
      }

      return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    } catch (error) {
      return jsonResponse(
        { ok: false, error: error?.message || String(error) },
        500
      );
    }
  },

  async scheduled(event, env, ctx) {
    if (event.cron === "*/30 * * * *") {
      ctx.waitUntil(syncSheets(env));
      return;
    }

    if (event.cron === "0 * * * *") {
      ctx.waitUntil(syncCalendar(env, false));
      return;
    }
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function checkAuth(request, env) {
  if (!env.BASIC_USER || !env.BASIC_PASS) {
    return true;
  }

  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Basic ")) {
    return false;
  }

  const raw = header.slice(6);
  let decoded = "";
  try {
    decoded = atob(raw);
  } catch {
    return false;
  }

  const [user, pass] = decoded.split(":");
  return user === env.BASIC_USER && pass === env.BASIC_PASS;
}

async function refreshAll(env) {
  const instagram = await syncInstagram(env);
  const sheets = await syncSheets(env);
  const calendar = await syncCalendar(env, true);
  return { instagram, sheets, calendar };
}

async function getDashboard(env) {
  const now = new Date();
  const today = formatDate(now);
  const weekAgo = formatDate(new Date(now.getTime() - 7 * 86400000));
  const monthAgo = formatDate(new Date(now.getTime() - 30 * 86400000));
  const yearAgo = formatDate(new Date(now.getTime() - 365 * 86400000));

  const userMetrics = await env.DB.prepare(
    "SELECT * FROM instagram_user_metrics WHERE date >= ? ORDER BY date ASC"
  )
    .bind(yearAgo)
    .all();

  const postMetrics = await env.DB.prepare(
    "SELECT * FROM instagram_post_metrics WHERE date >= ? ORDER BY date ASC"
  )
    .bind(monthAgo)
    .all();

  const bookings = await env.DB.prepare(
    "SELECT * FROM bookings_raw ORDER BY updated_at DESC LIMIT 20"
  ).all();

  const calendar = await env.DB.prepare(
    "SELECT * FROM calendar_events WHERE start_time >= ? ORDER BY start_time ASC"
  )
    .bind(weekAgo)
    .all();

  const latestUser =
    userMetrics.results?.length > 0
      ? userMetrics.results[userMetrics.results.length - 1]
      : null;

  return {
    updatedAt: now.toISOString(),
    instagram: {
      today,
      week: weekAgo,
      month: monthAgo,
      year: yearAgo,
      followers_total: latestUser?.followers_total ?? null,
      followers_delta_month: latestUser?.followers_delta_month ?? null,
      userMetrics: userMetrics.results || [],
      postMetrics: postMetrics.results || [],
    },
    bookings: bookings.results || [],
    calendar: calendar.results || [],
  };
}

async function syncInstagram(env) {
  const now = new Date();
  const since = Math.floor((now.getTime() - 365 * 86400000) / 1000);
  const until = Math.floor(now.getTime() / 1000);

  const dailyInsights = await fetchComposio(
    env,
    env.COMPOSIO_CONN_IG,
    "INSTAGRAM_GET_USER_INSIGHTS",
    {
      ig_user_id: env.IG_USER_ID,
      metric: ["reach", "total_interactions", "saves", "follower_count"],
      period: "day",
      since,
      until,
    }
  );

  const dailyMap = normalizeInsightsToDaily(dailyInsights);
  const dates = Array.from(dailyMap.keys()).sort();

  for (const date of dates) {
    const row = dailyMap.get(date);
    await env.DB.prepare(
      `INSERT INTO instagram_user_metrics (date, reach, total_interactions, saves, follower_count)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET
         reach=excluded.reach,
         total_interactions=excluded.total_interactions,
         saves=excluded.saves,
         follower_count=excluded.follower_count`
    )
      .bind(
        date,
        row.reach ?? null,
        row.total_interactions ?? null,
        row.saves ?? null,
        row.follower_count ?? null
      )
      .run();
  }

  const userInfo = await fetchComposio(
    env,
    env.COMPOSIO_CONN_IG,
    "INSTAGRAM_GET_USER_INFO",
    { ig_user_id: env.IG_USER_ID }
  );

  const followersTotal =
    userInfo?.followers_count ??
    userInfo?.data?.followers_count ??
    userInfo?.data?.follower_count ??
    null;

  const deltaMonth = computeFollowersDeltaMonth(dates, dailyMap);
  const latestDate = dates[dates.length - 1];

  if (latestDate) {
    await env.DB.prepare(
      `UPDATE instagram_user_metrics
       SET followers_total = ?, followers_delta_month = ?
       WHERE date = ?`
    )
      .bind(followersTotal, deltaMonth, latestDate)
      .run();
  }

  const mediaSince = Math.floor((now.getTime() - 90 * 86400000) / 1000);
  const media = await fetchComposio(
    env,
    env.COMPOSIO_CONN_IG,
    "INSTAGRAM_GET_IG_USER_MEDIA",
    {
      ig_user_id: env.IG_USER_ID,
      since: mediaSince,
      fields: "id,timestamp,media_type",
    }
  );

  const mediaItems = media?.data || media?.items || [];

  for (const item of mediaItems) {
    if (!item?.id) continue;
    const insights = await fetchComposio(
      env,
      env.COMPOSIO_CONN_IG,
      "INSTAGRAM_GET_IG_MEDIA_INSIGHTS",
      {
        ig_media_id: item.id,
        metric: ["reach", "likes", "comments", "saves", "shares"],
      }
    );

    const insightMap = normalizeMediaInsights(insights);
    await env.DB.prepare(
      `INSERT INTO instagram_post_metrics (post_id, date, reach, likes, comments, saves, shares)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(post_id) DO UPDATE SET
         date=excluded.date,
         reach=excluded.reach,
         likes=excluded.likes,
         comments=excluded.comments,
         saves=excluded.saves,
         shares=excluded.shares`
    )
      .bind(
        item.id,
        (item.timestamp || "").slice(0, 10),
        insightMap.reach ?? null,
        insightMap.likes ?? null,
        insightMap.comments ?? null,
        insightMap.saves ?? null,
        insightMap.shares ?? null
      )
      .run();
  }

  await env.KV.put("last_sync_instagram", now.toISOString());
  return { dates: dates.length, posts: mediaItems.length };
}

async function syncSheets(env) {
  const sheetsResponse = await fetchComposio(
    env,
    env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
    "GOOGLESHEETS_GET_SHEET_NAMES",
    { spreadsheet_id: env.SHEETS_ID }
  );

  const sheetNames =
    sheetsResponse?.data?.sheet_names ||
    sheetsResponse?.data ||
    sheetsResponse?.sheet_names ||
    [];

  const maxRows = Number(env.SHEETS_MAX_ROWS || 2000);
  let inserted = 0;

  for (const sheetName of sheetNames) {
    const range = `${sheetName}!A1:Z${maxRows}`;
    const valuesResponse = await fetchComposio(
      env,
      env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
      "GOOGLESHEETS_VALUES_GET",
      {
        spreadsheet_id: env.SHEETS_ID,
        range,
      }
    );

    const values = valuesResponse?.data?.values || valuesResponse?.values || [];
    if (!values.length) continue;

    const headers = values[0].map((h) => String(h || "").trim());
    const fioIndex = findHeaderIndex(headers, "ФИО");
    const contactIndex = findHeaderIndex(headers, "контакт");
    if (fioIndex === -1 || contactIndex === -1) continue;

    for (let i = 1; i < values.length; i += 1) {
      const row = values[i];
      if (!row || (!row[fioIndex] && !row[contactIndex])) continue;

      const fio = String(row[fioIndex] || "").trim();
      const contactRaw = String(row[contactIndex] || "").trim();
      if (!fio && !contactRaw) continue;

      const hash = await sha256(`${sheetName}|${i + 1}|${fio}|${contactRaw}`);
      const exists = await env.DB.prepare(
        "SELECT 1 FROM bookings_raw WHERE hash = ? LIMIT 1"
      )
        .bind(hash)
        .first();

      if (exists) continue;

      const { phone, parentName } = parseContact(contactRaw);

      await env.DB.prepare(
        `INSERT INTO bookings_raw (sheet_name, row_index, fio, contact_raw, phone, parent_name, hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(sheetName, i + 1, fio, contactRaw, phone, parentName, hash)
        .run();

      inserted += 1;
    }
  }

  await env.KV.put("last_sync_sheets", new Date().toISOString());
  return { inserted };
}

async function syncCalendar(env, force) {
  const now = new Date();
  const mskDate = formatDateInTimeZone(now, "Europe/Moscow");
  const last = await env.KV.get("calendar_last_date");
  if (!force && last === mskDate) {
    return { skipped: true };
  }

  const { timeMin, timeMax } = getWeekRangeMsk(now);

  const eventsResponse = await fetchComposio(
    env,
    env.COMPOSIO_CONN_CALENDAR,
    "GOOGLECALENDAR_EVENTS_LIST",
    {
      calendarId: env.CALENDAR_ID || "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    }
  );

  const events = eventsResponse?.data?.items || eventsResponse?.items || [];

  await env.DB.prepare(
    "DELETE FROM calendar_events WHERE start_time >= ? AND start_time <= ?"
  )
    .bind(timeMin, timeMax)
    .run();

  for (const event of events) {
    const start = event?.start?.dateTime || event?.start?.date || null;
    const end = event?.end?.dateTime || event?.end?.date || null;

    await env.DB.prepare(
      `INSERT INTO calendar_events (event_id, summary, start_time, end_time)
       VALUES (?, ?, ?, ?)`
    )
      .bind(event?.id || "", event?.summary || "", start, end)
      .run();
  }

  await env.KV.put("calendar_last_date", mskDate);
  await env.KV.put("last_sync_calendar", now.toISOString());
  return { events: events.length };
}

async function fetchComposio(env, connectionId, tool, input) {
  if (!env.COMPOSIO_API_KEY) {
    throw new Error("COMPOSIO_API_KEY is not set");
  }
  if (!connectionId) {
    throw new Error(`Missing connectionId for tool ${tool}`);
  }

  const base = (env.COMPOSIO_API_BASE || "").replace(/\/$/, "");
  const path = env.COMPOSIO_EXECUTE_PATH || "/api/v3/tools/execute";
  const url = `${base}${buildComposioPath(path, tool)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.COMPOSIO_API_KEY}`,
      "x-api-key": env.COMPOSIO_API_KEY,
    },
    body: JSON.stringify({
      connected_account_id: connectionId,
      arguments: input,
    }),
  });

  const rawText = await res.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { raw: rawText };
  }
  if (!res.ok) {
    throw new Error(formatComposioError(data, res.status));
  }
  if (data?.successful === false) {
    throw new Error(formatComposioError(data, res.status) || "Composio tool failed");
  }
  return data?.data ?? data;
}

function buildComposioPath(path, tool) {
  if (!path) return `/api/v3/tools/execute/${tool}`;
  if (path.includes("{tool_slug}")) {
    return path.replace("{tool_slug}", tool);
  }
  if (path.includes("{tool}")) {
    return path.replace("{tool}", tool);
  }
  const normalized = path.endsWith("/") ? path.slice(0, -1) : path;
  if (normalized.endsWith("/tools/execute")) {
    return `${normalized}/${tool}`;
  }
  return normalized;
}

function formatComposioError(data, status) {
  const err =
    data?.error ||
    data?.message ||
    data?.detail ||
    data?.raw ||
    data;
  const errText =
    typeof err === "string" ? err : err ? JSON.stringify(err) : "";
  if (errText) return `Composio error ${status}: ${errText}`;
  return `Composio error ${status}`;
}

function normalizeInsightsToDaily(raw) {
  const payload = raw?.data || raw;
  const series = payload?.data || [];
  const byDate = new Map();

  for (const metric of series) {
    const name = metric?.name;
    const values = metric?.values || [];
    for (const entry of values) {
      const endTime = entry?.end_time || entry?.end_time?.date_time || entry?.end_time;
      const date = (endTime || "").slice(0, 10);
      if (!date) continue;
      const value = extractNumber(entry?.value);
      const current = byDate.get(date) || {};
      current[name] = value;
      byDate.set(date, current);
    }
  }

  return byDate;
}

function normalizeMediaInsights(raw) {
  const payload = raw?.data || raw;
  const items = payload?.data || [];
  const result = {};
  for (const item of items) {
    const name = item?.name;
    const values = item?.values || [];
    if (!name || !values.length) continue;
    result[name] = extractNumber(values[0]?.value);
  }
  return result;
}

function computeFollowersDeltaMonth(dates, dailyMap) {
  if (dates.length < 2) return null;
  const lastDate = dates[dates.length - 1];
  const thirtyDaysAgoIndex = Math.max(0, dates.length - 30);
  const firstDate = dates[thirtyDaysAgoIndex];
  const first = extractNumber(dailyMap.get(firstDate)?.follower_count);
  const last = extractNumber(dailyMap.get(lastDate)?.follower_count);
  if (first == null || last == null) return null;
  return last - first;
}

function extractNumber(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isNaN(num) ? null : num;
  }
  if (typeof value === "object") {
    if ("value" in value) return extractNumber(value.value);
  }
  return null;
}

function findHeaderIndex(headers, needle) {
  const lowered = needle.toLowerCase();
  return headers.findIndex((h) => String(h).toLowerCase().includes(lowered));
}

function parseContact(text) {
  const phoneMatch = text.match(/(\+?7|8)?\s*\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/);
  let phone = phoneMatch ? phoneMatch[0] : "";
  phone = phone.replace(/\s|\(|\)|-/g, "");
  if (phone.startsWith("8")) phone = `+7${phone.slice(1)}`;
  if (phone && !phone.startsWith("+")) phone = `+${phone}`;

  let parentName = text;
  if (phoneMatch) {
    parentName = text.replace(phoneMatch[0], "").trim();
  }

  return {
    phone: phone || null,
    parentName: parentName || null,
  };
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function getWeekRangeMsk(now) {
  const start = formatDateInTimeZone(now, "Europe/Moscow");
  const end = formatDateInTimeZone(
    new Date(now.getTime() + 7 * 86400000),
    "Europe/Moscow"
  );

  return {
    timeMin: `${start}T00:00:00+03:00`,
    timeMax: `${end}T23:59:59+03:00`,
  };
}

async function sha256(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
