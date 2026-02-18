const HTML_PAGE = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Панель мониторинга — Летние смены</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Rubik:wght@300;400;500;700&display=swap");
      :root{--bg:#0b0d14;--bg-2:#141826;--panel:#121522;--panel-2:#0f1420;--ink:#e9edf8;--muted:#aab2c8;--accent:#f2c94c;--accent-2:#5ad0ff;--accent-3:#ff7aa2;--success:#7cf2b5;--border:rgba(255,255,255,0.08);--shadow:0 20px 60px rgba(5,8,20,0.6);--glow:0 0 60px rgba(90,208,255,0.18)}
      *{box-sizing:border-box}html,body{height:100%}
      body{margin:0;font-family:"Rubik",system-ui,sans-serif;color:var(--ink);background:radial-gradient(1200px 800px at 10% -20%,#1a2741 0%,transparent 70%),radial-gradient(1000px 600px at 90% 0%,#2d1d3e 0%,transparent 70%),radial-gradient(900px 700px at 70% 100%,#133337 0%,transparent 70%),var(--bg);min-height:100vh}
      .noise{position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");pointer-events:none;mix-blend-mode:soft-light;z-index:0}
      .wrap{position:relative;z-index:1;max-width:1240px;margin:0 auto;padding:36px 28px 60px}
      header{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:32px;flex-wrap:wrap}
      .header-actions{display:flex;gap:12px;flex-wrap:wrap}
      .title{font-family:"Fraunces",serif;font-size:clamp(28px,3vw,42px);letter-spacing:.5px;margin:0 0 6px}
      .subtitle{color:var(--muted);font-size:14px;margin:0}
      .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:22px}
      .panel{background:linear-gradient(160deg,rgba(255,255,255,.02),rgba(255,255,255,.01));border:1px solid var(--border);border-radius:24px;padding:22px 24px;box-shadow:var(--shadow);position:relative;overflow:hidden}
      .panel::after{content:"";position:absolute;inset:0;background:radial-gradient(400px 200px at 0% 0%,rgba(90,208,255,.08),transparent 60%);pointer-events:none}
      .panel h3{margin:0 0 8px;font-size:18px;letter-spacing:.3px}.panel p{margin:0;color:var(--muted);font-size:13px}
      .panel.instagram{grid-column:span 4;background:linear-gradient(160deg,rgba(255,122,162,.12),rgba(18,21,34,.9))}
      .panel.bookings{grid-column:span 5;background:linear-gradient(160deg,rgba(124,242,181,.08),rgba(18,21,34,.9))}
      .panel.radio{grid-column:span 3;background:linear-gradient(160deg,rgba(242,201,76,.14),rgba(18,21,34,.9))}
      .panel.schedule{grid-column:span 12;display:grid;grid-template-columns:2.2fr 1fr;gap:20px;background:linear-gradient(160deg,rgba(90,208,255,.08),rgba(18,21,34,.9))}
      .metrics{margin-top:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
      .metric{padding:16px;border-radius:16px;border:1px solid var(--border);background:rgba(12,16,28,.75)}
      .metric .label{color:var(--muted);font-size:12px;letter-spacing:.2px}
      .metric .value{font-size:22px;font-weight:600;margin:6px 0}
      .metric .delta{font-size:12px;color:var(--success)}
      .spark{height:64px;margin-top:8px}.spark svg{width:100%;height:100%}
      .table{margin-top:18px;border-radius:16px;overflow:hidden;border:1px solid var(--border)}
      table{width:100%;border-collapse:collapse;font-size:13px}
      thead{background:rgba(15,20,32,.9);color:var(--muted);text-transform:uppercase;letter-spacing:.6px;font-size:11px}
      th,td{padding:12px 14px;border-bottom:1px solid var(--border);text-align:left}
      tbody tr:hover{background:rgba(255,255,255,.04)}
      .chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:rgba(0,0,0,.2);font-size:11px;color:var(--muted)}
      .cta{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;border:1px solid rgba(242,201,76,.5);background:rgba(242,201,76,.12);color:var(--accent);font-size:12px;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}
      .cta:hover{transform:translateY(-1px);box-shadow:0 10px 25px rgba(242,201,76,.25)}
      .radio-shell{margin-top:16px;border-radius:16px;border:1px solid var(--border);padding:12px;background:rgba(12,16,28,.75);min-height:160px;display:flex;align-items:center;justify-content:center}
      .RP-SCRIPT{width:100%;display:flex;align-items:center;justify-content:center;min-height:120px;border-radius:14px;border:1px dashed rgba(255,255,255,.12);background:linear-gradient(120deg,rgba(242,201,76,.1),rgba(90,208,255,.06))}
      .RP-LINK{text-decoration:none;display:inline-flex;align-items:center;gap:10px;padding:10px 16px;border-radius:12px;font-size:13px;color:var(--ink);background:rgba(15,20,32,.9);border:1px solid rgba(242,201,76,.4);box-shadow:0 12px 28px rgba(242,201,76,.2);transition:transform .2s ease,box-shadow .2s ease}
      .RP-LINK::before{content:"▶";font-size:12px;color:var(--accent)}.RP-LINK:hover{transform:translateY(-1px);box-shadow:0 16px 34px rgba(242,201,76,.28)}
      .radio-date{margin-top:22px;display:grid;gap:6px;text-align:center}
      .radio-date .num{font-family:"Rubik",system-ui,sans-serif;font-size:88px;letter-spacing:1px}
      .radio-date .month{text-transform:uppercase;letter-spacing:2px;font-size:16px;color:var(--muted)}
      .radio-date .weekday{font-size:18px;color:var(--ink)}
      .week{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:16px}
      .day{border-radius:16px;border:1px solid var(--border);padding:12px;min-height:112px;background:rgba(12,16,28,.7);display:flex;flex-direction:column;gap:8px}
      .day .name{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
      .day .plan{font-size:12px}
      .day.today{border-color:rgba(90,208,255,.6);background:rgba(90,208,255,.12);box-shadow:var(--glow)}
      .today-card{border-radius:20px;border:1px solid var(--border);padding:18px;background:rgba(12,16,28,.8);display:flex;flex-direction:column;gap:12px}
      .today-card h4{margin:0;font-size:16px}
      .today-list{display:grid;gap:10px;font-size:12px;color:var(--muted)}
      .footer-note{margin-top:28px;color:var(--muted);font-size:12px;text-align:right}
      @media(max-width:980px){header{flex-direction:column;align-items:flex-start}.panel.instagram,.panel.bookings,.panel.radio{grid-column:span 12}.panel.schedule{grid-template-columns:1fr}}
      @media(max-width:720px){.metrics{grid-template-columns:1fr}.week{grid-template-columns:repeat(2,1fr)}}
      .fade-in{opacity:0;transform:translateY(12px);animation:rise .9s ease forwards}
      .fade-in.delay-1{animation-delay:.15s}.fade-in.delay-2{animation-delay:.3s}.fade-in.delay-3{animation-delay:.45s}
      @keyframes rise{to{opacity:1;transform:translateY(0)}}
    </style>
  </head>
  <body>
    <div class="noise"></div>
    <div class="wrap">
      <header>
        <div>
          <h1 class="title">Летние смены · Центр управления</h1>
          <p class="subtitle">Единая панель для аналитики Instagram и бронирований лагеря</p>
        </div>
        <div class="header-actions">
          <button class="cta" id="refreshAllBtn" type="button">Обновить все данные</button>
        </div>
      </header>
      <section class="grid">
        <article class="panel instagram fade-in">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div><h3>Instagram аналитика</h3><p>Сводка по публикациям за 7 дней</p></div>
            <button class="cta" id="refreshInstagramBtn" type="button">Обновить</button>
          </div>
          <div class="metrics">
            <div class="metric"><div class="label">Показы</div><div class="value">—</div><div class="delta">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 52C18 44 30 20 44 22C58 24 66 46 80 44C94 42 110 18 124 18C138 18 150 36 156 30" stroke="#5AD0FF" stroke-width="3" stroke-linecap="round"/></svg></div></div>
            <div class="metric"><div class="label">Охват</div><div class="value">—</div><div class="delta">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 42C18 34 28 30 44 34C60 38 66 50 80 48C94 46 106 22 124 22C142 22 152 40 156 36" stroke="#F2C94C" stroke-width="3" stroke-linecap="round"/></svg></div></div>
            <div class="metric"><div class="label">Вовлечённость</div><div class="value">—</div><div class="delta">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 50C20 54 30 40 44 36C58 32 66 44 80 40C94 36 110 26 124 26C138 26 150 38 156 32" stroke="#FF7AA2" stroke-width="3" stroke-linecap="round"/></svg></div></div>
            <div class="metric"><div class="label">Сохранения</div><div class="value">—</div><div class="delta">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 48C18 40 28 24 44 24C60 24 66 42 80 40C94 38 110 26 124 26C138 26 150 34 156 28" stroke="#7CF2B5" stroke-width="3" stroke-linecap="round"/></svg></div></div>
          </div>
        </article>
        <article class="panel bookings fade-in delay-1">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div><h3>Бронирования смен</h3><p>Обновления из Google Sheets за сегодня</p></div>
            <span class="chip">Синхронизация: каждые 30 мин</span>
          </div>
          <div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:8px">
            <span class="chip">1 смена · 07.06–19.06</span><span class="chip">2 смена · 21.06–03.07</span>
            <span class="chip">3 смена · 05.07–17.07</span><span class="chip">4 смена · 19.07–31.07</span>
            <span class="chip">5 смена · 02.08–14.08</span><span class="chip">6 смена · 16.08–28.08</span>
          </div>
          <div class="table"><table>
            <thead><tr><th>Смена</th><th>ФИО ребёнка</th><th>Телефон</th><th>Родитель</th></tr></thead>
            <tbody><tr><td colspan="4" style="text-align:center;color:var(--muted)">Загрузка...</td></tr></tbody>
          </table></div>
        </article>
        <article class="panel radio fade-in delay-2">
          <div><h3>Радиоэфир</h3><p>Фоновая трансляция для рабочей атмосферы</p></div>
          <div class="radio-shell"><div class="RP-SCRIPT" data-style="dark"><a class="RP-LINK" href="https://radiopotok.ru/">RadioPotok.ru</a></div></div>
          <div class="radio-date" aria-label="Сегодняшняя дата">
            <div class="num" id="radioDay">—</div>
            <div class="month" id="radioMonth">—</div>
            <div class="weekday" id="radioWeekday">—</div>
          </div>
        </article>
        <article class="panel schedule fade-in delay-3">
          <div>
            <h3>Расписание недели</h3>
            <p>Фокус на активности, которые влияют на продажи и заполнение смен</p>
            <div class="week" id="weekGrid">
              <div class="day" data-day="1"><div class="name">Пн</div><div class="plan">Пост о программе смены</div><div class="chip">09:00 · Instagram</div></div>
              <div class="day" data-day="2"><div class="name">Вт</div><div class="plan">Обновить список мест</div><div class="chip">12:00 · Google Sheets</div></div>
              <div class="day" data-day="3"><div class="name">Ср</div><div class="plan">Сторис с отзывами</div><div class="chip">18:00 · Instagram</div></div>
              <div class="day" data-day="4"><div class="name">Чт</div><div class="plan">Звонки родителям</div><div class="chip">16:00 · Отдел заботы</div></div>
              <div class="day" data-day="5"><div class="name">Пт</div><div class="plan">Промо-пост о скидке</div><div class="chip">10:00 · Instagram</div></div>
              <div class="day" data-day="6"><div class="name">Сб</div><div class="plan">Подготовить рассылку</div><div class="chip">14:00 · Email</div></div>
              <div class="day" data-day="0"><div class="name">Вс</div><div class="plan">Статус по бронированиям</div><div class="chip">19:00 · Команда</div></div>
            </div>
          </div>
          <div class="today-card">
            <h4>Сегодня</h4>
            <div class="today-list"><div>Загрузка событий...</div></div>
            <button class="cta" type="button">Отметить задачи</button>
          </div>
        </article>
      </section>
      <div class="footer-note">Данные обновлены: <span id="updatedAt">—</span></div>
    </div>
    <script defer src="https://radiopotok.ru/f/script6/16e18ac98844452e0eba34f615bdeaad8ba8a53a7e59e232de17502a17cd57d3.js" charset="UTF-8"></script>
    <script>
      const apiBase = "";
      const authHeader = window.DASHBOARD_AUTH || "";
      const locale = "ru-RU";
      const radioDay = document.getElementById("radioDay");
      const radioMonth = document.getElementById("radioMonth");
      const radioWeekday = document.getElementById("radioWeekday");
      const updatedAt = document.getElementById("updatedAt");
      const weekGrid = document.getElementById("weekGrid");

      const now = new Date();
      radioDay.textContent = now.toLocaleDateString(locale,{day:"numeric"});
      radioMonth.textContent = now.toLocaleDateString(locale,{month:"long"});
      radioWeekday.textContent = now.toLocaleDateString(locale,{weekday:"long"});
      updatedAt.textContent = now.toLocaleString(locale,{dateStyle:"short",timeStyle:"short"});

      const currentDay = now.getDay().toString();
      weekGrid.querySelectorAll(".day").forEach(n=>{if(n.dataset.day===currentDay)n.classList.add("today")});

      async function callApi(path,options={}){
        const res=await fetch(apiBase+path,{method:"POST",headers:{"Content-Type":"application/json",...(authHeader?{Authorization:authHeader}:{}),...(options.headers||{})}, ...options});
        if(!res.ok)throw new Error("API "+path+" → "+res.status);
        return res.json();
      }
      async function getDashboard(){
        const res=await fetch(apiBase+"/api/dashboard",{headers:{"Content-Type":"application/json",...(authHeader?{Authorization:authHeader}:{})}});
        if(!res.ok)throw new Error("GET /api/dashboard → "+res.status);
        return res.json();
      }
      function formatNumber(n){if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1000)return(n/1000).toFixed(1)+"K";return String(n)}
      function escapeHtml(str){return String(str||"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]))}

      function renderInstagramMetrics(data){
        const ig=data.instagram;
        const metrics=document.querySelectorAll(".panel.instagram .metric");
        const last=ig.userMetrics?.[ig.userMetrics.length-1];
        if(!last){
          metrics.forEach(m=>{m.querySelector(".value").textContent="—";m.querySelector(".delta").textContent="Нет данных";});
          return;
        }
        const reach=last?.reach??null;
        const interactions=last?.total_interactions??null;
        const saves=last?.saves??null;
        const followers=last?.followers_total??ig.followers_total??null;
        const engagement=(interactions&&followers)?((interactions/followers)*100).toFixed(1):null;
        metrics[0].querySelector(".value").textContent=reach!=null?formatNumber(reach):"—";
        metrics[0].querySelector(".delta").textContent="охват за день";
        metrics[1].querySelector(".value").textContent=interactions!=null?formatNumber(interactions):"—";
        metrics[1].querySelector(".delta").textContent="взаимодействия";
        metrics[2].querySelector(".value").textContent=engagement!=null?(engagement+"%"):"—";
        metrics[2].querySelector(".delta").textContent=followers!=null?("подписчиков: "+formatNumber(followers)):"";
        metrics[3].querySelector(".value").textContent=saves!=null?formatNumber(saves):"—";
        metrics[3].querySelector(".delta").textContent="сохранения";
      }
      function renderBookingsTable(bookings){
        const tbody=document.querySelector(".panel.bookings tbody");
        if(!tbody)return;
        tbody.innerHTML="";
        if(!bookings||!bookings.length){tbody.innerHTML='<tr><td colspan="4" style="text-align:center;color:var(--muted)">Нет данных</td></tr>';return}
        bookings.slice(0,20).forEach(row=>{
          const tr=document.createElement("tr");
          tr.innerHTML='<td>'+escapeHtml(row.sheet_name||"—")+'</td><td>'+escapeHtml(row.fio||"—")+'</td><td>'+escapeHtml(row.phone||"—")+'</td><td>'+escapeHtml(row.parent_name||"—")+'</td>';
          tbody.appendChild(tr);
        });
      }
      function renderCalendarEvents(events){
        weekGrid.querySelectorAll(".event").forEach(el=>el.remove());
        const todayList=document.querySelector(".panel.schedule .today-card .today-list");
        if(todayList)todayList.innerHTML="";
        if(!events||!events.length){if(todayList)todayList.innerHTML='<div style="color:var(--muted)">Нет событий на неделю</div>';return}
        const todayDow=new Date().getDay();
        events.forEach(ev=>{
          const startDate=ev.start_time?new Date(ev.start_time):null;
          const timeStr=startDate?startDate.toLocaleString(locale,{hour:"2-digit",minute:"2-digit"}):"—";
          if(startDate){
            const dow=startDate.getDay().toString();
            const targetDay=weekGrid.querySelector('.day[data-day="'+dow+'"]');
            if(targetDay){const el=document.createElement("div");el.className="event chip";el.style.cssText="font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%";el.title=timeStr+" · "+(ev.summary||"");el.textContent=timeStr+" · "+(ev.summary||"—");targetDay.appendChild(el)}
          }
          if(todayList&&startDate&&startDate.getDay()===todayDow){const d=document.createElement("div");d.textContent=timeStr+" · "+(ev.summary||"—");todayList.appendChild(d)}
        });
        if(todayList&&!todayList.children.length)todayList.innerHTML='<div style="color:var(--muted)">Нет событий на сегодня</div>';
      }
      async function loadDashboard(){
        try{
          const data=await getDashboard();
          renderInstagramMetrics(data);
          renderBookingsTable(data.bookings);
          renderCalendarEvents(data.calendar);
          updatedAt.textContent=new Date().toLocaleString(locale,{dateStyle:"short",timeStyle:"short"});
        }catch(err){console.error("Ошибка загрузки:",err);updatedAt.textContent="Ошибка загрузки"}
      }
      document.getElementById("refreshAllBtn")?.addEventListener("click",async()=>{
        const btn=document.getElementById("refreshAllBtn");btn.disabled=true;
        try{await callApi("/api/refresh-all");await loadDashboard()}catch(e){console.error(e)}finally{btn.disabled=false}
      });
      document.getElementById("refreshInstagramBtn")?.addEventListener("click",async()=>{
        const btn=document.getElementById("refreshInstagramBtn");btn.disabled=true;
        try{await callApi("/api/instagram/refresh");await loadDashboard()}catch(e){console.error(e)}finally{btn.disabled=false}
      });
      loadDashboard();
    </script>
  </body>
</html>`;

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

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Отдаём index.html для корневого пути — без авторизации
      if (request.method === "GET" && (path === "/" || path === "" || path === "/index.html")) {
        return new Response(HTML_PAGE, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // GET /api/dashboard — публичный, без авторизации (для Vercel фронтенда)
      if (request.method === "GET" && path === "/api/dashboard") {
        const data = await getDashboard(env);
        return jsonResponse(data);
      }

      // GET /api/debug — диагностика конфигурации + тест Composio
      if (request.method === "GET" && path === "/api/debug") {
        // Тест подключения к Composio (Calendar — самый простой)
        let composioTest = null;
        try {
          const testRes = await fetchComposio(
            env,
            env.COMPOSIO_CONN_CALENDAR,
            "GOOGLECALENDAR_EVENTS_LIST",
            {
              calendarId: env.CALENDAR_ID || "primary",
              timeMin: new Date().toISOString(),
              timeMax: new Date(Date.now() + 86400000).toISOString(),
              singleEvents: true,
              maxResults: 1,
            }
          );
          composioTest = { ok: true, items: (testRes?.items || testRes?.data?.items || []).length };
        } catch (e) {
          composioTest = { ok: false, error: e.message };
        }

        // Тест Sheets — первые 10 строк первого листа
        let sheetsTest = null;
        try {
          const namesRes = await fetchComposio(
            env,
            env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
            "GOOGLESHEETS_GET_SHEET_NAMES",
            { spreadsheet_id: env.SHEETS_ID }
          );
          const sheetNames = namesRes?.sheet_names || namesRes?.data?.sheet_names || [];
          let sample = null;
          if (sheetNames.length > 0) {
            const valRes = await fetchComposio(
              env,
              env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
              "GOOGLESHEETS_BATCH_GET",
              { spreadsheet_id: env.SHEETS_ID, ranges: [`${sheetNames[0]}!A1:Z10`] }
            );
            const rows = valRes?.valueRanges?.[0]?.values || valRes?.data?.valueRanges?.[0]?.values || [];
            sample = { sheet: sheetNames[0], rows };
          }
          sheetsTest = { ok: true, sheet_names: sheetNames, sample };
        } catch (e) {
          sheetsTest = { ok: false, error: e.message };
        }

        // Тест Calendar — расширенный диапазон
        let calendarFull = null;
        try {
          const { timeMin, timeMax } = getWeekRangeMsk(new Date());
          const calRes = await fetchComposio(
            env,
            env.COMPOSIO_CONN_CALENDAR,
            "GOOGLECALENDAR_EVENTS_LIST",
            { calendarId: env.CALENDAR_ID || "primary", timeMin, timeMax, singleEvents: true, maxResults: 5 }
          );
          calendarFull = { ok: true, timeMin, timeMax, raw_keys: Object.keys(calRes || {}), items: (calRes?.items || calRes?.data?.items || []).slice(0,3) };
        } catch (e) {
          calendarFull = { ok: false, error: e.message };
        }

        return jsonResponse({
          has_composio_key: !!env.COMPOSIO_API_KEY,
          has_conn_ig: !!env.COMPOSIO_CONN_IG,
          has_conn_sheets: !!env.COMPOSIO_CONN_SHEETS,
          has_conn_calendar: !!env.COMPOSIO_CONN_CALENDAR,
          has_sheets_id: !!env.SHEETS_ID,
          has_ig_user_id: !!env.IG_USER_ID,
          composio_base: env.COMPOSIO_API_BASE || null,
          composio_path: env.COMPOSIO_EXECUTE_PATH || null,
          calendar_test: composioTest,
          calendar_full: calendarFull,
          sheets_test: sheetsTest,
        });
      }

      // GET /api/debug-ig — диагностика Instagram
      if (request.method === "GET" && path === "/api/debug-ig") {
        const now = new Date();
        const since_str = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
        const until_str = now.toISOString().split('T')[0];

        let insightsRaw = null;
        try {
          const res = await fetchComposio(
            env,
            env.COMPOSIO_CONN_IG,
            "INSTAGRAM_GET_USER_INSIGHTS",
            {
              ig_user_id: env.IG_USER_ID,
              metric: ["reach", "total_interactions", "saves", "follower_count"],
              period: "day",
              since: since_str,
              until: until_str,
            }
          );
          // Показываем сырой ответ (первые 2 элемента)
          const payload = res?.data || res;
          const series = payload?.data || [];
          insightsRaw = {
            ok: true,
            top_keys: Object.keys(res || {}),
            payload_keys: Object.keys(payload || {}),
            series_count: series.length,
            first_metric: series[0] ? { name: series[0].name, values_count: (series[0].values||[]).length, first_value: series[0].values?.[0] } : null,
          };
        } catch (e) {
          insightsRaw = { ok: false, error: e.message };
        }

        let userInfoRaw = null;
        try {
          const res = await fetchComposio(
            env,
            env.COMPOSIO_CONN_IG,
            "INSTAGRAM_GET_USER_INFO",
            { ig_user_id: env.IG_USER_ID }
          );
          userInfoRaw = { ok: true, keys: Object.keys(res || {}), followers_count: res?.followers_count, data: res?.data ? Object.keys(res.data) : null };
        } catch (e) {
          userInfoRaw = { ok: false, error: e.message };
        }

        // Проверим что в D1
        const dbRows = await env.DB.prepare("SELECT COUNT(*) as cnt FROM instagram_user_metrics").all();
        const dbSample = await env.DB.prepare("SELECT * FROM instagram_user_metrics ORDER BY date DESC LIMIT 3").all();

        return jsonResponse({
          since: since_str,
          until: until_str,
          insights: insightsRaw,
          user_info: userInfoRaw,
          db_count: dbRows.results?.[0]?.cnt,
          db_sample: dbSample.results,
        });
      }

      // POST эндпоинты — публичные (внутренний дашборд)
      if (request.method === "POST") {
        if (path === "/api/instagram/refresh") {
          const result = await syncInstagram(env);
          return jsonResponse({ ok: true, result });
        }

        if (path === "/api/bookings/refresh") {
          const result = await syncSheets(env);
          return jsonResponse({ ok: true, result });
        }

        if (path === "/api/calendar/refresh") {
          const result = await syncCalendar(env, true);
          return jsonResponse({ ok: true, result });
        }

        if (path === "/api/refresh-all") {
          const result = await refreshAll(env);
          return jsonResponse({ ok: true, result });
        }
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

  // Новые записи за последние 48 часов, отсортированные по дате добавления (новые снизу)
  const twoDaysAgo = new Date(now.getTime() - 48 * 3600000).toISOString().slice(0, 19);
  const bookings = await env.DB.prepare(
    "SELECT * FROM bookings_raw WHERE updated_at >= ? ORDER BY updated_at ASC LIMIT 50"
  ).bind(twoDaysAgo).all();

  // Исправлено: показываем события от сегодня вперёд, а не 7 дней назад
  const calendar = await env.DB.prepare(
    "SELECT * FROM calendar_events WHERE start_time >= ? ORDER BY start_time ASC"
  )
    .bind(today)
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
  // Запрашиваем только последние 30 дней (Instagram API ограничивает диапазон)
  const sinceDate = new Date(now.getTime() - 30 * 86400000);
  
  const since_str = sinceDate.toISOString().split('T')[0];
  const until_str = now.toISOString().split('T')[0];

  const dailyInsights = await fetchComposio(
    env,
    env.COMPOSIO_CONN_IG,
    "INSTAGRAM_GET_USER_INSIGHTS",
    {
      ig_user_id: env.IG_USER_ID,
      metric: ["reach", "total_interactions", "saves", "follower_count"],
      period: "day",
      since: since_str,
      until: until_str,
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

  // Get media posts from last 90 days
  const mediaSinceDate = new Date(now.getTime() - 90 * 86400000);
  const since_unix = parseInt(Math.floor(mediaSinceDate.getTime() / 1000));
  const until_unix = parseInt(Math.floor(now.getTime() / 1000));
  
  const media = await fetchComposio(
    env,
    env.COMPOSIO_CONN_IG,
    "INSTAGRAM_GET_USER_MEDIA",
    {
      since: since_unix,
      until: until_unix,
      fields: "id,timestamp,media_type",
    }
  );

  const mediaItems = media?.data || media?.items || [];

  for (const item of mediaItems) {
    if (!item?.id) continue;
    
    const postInsights = await fetchComposio(
      env,
      env.COMPOSIO_CONN_IG,
      "INSTAGRAM_GET_POST_INSIGHTS",
      {
        ig_post_id: item.id,
        metric: ["reach", "likes", "comments", "saved", "shares"],
      }
    );

    const insightMap = normalizeMediaInsights(postInsights);
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
      "GOOGLESHEETS_BATCH_GET",
      {
        spreadsheet_id: env.SHEETS_ID,
        ranges: [range],
      }
    );

    const values = valuesResponse?.data?.valueRanges?.[0]?.values || 
                   valuesResponse?.valueRanges?.[0]?.values || 
                   valuesResponse?.values || [];
    if (!values.length) continue;

    // Структура таблицы фиксированная:
    // Колонка B (индекс 1) = ФИО ребёнка
    // Колонка H (индекс 7) = КОНТАКТ (имя родителя + телефон)
    // Данные начинаются с первой строки где колонка A содержит число (порядковый номер)
    const FIO_COL = 1;      // колонка B
    const CONTACT_COL = 7;  // колонка H

    // Найдём первую строку с данными (колонка A = число)
    let dataStartRow = 8; // по умолчанию строка 9 (индекс 8)
    for (let r = 0; r < Math.min(20, values.length); r++) {
      const cellA = String(values[r]?.[0] || "").trim();
      if (/^\d+$/.test(cellA)) {
        dataStartRow = r;
        break;
      }
    }

    for (let i = dataStartRow; i < values.length; i += 1) {
      const row = values[i];
      if (!row || (!row[FIO_COL] && !row[CONTACT_COL])) continue;

      const fio = String(row[FIO_COL] || "").trim();
      const contactRaw = String(row[CONTACT_COL] || "").trim();
      if (!fio && !contactRaw) continue;

      const { phone, parentName } = parseContact(contactRaw);
      const hash = await sha256(`${sheetName}|${i + 1}|${fio}|${contactRaw}`);

      const result = await env.DB.prepare(
        `INSERT INTO bookings_raw (sheet_name, row_index, fio, contact_raw, phone, parent_name, hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(hash) DO UPDATE SET
           fio=excluded.fio,
           contact_raw=excluded.contact_raw,
           phone=excluded.phone,
           parent_name=excluded.parent_name,
           updated_at=datetime('now')`
      )
        .bind(sheetName, i + 1, fio, contactRaw, phone, parentName, hash)
        .run();

      if (result.meta?.changes > 0) inserted += 1;
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
       VALUES (?, ?, ?, ?)
       ON CONFLICT(event_id) DO UPDATE SET
         summary=excluded.summary,
         start_time=excluded.start_time,
         end_time=excluded.end_time,
         updated_at=datetime('now')`
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
      entity_id: env.COMPOSIO_ENTITY_ID || "default",
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
  // Composio возвращает: { data: [{ name, values: [{value, end_time}] }, ...], paging: {...} }
  // raw после fetchComposio (который делает data?.data ?? data) может быть:
  // - массивом метрик напрямую (если fetchComposio вернул data.data)
  // - объектом { data: [...], paging: {...} }
  let series = [];
  
  if (Array.isArray(raw)) {
    // raw — уже массив метрик
    series = raw;
  } else if (Array.isArray(raw?.data)) {
    // raw.data — массив метрик
    series = raw.data;
  } else if (raw?.data && Array.isArray(raw.data?.data)) {
    // вложенный data.data
    series = raw.data.data;
  }

  const byDate = new Map();

  for (const metric of series) {
    const name = metric?.name;
    const values = metric?.values || [];
    for (const entry of values) {
      const endTime = entry?.end_time;
      const date = typeof endTime === "string" ? endTime.slice(0, 10) : "";
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
    new Date(now.getTime() + 30 * 86400000),
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
