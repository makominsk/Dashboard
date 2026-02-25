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
      .panel.analytics{grid-column:span 7;background:linear-gradient(160deg,rgba(90,208,255,.06),rgba(18,21,34,.9))}
      .panel.trends{grid-column:span 5;background:linear-gradient(160deg,rgba(242,201,76,.12),rgba(18,21,34,.9))}
      .insight-grid{margin-top:14px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
      .insight-card{padding:14px;border-radius:14px;border:1px solid var(--border);background:rgba(12,16,28,.7);display:grid;gap:6px}
      .insight-title{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
      .insight-value{font-size:16px;font-weight:600}
      .insight-sub{font-size:12px;color:var(--muted)}
      .analytics-insights{margin-top:14px;display:grid;gap:12px}
      .analytics-insight{padding:12px;border-radius:14px;border:1px solid var(--border);background:rgba(12,16,28,.7);display:grid;gap:8px}
      .analytics-insight h4{margin:0;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
      .analytics-insight p{margin:0;font-size:12px;line-height:1.45;color:var(--ink)}
      .trend-list{margin-top:14px;display:grid;gap:10px;max-height:260px;overflow:auto}
      .trend-sections{margin-top:14px;display:grid;gap:12px}
      .trend-section{padding:12px;border-radius:14px;border:1px solid var(--border);background:rgba(12,16,28,.7);display:grid;gap:8px}
      .trend-section h4{margin:0;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
      .trend-text{font-size:12px;line-height:1.45;color:var(--ink)}
      .trend-reco-list{display:grid;gap:8px;font-size:12px;color:var(--muted)}
      .trend-sources{display:grid;gap:8px;max-height:220px;overflow:auto}
      .trend-item{padding:12px;border-radius:12px;border:1px solid var(--border);background:rgba(12,16,28,.65);display:grid;gap:6px;font-size:12px}
      .trend-title{font-weight:600;font-size:13px}
      .trend-meta{color:var(--muted);font-size:11px}
      .trend-summary{margin-top:12px;padding:12px;border-radius:12px;border:1px dashed rgba(242,201,76,.5);background:rgba(242,201,76,.08);font-size:12px;color:var(--muted);line-height:1.4}
      .trend-reco{margin-top:10px;display:grid;gap:8px;font-size:12px;color:var(--muted)}
      .data-note{margin-top:12px;font-size:11px;color:var(--muted)}
      .modal-backdrop{position:fixed;inset:0;background:rgba(5,8,20,.7);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;z-index:20;padding:24px}
      .modal-backdrop.active{display:flex}
      .modal{width:min(880px,100%);background:linear-gradient(160deg,rgba(18,21,34,.98),rgba(10,12,20,.98));border:1px solid rgba(255,255,255,.12);border-radius:22px;box-shadow:0 30px 80px rgba(5,8,20,.7);padding:22px 24px;display:grid;gap:16px;position:relative}
      .modal-header{display:flex;justify-content:space-between;align-items:center;gap:16px}
      .modal-header h3{margin:0;font-size:18px}
      .modal-header p{margin:4px 0 0;font-size:12px;color:var(--muted)}
      .modal-close{border:1px solid rgba(90,208,255,.4);background:rgba(90,208,255,.12);color:var(--accent-2);border-radius:10px;padding:6px 12px;font-size:12px;cursor:pointer}
      .modal-body{display:grid;gap:12px}
      .modal-section{padding:12px;border-radius:14px;border:1px solid var(--border);background:rgba(12,16,28,.7);display:grid;gap:8px}
      .modal-label{font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--muted)}
      .modal-text{font-size:13px;line-height:1.5}
      .modal-list{display:grid;gap:8px;font-size:12px;color:var(--muted)}
      .metrics{margin-top:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
      .metric{padding:16px;border-radius:16px;border:1px solid var(--border);background:rgba(12,16,28,.75)}
      .metric .label{color:var(--muted);font-size:12px;letter-spacing:.2px}
      .metric .value{font-size:22px;font-weight:600;margin:6px 0}
      .metric .delta{font-size:12px;color:var(--success)}
      .ig-details{margin-top:16px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
      .ig-item{padding:12px;border-radius:14px;border:1px solid var(--border);background:rgba(12,16,28,.6)}
      .ig-key{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.3px}
      .ig-val{font-size:16px;font-weight:600;margin-top:4px}
      .ig-sub{font-size:11px;color:var(--muted);margin-top:2px}
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
      @media(max-width:980px){header{flex-direction:column;align-items:flex-start}.panel.instagram,.panel.bookings,.panel.analytics,.panel.trends,.panel.radio{grid-column:span 12}.panel.schedule{grid-template-columns:1fr}}
      @media(max-width:720px){.metrics{grid-template-columns:1fr}.ig-details{grid-template-columns:1fr}.week{grid-template-columns:repeat(2,1fr)}}
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
          <button class="cta" id="openInsightsBtn" type="button">Итоги и рекомендации</button>
        </div>
      </header>
      <section class="grid">
        <article class="panel instagram fade-in">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div><h3>Instagram аналитика</h3><p>Статистика за 3 месяца</p></div>
            <button class="cta" id="refreshInstagramBtn" type="button">Обновить</button>
          </div>
          <div class="metrics">
            <div class="metric"><div class="label">Охват</div><div class="value">—</div><div class="delta">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 52C18 44 30 20 44 22C58 24 66 46 80 44C94 42 110 18 124 18C138 18 150 36 156 30" stroke="#5AD0FF" stroke-width="3" stroke-linecap="round"/></svg></div></div>
            <div class="metric"><div class="label">Взаимодействия</div><div class="value">—</div><div class="delta">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 42C18 34 28 30 44 34C60 38 66 50 80 48C94 46 106 22 124 22C142 22 152 40 156 36" stroke="#F2C94C" stroke-width="3" stroke-linecap="round"/></svg></div></div>
            <div class="metric"><div class="label">Мест всего</div><div class="value" id="seatsTotal">—</div><div class="delta" id="seatsLeft">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 50C20 54 30 40 44 36C58 32 66 44 80 40C94 36 110 26 124 26C138 18 150 38 156 32" stroke="#FF7AA2" stroke-width="3" stroke-linecap="round"/></svg></div></div>
            <div class="metric"><div class="label">Забронировано</div><div class="value" id="bookedTotal">—</div><div class="delta" id="prepaidTotal">—</div><div class="spark"><svg viewBox="0 0 160 64" fill="none"><path d="M4 48C18 40 28 24 44 24C60 24 66 42 80 40C94 38 110 26 124 26C138 18 150 34 156 28" stroke="#7CF2B5" stroke-width="3" stroke-linecap="round"/></svg></div></div>
          </div>
          <div class="ig-details">
            <div class="ig-item"><div class="ig-key">Подписчики</div><div class="ig-val" id="igFollowers">—</div><div class="ig-sub" id="igFollowersDelta">—</div></div>
            <div class="ig-item"><div class="ig-key">Постов (3м)</div><div class="ig-val" id="igPostsCount">—</div><div class="ig-sub" id="igAvgReach">—</div></div>
            <div class="ig-item"><div class="ig-key">Лайки (3м)</div><div class="ig-val" id="igLikesTotal">—</div><div class="ig-sub" id="igLikesAvg">—</div></div>
            <div class="ig-item"><div class="ig-key">Комментарии (3м)</div><div class="ig-val" id="igCommentsTotal">—</div><div class="ig-sub" id="igCommentsAvg">—</div></div>
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
        <article class="panel analytics fade-in delay-2">
          <div><h3>Аналитика спроса</h3><p>Лучшие дни недели и темп заполнения мест</p></div>
          <div class="insight-grid">
            <div class="insight-card"><div class="insight-title">Лучшие дни IG</div><div class="insight-value" id="bestDaysIg">—</div><div class="insight-sub" id="bestDaysIgMeta">—</div></div>
            <div class="insight-card"><div class="insight-title">Лучшие дни брони</div><div class="insight-value" id="bestDaysBookings">—</div><div class="insight-sub" id="bestDaysBookingsMeta">—</div></div>
            <div class="insight-card"><div class="insight-title">Темп заполнения</div><div class="insight-value" id="bookingsPace">—</div><div class="insight-sub" id="bookingsForecast">—</div></div>
            <div class="insight-card"><div class="insight-title">Итоги года</div><div class="insight-value" id="yearSummary">—</div><div class="insight-sub" id="yearSummaryMeta">—</div></div>
          </div>
          <div class="analytics-insights">
            <div class="analytics-insight"><h4>Summary</h4><p id="analyticsSummary">—</p></div>
            <div class="analytics-insight"><h4>Выводы</h4><p id="analyticsConclusion">—</p></div>
          </div>
          <div class="data-note" id="analyticsNote">Данные готовятся…</div>
        </article>
        <article class="panel trends fade-in delay-3">
          <div><h3>AI‑тенденции в продажах</h3><p>Мониторинг мировых источников и рекомендации</p></div>
          <div class="trend-sections">
            <div class="trend-section"><h4>Рекомендации</h4><div class="trend-reco-list" id="trendRecommendations"></div></div>
            <div class="trend-section"><h4>Источники</h4><div class="trend-sources" id="trendSources"></div></div>
          </div>
          <div class="data-note" id="trendUpdated">—</div>
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
      <div class="modal-backdrop" id="insightsModal" aria-hidden="true">
        <div class="modal">
          <div class="modal-header">
            <div><h3>Краткое summary и вывод</h3><p id="insightsUpdated">—</p></div>
            <button class="modal-close" id="closeInsightsBtn" type="button">Закрыть</button>
          </div>
          <div class="modal-body">
            <div class="modal-section"><div class="modal-label">Краткое summary</div><div class="modal-text" id="insightsSummary">—</div></div>
            <div class="modal-section"><div class="modal-label">Вывод</div><div class="modal-text" id="insightsConclusion">—</div></div>
            <div class="modal-section"><div class="modal-label">Рекомендации</div><div class="modal-list" id="insightsRecommendations"></div></div>
            <div class="modal-section"><div class="modal-label">Обновление</div><div class="modal-text" id="insightsSchedule">—</div></div>
          </div>
        </div>
      </div>
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
      async function getAnalytics(){
        const res=await fetch(apiBase+"/api/analytics",{headers:{"Content-Type":"application/json",...(authHeader?{Authorization:authHeader}:{})}});
        if(!res.ok)throw new Error("GET /api/analytics → "+res.status);
        return res.json();
      }
      async function getTrends(){
        const res=await fetch(apiBase+"/api/trends",{headers:{"Content-Type":"application/json",...(authHeader?{Authorization:authHeader}:{})}});
        if(!res.ok)throw new Error("GET /api/trends → "+res.status);
        return res.json();
      }
      async function getInsights(){
        const res=await fetch(apiBase+"/api/insights",{headers:{"Content-Type":"application/json",...(authHeader?{Authorization:authHeader}:{})}});
        if(!res.ok)throw new Error("GET /api/insights → "+res.status);
        return res.json();
      }
      function formatNumber(n){if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1000)return(n/1000).toFixed(1)+"K";return String(n)}
      function escapeHtml(str){return String(str||"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]))}

      function renderInstagramMetrics(data){
        const ig = data.instagram;
        const metrics = document.querySelectorAll(".panel.instagram .metric");
        const monthSummary = ig?.monthSummary;
        const postSummary = ig?.postSummary || {};
        const summary = ig?.summary || {};
        const followers = summary?.followers_total ?? ig?.followers_total ?? null;
        const followersDelta = summary?.followers_delta_month ?? null;

        const totalReach = summary?.total_reach ?? monthSummary?.total_reach ?? postSummary?.total_reach ?? null;
        const totalInteractions = summary?.total_interactions ?? monthSummary?.total_interactions ?? postSummary?.total_interactions ?? null;

        // Охват
        metrics[0].querySelector(".value").textContent = totalReach != null ? formatNumber(totalReach) : "—";
        metrics[0].querySelector(".delta").textContent = monthSummary?.days_count ? "за " + monthSummary.days_count + " дней" : "за 3 месяца";

        // Взаимодействия
        metrics[1].querySelector(".value").textContent = totalInteractions != null ? formatNumber(totalInteractions) : "—";
        metrics[1].querySelector(".delta").textContent = "за 3 месяца";

        const seats = data.bookingsSummary || {};

        // Места
        metrics[2].querySelector(".value").textContent = seats.total != null ? String(seats.total) : "—";
        metrics[2].querySelector(".delta").textContent = seats.left != null ? "осталось: " + seats.left : "осталось: —";

        // Бронирования
        metrics[3].querySelector(".value").textContent = seats.booked != null ? String(seats.booked) : "—";
        metrics[3].querySelector(".delta").textContent = seats.prepaid != null ? "предоплата: " + seats.prepaid : "предоплата: —";

        const setText = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };

        setText("igFollowers", followers != null ? formatNumber(followers) : "—");
        setText(
          "igFollowersDelta",
          followersDelta != null
            ? "Δ3м: " + (followersDelta >= 0 ? "+" : "") + formatNumber(followersDelta)
            : "Δ3м: —"
        );
        setText("igPostsCount", summary?.posts_count != null ? formatNumber(summary.posts_count) : "—");
        setText(
          "igAvgReach",
          summary?.avg_reach != null
            ? "ср. охват: " +
                formatNumber(summary.avg_reach) +
                (postSummary?.best_reach != null ? " · пик: " + formatNumber(postSummary.best_reach) : "")
            : "ср. охват: —"
        );

        setText("igLikesTotal", postSummary?.total_likes != null ? formatNumber(postSummary.total_likes) : "—");
        setText(
          "igLikesAvg",
          postSummary?.avg_likes != null
            ? "средние лайки: " + formatNumber(postSummary.avg_likes)
            : "средние лайки: —"
        );

        setText("igCommentsTotal", postSummary?.total_comments != null ? formatNumber(postSummary.total_comments) : "—");
        setText(
          "igCommentsAvg",
          postSummary?.avg_comments != null
            ? "средние комментарии: " + formatNumber(postSummary.avg_comments)
            : "средние комментарии: —"
        );

        setText("seatsTotal", seats.total != null ? String(seats.total) : "—");
        setText("seatsLeft", seats.left != null ? "осталось: " + seats.left : "осталось: —");
        setText("bookedTotal", seats.booked != null ? String(seats.booked) : "—");
        setText("prepaidTotal", seats.prepaid != null ? "предоплата: " + seats.prepaid : "предоплата: —");
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
      function renderAnalytics(data){
        const bestIg=document.getElementById("bestDaysIg");
        const bestIgMeta=document.getElementById("bestDaysIgMeta");
        const bestBookings=document.getElementById("bestDaysBookings");
        const bestBookingsMeta=document.getElementById("bestDaysBookingsMeta");
        const bookingsPace=document.getElementById("bookingsPace");
        const bookingsForecast=document.getElementById("bookingsForecast");
        const yearSummary=document.getElementById("yearSummary");
        const yearSummaryMeta=document.getElementById("yearSummaryMeta");
        const note=document.getElementById("analyticsNote");

        const bestIgDays=data?.best_days?.instagram||[];
        const bestBookingDays=data?.best_days?.bookings||[];
        const pace=data?.bookings_pace||{};
        const year=data?.year_overview||{};

        bestIg.textContent=bestIgDays.map(d=>d.label).join(", ")||"—";
        bestIgMeta.textContent=data?.ig_note||"Оценка на основе дневных метрик";
        bestBookings.textContent=bestBookingDays.map(d=>d.label).join(", ")||"—";
        bestBookingsMeta.textContent=data?.bookings_note||"По времени синхронизации";
        bookingsPace.textContent=pace.avg_per_day!=null?pace.avg_per_day+" броней/день":"—";
        bookingsForecast.textContent=pace.days_to_fill!=null?"до заполнения: ~"+pace.days_to_fill+" дн.":"прогноз недоступен";
        yearSummary.textContent=year.booked_total!=null?year.booked_total+" броней":"—";
        yearSummaryMeta.textContent=year.prepaid_rate!=null?"предоплата: "+year.prepaid_rate+"%":"предоплата: —";
        note.textContent=data?.data_quality_note||"Данные обновлены";
      }
      function renderTrends(trends,insights){
        const sources=document.getElementById("trendSources");
        const recos=document.getElementById("trendRecommendations");
        const updated=document.getElementById("trendUpdated");

        updated.textContent=trends?.updated_at?"обновлено: "+new Date(trends.updated_at).toLocaleString(locale):"обновлено: —";

        recos.innerHTML="";
        const recommendations=insights?.recommendations||trends?.recommendations||[];
        if(!recommendations.length){recos.innerHTML="<div>—</div>";}
        else{recommendations.forEach(r=>{const el=document.createElement("div");el.textContent="• "+r;recos.appendChild(el);});}

        sources.innerHTML="";
        const items=trends?.items||[];
        if(!items.length){sources.innerHTML="<div>—</div>";}
        else{items.slice(0,10).forEach(item=>{
          const el=document.createElement("div");
          el.className="trend-item";
          el.innerHTML=
            '<div class="trend-title">'+escapeHtml(item.title||"Без названия")+'</div>'+
            '<div class="trend-meta">'+escapeHtml(item.source||"")+
            (item.published_at?" · "+escapeHtml(item.published_at):"")+
            '</div>'+
            '<div>'+escapeHtml(item.excerpt||"")+'</div>';
          sources.appendChild(el);
        });}
      }
      function renderInsights(data){
        const summary=document.getElementById("insightsSummary");
        const conclusion=document.getElementById("insightsConclusion");
        const list=document.getElementById("insightsRecommendations");
        const updated=document.getElementById("insightsUpdated");
        const schedule=document.getElementById("insightsSchedule");
        const analyticsSummary=document.getElementById("analyticsSummary");
        const analyticsConclusion=document.getElementById("analyticsConclusion");

        summary.textContent=data?.summary||"Сводка пока недоступна";
        conclusion.textContent=data?.conclusion||"Вывод пока недоступен";
        if(analyticsSummary)analyticsSummary.textContent=data?.summary||"Сводка пока недоступна";
        if(analyticsConclusion)analyticsConclusion.textContent=data?.conclusion||"Вывод пока недоступен";

        list.innerHTML="";
        (data?.recommendations||[]).forEach(item=>{
          const el=document.createElement("div");
          el.textContent="• "+item;
          list.appendChild(el);
        });

        updated.textContent=data?.updated_at?"обновлено: "+new Date(data.updated_at).toLocaleString(locale):"обновлено: —";
        schedule.textContent=data?.refresh_schedule||"ежедневно";
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
      async function loadInsights(){
        try{
          const [analytics,trends,insights]=await Promise.all([getAnalytics(),getTrends(),getInsights()]);
          renderAnalytics(analytics);
          renderTrends(trends,insights);
          renderInsights(insights);
        }catch(err){console.error("Ошибка аналитики/трендов:",err)}
      }
      document.getElementById("refreshAllBtn")?.addEventListener("click",async()=>{
        const btn=document.getElementById("refreshAllBtn");btn.disabled=true;
        try{await callApi("/api/refresh-all");await loadDashboard();await loadInsights()}catch(e){console.error(e)}finally{btn.disabled=false}
      });
      document.getElementById("refreshInstagramBtn")?.addEventListener("click",async()=>{
        const btn=document.getElementById("refreshInstagramBtn");btn.disabled=true;
        try{await callApi("/api/instagram/refresh");await loadDashboard();await loadInsights()}catch(e){console.error(e)}finally{btn.disabled=false}
      });
      const insightsModal=document.getElementById("insightsModal");
      const openInsightsBtn=document.getElementById("openInsightsBtn");
      const closeInsightsBtn=document.getElementById("closeInsightsBtn");
      openInsightsBtn?.addEventListener("click",()=>{
        insightsModal?.classList.add("active");
        insightsModal?.setAttribute("aria-hidden","false");
      });
      closeInsightsBtn?.addEventListener("click",()=>{
        insightsModal?.classList.remove("active");
        insightsModal?.setAttribute("aria-hidden","true");
      });
      insightsModal?.addEventListener("click",event=>{
        if(event.target===insightsModal){
          insightsModal.classList.remove("active");
          insightsModal.setAttribute("aria-hidden","true");
        }
      });
      loadDashboard();
      loadInsights();
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

      // GET /api/analytics — аналитика спроса и темпа заполнения
      if (request.method === "GET" && path === "/api/analytics") {
        const data = await getAnalytics(env);
        return jsonResponse(data);
      }

      // GET /api/trends — мониторинг AI-трендов в продажах
      if (request.method === "GET" && path === "/api/trends") {
        const data = await getTrends(env);
        return jsonResponse(data);
      }

      // GET /api/insights — объединённые выводы и рекомендации
      if (request.method === "GET" && path === "/api/insights") {
        const data = await getInsights(env);
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
          calendarFull = { ok: true, timeMin, timeMax, raw_keys: Object.keys(calRes || {}), items: (calRes?.items || calRes?.data?.items || []).slice(0, 3) };
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
            first_metric: series[0] ? { name: series[0].name, values_count: (series[0].values || []).length, first_value: series[0].values?.[0] } : null,
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
    if (event.cron === "30 6 * * *") {
      ctx.waitUntil(refreshTrends(env));
      ctx.waitUntil(refreshInsights(env));
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
  const monthAgo = formatDate(new Date(now.getTime() - 90 * 86400000));
  const yearAgo = formatDate(new Date(now.getTime() - 365 * 86400000));

  // Получаем метрики за последние 30 дней
  const userMetrics = await env.DB.prepare(
    "SELECT * FROM instagram_user_metrics WHERE date >= ? ORDER BY date ASC"
  )
    .bind(monthAgo)
    .all();

  const postMetrics = await env.DB.prepare(
    "SELECT * FROM instagram_post_metrics WHERE date >= ? ORDER BY date ASC"
  )
    .bind(monthAgo)
    .all();

  // Агрегация метрик за 30 дней
  const monthMetrics = await env.DB.prepare(
    `SELECT 
      SUM(reach) as total_reach,
      SUM(total_interactions) as total_interactions,
      SUM(saves) as total_saves,
      AVG(reach) as avg_reach,
      COUNT(*) as days_count
    FROM instagram_user_metrics 
    WHERE date >= ?`
  ).bind(monthAgo).all();

  const monthData = monthMetrics.results?.[0] || {};

  // Новые записи за последние 48 часов, отсортированные по дате добавления (новые снизу)
  const twoDaysAgo = new Date(now.getTime() - 48 * 3600000).toISOString().slice(0, 19);
  const bookings = await env.DB.prepare(
    "SELECT * FROM bookings_raw WHERE updated_at >= ? ORDER BY updated_at ASC LIMIT 50"
  ).bind(twoDaysAgo).all();

  // Сводка бронирований: считаем только строки 9-58, где есть запись в колонке B (fio)
  const bookingsSummaryRaw = await env.DB.prepare(
    `WITH latest AS (
      SELECT sheet_name, row_index, MAX(updated_at) as max_updated
      FROM bookings_raw
      GROUP BY sheet_name, row_index
    ),
    rows AS (
      SELECT b.sheet_name, b.row_index, b.fio, b.prepaid
      FROM bookings_raw b
      JOIN latest l
        ON b.sheet_name = l.sheet_name
       AND b.row_index = l.row_index
       AND b.updated_at = l.max_updated
    )
    SELECT
      SUM(CASE WHEN row_index BETWEEN 9 AND 58 AND fio IS NOT NULL AND TRIM(fio) <> '' THEN 1 ELSE 0 END) as booked,
      SUM(CASE WHEN row_index BETWEEN 9 AND 58 AND fio IS NOT NULL AND TRIM(fio) <> '' AND prepaid = 1 THEN 1 ELSE 0 END) as prepaid
    FROM rows`
  ).all();
  const bookedCount = bookingsSummaryRaw.results?.[0]?.booked || 0;
  const prepaidCount = bookingsSummaryRaw.results?.[0]?.prepaid || 0;
  const totalSeats = 300;
  const seatsLeft = Math.max(0, totalSeats - bookedCount);

  // Показываем события текущей недели (Пн-Вс)
  const weekRange = getWeekRangeMsk(now);
  const calendar = await env.DB.prepare(
    "SELECT * FROM calendar_events WHERE start_time >= ? AND start_time <= ? ORDER BY start_time ASC"
  )
    .bind(weekRange.timeMin, weekRange.timeMax)
    .all();

  // Агрегация метрик из постов (fallback когда user metrics пустые)
  const postSummary = await env.DB.prepare(
    `SELECT 
      COUNT(*) as posts_count,
      COALESCE(SUM(reach), 0) as total_reach,
      AVG(reach) as avg_reach,
      COALESCE(SUM(likes), 0) as total_likes,
      AVG(likes) as avg_likes,
      COALESCE(SUM(comments), 0) as total_comments,
      AVG(comments) as avg_comments,
      COALESCE(SUM(saves), 0) as total_saves,
      AVG(saves) as avg_saves,
      COALESCE(SUM(shares), 0) as total_shares,
      AVG(shares) as avg_shares,
      MAX(reach) as best_reach
    FROM instagram_post_metrics 
    WHERE date >= ?`
  ).bind(monthAgo).all();

  const postData = postSummary.results?.[0] || {};
  
  // Вычисляем общее взаимодействие из постов
  const totalPostInteractions =
    (postData.total_likes || 0) +
    (postData.total_comments || 0) +
    (postData.total_saves || 0) +
    (postData.total_shares || 0);

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
      // Агрегированные метрики за 30 дней (из user metrics)
      monthSummary: {
        total_reach: monthData.total_reach ?? null,
        total_interactions: monthData.total_interactions ?? null,
        total_saves: monthData.total_saves ?? null,
        avg_reach: monthData.avg_reach ? Math.round(monthData.avg_reach) : null,
        days_count: monthData.days_count ?? 0,
      },
      // Статистика из постов (fallback)
      postSummary: {
        posts_count: postData.posts_count ?? 0,
        total_reach: postData.total_reach ?? null,
        avg_reach: postData.avg_reach ? Math.round(postData.avg_reach) : null,
        total_likes: postData.total_likes ?? null,
        avg_likes: postData.avg_likes ? Math.round(postData.avg_likes) : null,
        total_comments: postData.total_comments ?? null,
        avg_comments: postData.avg_comments ? Math.round(postData.avg_comments) : null,
        total_saves: postData.total_saves ?? null,
        avg_saves: postData.avg_saves ? Math.round(postData.avg_saves) : null,
        total_shares: postData.total_shares ?? null,
        avg_shares: postData.avg_shares ? Math.round(postData.avg_shares) : null,
        best_reach: postData.best_reach ?? null,
        total_interactions: totalPostInteractions,
      },
      summary: (() => {
        const total_reach = monthData.total_reach ?? postData.total_reach ?? null;
        const total_interactions = monthData.total_interactions ?? totalPostInteractions ?? null;
        const total_saves = monthData.total_saves ?? postData.total_saves ?? null;
        const avg_reach = monthData.avg_reach ? Math.round(monthData.avg_reach) : (postData.avg_reach ? Math.round(postData.avg_reach) : null);
        const posts_count = postData.posts_count ?? 0;
        const engagement_rate = total_reach ? (total_interactions / total_reach) * 100 : null;
        const saves_rate = total_reach ? (total_saves / total_reach) * 100 : null;
        const avg_interactions_per_post = posts_count ? (totalPostInteractions / posts_count) : null;

        return {
          total_reach,
          total_interactions,
          total_saves,
          avg_reach,
          posts_count,
          engagement_rate,
          saves_rate,
          avg_interactions_per_post: avg_interactions_per_post ? Math.round(avg_interactions_per_post) : null,
          followers_total: latestUser?.followers_total ?? null,
          followers_delta_month: latestUser?.followers_delta_month ?? null,
        };
      })(),
      userMetrics: userMetrics.results || [],
      postMetrics: postMetrics.results || [],
    },
    bookingsSummary: {
      total: totalSeats,
      booked: bookedCount,
      prepaid: prepaidCount,
      left: seatsLeft,
    },
    bookings: bookings.results || [],
    calendar: calendar.results || [],
  };
}

async function getAnalytics(env) {
  const now = new Date();
  const yearStart = `${now.getFullYear()}-01-01`;
  const monthAgo = formatDate(new Date(now.getTime() - 30 * 86400000));

  const igMin = await env.DB.prepare("SELECT MIN(date) as min_date FROM instagram_user_metrics").all();
  const igMinDate = igMin.results?.[0]?.min_date || null;

  const igDowRows = await env.DB.prepare(
    `SELECT strftime('%w', date) as dow,
            COUNT(*) as days_count,
            SUM(reach) as reach_sum,
            SUM(total_interactions) as interactions_sum,
            SUM(saves) as saves_sum,
            AVG(reach) as reach_avg,
            AVG(total_interactions) as interactions_avg
     FROM instagram_user_metrics
     WHERE date >= ?
     GROUP BY dow`
  ).bind(yearStart).all();

  const bookingsFirsts = await env.DB.prepare(
    `WITH firsts AS (
      SELECT hash, MIN(updated_at) as first_seen, MAX(prepaid) as prepaid, row_index, fio
      FROM bookings_raw
      WHERE fio IS NOT NULL AND TRIM(fio) <> ''
      GROUP BY hash
    )
    SELECT date(first_seen) as day,
           COUNT(*) as new_bookings,
           SUM(prepaid) as prepaid_count
    FROM firsts
    WHERE row_index BETWEEN 9 AND 58
      AND date(first_seen) >= ?
    GROUP BY day
    ORDER BY day ASC`
  ).bind(yearStart).all();

  const bookingsDowRows = await env.DB.prepare(
    `WITH firsts AS (
      SELECT hash, MIN(updated_at) as first_seen, MAX(prepaid) as prepaid, row_index, fio
      FROM bookings_raw
      WHERE fio IS NOT NULL AND TRIM(fio) <> ''
      GROUP BY hash
    )
    SELECT strftime('%w', first_seen) as dow,
           COUNT(*) as new_bookings,
           SUM(prepaid) as prepaid_count,
           AVG(prepaid) as prepaid_avg
    FROM firsts
    WHERE row_index BETWEEN 9 AND 58
      AND date(first_seen) >= ?
    GROUP BY dow`
  ).bind(yearStart).all();

  const bookedSummary = await env.DB.prepare(
    `WITH latest AS (
      SELECT sheet_name, row_index, MAX(updated_at) as max_updated
      FROM bookings_raw
      GROUP BY sheet_name, row_index
    ),
    rows AS (
      SELECT b.sheet_name, b.row_index, b.fio, b.prepaid
      FROM bookings_raw b
      JOIN latest l
        ON b.sheet_name = l.sheet_name
       AND b.row_index = l.row_index
       AND b.updated_at = l.max_updated
    )
    SELECT
      SUM(CASE WHEN row_index BETWEEN 9 AND 58 AND fio IS NOT NULL AND TRIM(fio) <> '' THEN 1 ELSE 0 END) as booked,
      SUM(CASE WHEN row_index BETWEEN 9 AND 58 AND fio IS NOT NULL AND TRIM(fio) <> '' AND prepaid = 1 THEN 1 ELSE 0 END) as prepaid
    FROM rows`
  ).all();

  const bookedCount = bookedSummary.results?.[0]?.booked || 0;
  const prepaidCount = bookedSummary.results?.[0]?.prepaid || 0;
  const totalSeats = 300;
  const seatsLeft = Math.max(0, totalSeats - bookedCount);

  const bookingsLastMonth = await env.DB.prepare(
    `WITH firsts AS (
      SELECT hash, MIN(updated_at) as first_seen, row_index, fio
      FROM bookings_raw
      WHERE fio IS NOT NULL AND TRIM(fio) <> ''
      GROUP BY hash
    )
    SELECT date(first_seen) as day, COUNT(*) as new_bookings
    FROM firsts
    WHERE row_index BETWEEN 9 AND 58
      AND date(first_seen) >= ?
    GROUP BY day`
  ).bind(monthAgo).all();

  const dailyCounts = bookingsLastMonth.results || [];
  const daysCount = dailyCounts.length || 0;
  const totalNew = dailyCounts.reduce((sum, r) => sum + (r.new_bookings || 0), 0);
  const avgPerDay = daysCount ? Math.round((totalNew / daysCount) * 10) / 10 : null;
  const daysToFill = avgPerDay ? Math.ceil(seatsLeft / avgPerDay) : null;

  const DOW_LABELS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const igDow = (igDowRows.results || []).map((row) => {
    const dow = Number(row.dow);
    const interactionsAvg = row.interactions_avg ? Math.round(row.interactions_avg) : 0;
    const reachAvg = row.reach_avg ? Math.round(row.reach_avg) : 0;
    const score = interactionsAvg * 0.7 + reachAvg * 0.3;
    return { dow, label: DOW_LABELS[dow] || String(dow), interactions_avg: interactionsAvg, reach_avg: reachAvg, score };
  }).sort((a, b) => b.score - a.score);

  const bookingsDow = (bookingsDowRows.results || []).map((row) => {
    const dow = Number(row.dow);
    return { dow, label: DOW_LABELS[dow] || String(dow), new_bookings: row.new_bookings || 0 };
  }).sort((a, b) => b.new_bookings - a.new_bookings);

  const bestIgDays = igDow.slice(0, 2).filter((d) => d.score > 0);
  const bestBookingDays = bookingsDow.slice(0, 2).filter((d) => d.new_bookings > 0);

  const igDailyRows = await env.DB.prepare(
    `SELECT date, total_interactions as interactions
     FROM instagram_user_metrics
     WHERE date >= ?
     ORDER BY date ASC`
  ).bind(yearStart).all();

  const bookingsDailyRows = await env.DB.prepare(
    `WITH firsts AS (
      SELECT hash, MIN(updated_at) as first_seen, row_index, fio
      FROM bookings_raw
      WHERE fio IS NOT NULL AND TRIM(fio) <> ''
      GROUP BY hash
    )
    SELECT date(first_seen) as day, COUNT(*) as new_bookings
    FROM firsts
    WHERE row_index BETWEEN 9 AND 58
      AND date(first_seen) >= ?
    GROUP BY day
    ORDER BY day ASC`
  ).bind(yearStart).all();

  const igMap = new Map((igDailyRows.results || []).map((r) => [r.date, r.interactions || 0]));
  const bookingsMap = new Map((bookingsDailyRows.results || []).map((r) => [r.day, r.new_bookings || 0]));
  const overlapDates = [...igMap.keys()].filter((d) => bookingsMap.has(d));
  const igSeries = overlapDates.map((d) => igMap.get(d));
  const bookingsSeries = overlapDates.map((d) => bookingsMap.get(d));
  const correlation = computePearson(igSeries, bookingsSeries);

  const yearTotalBookings = (bookingsFirsts.results || []).reduce((sum, r) => sum + (r.new_bookings || 0), 0);
  const yearTotalPrepaid = (bookingsFirsts.results || []).reduce((sum, r) => sum + (r.prepaid_count || 0), 0);
  const prepaidRate = yearTotalBookings ? Math.round((yearTotalPrepaid / yearTotalBookings) * 100) : null;

  return {
    generated_at: new Date().toISOString(),
    best_days: {
      instagram: bestIgDays,
      bookings: bestBookingDays,
    },
    bookings_pace: {
      avg_per_day: avgPerDay,
      days_to_fill: daysToFill,
      seats_left: seatsLeft,
    },
    year_overview: {
      booked_total: yearTotalBookings,
      prepaid_total: yearTotalPrepaid,
      prepaid_rate: prepaidRate,
      data_from: yearStart,
      ig_data_from: igMinDate,
    },
    correlation: {
      ig_vs_bookings: correlation,
      days_matched: overlapDates.length,
    },
    ig_note: igMinDate ? `Instagram метрики доступны с ${igMinDate}` : "Instagram метрики за последние 90 дней",
    bookings_note: "Время заявки недоступно, используется время синхронизации",
  };
}

async function getTrends(env) {
  const cached = await env.KV.get("trends:latest", { type: "json" });
  const cacheHours = Number(env.TRENDS_CACHE_HOURS || 24);
  if (cached?.updated_at) {
    const ageMs = Date.now() - new Date(cached.updated_at).getTime();
    if (ageMs < cacheHours * 3600000) {
      return cached;
    }
  }
  return await refreshTrends(env);
}

async function refreshTrends(env) {
  const sources = parseTrendSources(env.TREND_SOURCES);
  const items = [];

  for (const source of sources) {
    try {
      const feedItems = await fetchFeedItems(source.url);
      feedItems.slice(0, 8).forEach((it) => {
        items.push({
          source: source.name,
          title: it.title,
          link: it.link,
          published_at: it.published_at,
          excerpt: it.excerpt,
        });
      });
    } catch (e) {
      items.push({
        source: source.name,
        title: "Ошибка загрузки источника",
        link: "",
        published_at: "",
        excerpt: e.message,
      });
    }
  }

  const sorted = items
    .filter((i) => i.title)
    .sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));

  let summary = "Сводка недоступна — нет ключа OpenAI.";
  let recommendations = [];

  if (env.OPENAI_API_KEY && env.OPENAI_MODEL) {
    const ai = await generateTrendSummary(env, sorted.slice(0, 20));
    if (ai?.summary) summary = ai.summary;
    if (Array.isArray(ai?.recommendations)) recommendations = ai.recommendations;
  }

  const payload = {
    updated_at: new Date().toISOString(),
    summary,
    recommendations,
    items: sorted.slice(0, 20),
  };

  await env.KV.put("trends:latest", JSON.stringify(payload));
  return payload;
}

async function getInsights(env) {
  const cached = await env.KV.get("insights:latest", { type: "json" });
  const cacheHours = Number(env.INSIGHTS_CACHE_HOURS || 24);
  if (cached?.updated_at) {
    const ageMs = Date.now() - new Date(cached.updated_at).getTime();
    if (ageMs < cacheHours * 3600000) {
      return cached;
    }
  }
  return await refreshInsights(env);
}

async function refreshInsights(env) {
  const [analytics, trends] = await Promise.all([getAnalytics(env), getTrends(env)]);
  const schedule = "ежедневно, 06:30 UTC (09:30 MSK)";

  let summary = "Сводка недоступна — нет ключа OpenAI.";
  let conclusion = "Недостаточно данных для вывода.";
  let recommendations = [];

  if (env.OPENAI_API_KEY && env.OPENAI_MODEL) {
    const ai = await generateInsightsSummary(env, analytics, trends);
    if (ai?.summary) summary = ai.summary;
    if (ai?.conclusion) conclusion = ai.conclusion;
    if (Array.isArray(ai?.recommendations)) recommendations = ai.recommendations;
  } else {
    const bestIg = (analytics?.best_days?.instagram || []).map((d) => d.label).join(", ");
    const bestBookings = (analytics?.best_days?.bookings || []).map((d) => d.label).join(", ");
    const pace = analytics?.bookings_pace?.avg_per_day != null ? `${analytics.bookings_pace.avg_per_day} броней/день` : "нет данных";
    const daysToFill = analytics?.bookings_pace?.days_to_fill != null ? `${analytics.bookings_pace.days_to_fill} дней` : "нет прогноза";
    const prepaidRate = analytics?.year_overview?.prepaid_rate != null ? `${analytics.year_overview.prepaid_rate}%` : "—";

    summary =
      `Лучшие дни IG: ${bestIg || "недостаточно данных"}. ` +
      `Лучшие дни бронирований: ${bestBookings || "недостаточно данных"}. ` +
      `Темп заполнения: ${pace}.`;
    conclusion = `До полного заполнения при текущем темпе: ${daysToFill}. Предоплата: ${prepaidRate}.`;
    recommendations = [
      "Сместите рекламные активности на лучшие дни недели по IG и бронированиям.",
      "Усилите конверсию в предоплату для ускорения заполнения мест.",
      "Добавьте сбор времени заявки, чтобы выявить лучшие часы для рекламы.",
    ];
  }

  const payload = {
    updated_at: new Date().toISOString(),
    summary,
    conclusion,
    recommendations,
    refresh_schedule: schedule,
    sources: {
      analytics_updated_at: analytics?.generated_at || null,
      trends_updated_at: trends?.updated_at || null,
    },
  };

  await env.KV.put("insights:latest", JSON.stringify(payload));
  return payload;
}

async function syncInstagram(env) {
  const now = new Date();
  // Запрашиваем только последние 30 дней (Instagram API ограничивает диапазон)
  const sinceDate = new Date(now.getTime() - 90 * 86400000);

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
      fields: "id,timestamp,media_type,like_count,comments_count",
    }
  );

  const mediaItems = media?.data || media?.items || [];

  for (const item of mediaItems) {
    if (!item?.id) continue;

    const postInsights = await fetchComposio(
      env,
      env.COMPOSIO_CONN_IG,
      "INSTAGRAM_GET_IG_MEDIA_INSIGHTS",
      {
        ig_media_id: item.id,
        metric: ["reach", "saved", "shares", "total_interactions", "likes", "comments"],
        period: "lifetime",
      }
    );

    const insightMap = normalizeMediaInsights(postInsights);
    const likesFallback = extractNumber(item?.like_count);
    const commentsFallback = extractNumber(item?.comments_count);
    const likes = insightMap.likes ?? likesFallback ?? null;
    const comments = insightMap.comments ?? commentsFallback ?? null;
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
        likes,
        comments,
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

  const sheetIdMap = await getSheetIdMap(env);

  for (const sheetName of sheetNames) {
    const safeSheetName = toA1SheetName(sheetName);
    const range = `${safeSheetName}!A1:Z${maxRows}`;
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
    // Колонка K (индекс 10) = Предоплата (зелёная отметка)
    // Данные начинаются с первой строки где колонка A содержит число (порядковый номер)
    const FIO_COL = 1;      // колонка B
    const CONTACT_COL = 7;  // колонка H
    const PREPAY_COL = 10;  // колонка K

    // Найдём первую строку с данными (колонка A = число)
    let dataStartRow = 8; // по умолчанию строка 9 (индекс 8)
    for (let r = 0; r < Math.min(20, values.length); r++) {
      const cellA = String(values[r]?.[0] || "").trim();
      if (/^\d+$/.test(cellA)) {
        dataStartRow = r;
        break;
      }
    }

    const prepaidMap = await fetchPrepaidMap(env, sheetName, sheetIdMap.get(sheetName));
    const prepaidValueMap = await fetchPrepaidValuesMap(env, sheetName);

    for (let i = dataStartRow; i < values.length; i += 1) {
      const row = values[i];
      if (!row || (!row[FIO_COL] && !row[CONTACT_COL])) continue;

      const fio = String(row[FIO_COL] || "").trim();
      const contactRaw = String(row[CONTACT_COL] || "").trim();
      if (!fio && !contactRaw) continue;

      const prepayCell = row[PREPAY_COL];
      const prepaid = prepaidMap.get(i + 1) || prepaidValueMap.get(i + 1) || hasNonEmpty(prepayCell) ? 1 : 0;
      const { phone, parentName } = parseContact(contactRaw);
      const hash = await sha256(`${sheetName}|${i + 1}|${fio}|${contactRaw}`);

      const result = await env.DB.prepare(
        `INSERT INTO bookings_raw (sheet_name, row_index, fio, contact_raw, phone, parent_name, hash, prepaid)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(hash) DO UPDATE SET
           fio=excluded.fio,
           contact_raw=excluded.contact_raw,
           phone=excluded.phone,
           parent_name=excluded.parent_name,
           prepaid=excluded.prepaid,
           updated_at=datetime('now')`
      )
        .bind(sheetName, i + 1, fio, contactRaw, phone, parentName, hash, prepaid)
        .run();

      if (result.meta?.changes > 0) inserted += 1;
    }
  }

  await env.KV.put("last_sync_sheets", new Date().toISOString());
  return { inserted };
}

async function getSheetIdMap(env) {
  try {
    const info = await fetchComposio(
      env,
      env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
      "GOOGLESHEETS_GET_SPREADSHEET_INFO",
      { spreadsheet_id: env.SHEETS_ID }
    );
    const sheets = info?.data?.sheets || info?.sheets || [];
    const map = new Map();
    for (const sheet of sheets) {
      const title = sheet?.properties?.title;
      const id = sheet?.properties?.sheetId;
      if (title && id != null) {
        map.set(title, id);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

async function fetchPrepaidMap(env, sheetName, sheetId) {
  if (!sheetId) return new Map();
  try {
    const res = await fetchComposio(
      env,
      env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
      "GOOGLESHEETS_GET_SPREADSHEET_BY_DATA_FILTER",
      {
        spreadsheetId: env.SHEETS_ID,
        dataFilters: [
          {
            gridRange: {
              sheetId,
              startRowIndex: 8,
              endRowIndex: 58,
              startColumnIndex: 10,
              endColumnIndex: 11,
            },
          },
        ],
        includeGridData: true,
      }
    );
    const sheets = res?.data?.sheets || res?.sheets || [];
    const grid = sheets[0]?.data?.[0];
    const rows = grid?.rowData || [];
    const map = new Map();
    rows.forEach((row, idx) => {
      const cell = row?.values?.[0];
      if (isGreenCell(cell) || hasCellValue(cell)) {
        map.set(idx + 9, true);
      }
    });
    return map;
  } catch {
    return new Map();
  }
}

async function fetchPrepaidValuesMap(env, sheetName) {
  try {
    const safeSheetName = toA1SheetName(sheetName);
    const res = await fetchComposio(
      env,
      env.COMPOSIO_CONN_SHEETS || env.COMPOSIO_CONN_IG,
      "GOOGLESHEETS_VALUES_GET",
      {
        spreadsheet_id: env.SHEETS_ID,
        range: `${safeSheetName}!K9:K58`,
      }
    );
    const values = res?.data?.values || res?.values || [];
    const map = new Map();
    values.forEach((row, idx) => {
      const val = row?.[0];
      if (hasNonEmpty(val)) {
        map.set(idx + 9, true);
      }
    });
    return map;
  } catch {
    return new Map();
  }
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
  const nameMap = {
    saved: "saves",
    save: "saves",
    share: "shares",
  };
  for (const item of items) {
    const name = item?.name;
    const values = item?.values || [];
    if (!name || !values.length) continue;
    const key = nameMap[name] || name;
    result[key] = extractNumber(values[0]?.value);
  }
  return result;
}

function computeFollowersDeltaMonth(dates, dailyMap) {
  if (dates.length < 2) return null;
  const lastDate = dates[dates.length - 1];
  const ninetyDaysAgoIndex = Math.max(0, dates.length - 90);
  const firstDate = dates[ninetyDaysAgoIndex];
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

function isGreenCell(cell) {
  const color =
    cell?.effectiveFormat?.backgroundColor ||
    cell?.userEnteredFormat?.backgroundColor ||
    cell?.effectiveFormat?.backgroundColorStyle?.rgbColor ||
    cell?.userEnteredFormat?.backgroundColorStyle?.rgbColor;
  if (!color) return false;
  const r = color.red ?? 0;
  const g = color.green ?? 0;
  const b = color.blue ?? 0;
  // Более мягкий критерий "зелёного": зелёный доминирует и достаточно яркий.
  return g >= 0.45 && g >= r && g >= b && (g - Math.max(r, b)) >= 0.05;
}

function hasCellValue(cell) {
  const formatted = cell?.formattedValue;
  if (formatted != null && String(formatted).trim() !== "") return true;
  const userEntered = cell?.userEnteredValue;
  if (userEntered == null) return false;
  if (typeof userEntered === "string") return userEntered.trim() !== "";
  if (typeof userEntered === "number") return true;
  if (typeof userEntered === "object") {
    if ("stringValue" in userEntered) return String(userEntered.stringValue || "").trim() !== "";
    if ("numberValue" in userEntered) return true;
    if ("boolValue" in userEntered) return userEntered.boolValue === true;
  }
  return false;
}

function hasNonEmpty(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return true;
  return String(value).trim() !== "";
}

function toA1SheetName(name) {
  if (name == null) return "";
  const s = String(name);
  // Quote sheet names with spaces or special chars
  if (/[^A-Za-z0-9_]/.test(s)) {
    return "'" + s.replace(/'/g, "''") + "'";
  }
  return s;
}

function findHeaderIndex(headers, needle) {
  const lowered = needle.toLowerCase();
  return headers.findIndex((h) => String(h).toLowerCase().includes(lowered));
}

function parseContact(text) {
  // Поддержка белорусских (+375) и российских (+7, 8) номеров
  // Извлекаем номер, убирая все лишние пробелы

  // Сначала пытаемся найти белорусский номер (+375 или 375)
  let phoneMatch = text.match(/\+?375[\s]*\d{2}[\s]*\d{3}[\s]*\d{2}[\s]*\d{2}/);

  // Если не нашли, ищем российский номер (+7, 7, 8)
  if (!phoneMatch) {
    phoneMatch = text.match(/\+?7[\s]*\d{3}[\s]*\d{3}[\s]*\d{2}[\s]*\d{2}/);
  }
  if (!phoneMatch) {
    phoneMatch = text.match(/8[\s]*\d{3}[\s]*\d{3}[\s]*\d{2}[\s]*\d{2}/);
  }

  // Если всё ещё не нашли, пробуем общий паттерн
  if (!phoneMatch) {
    phoneMatch = text.match(/(\+?\d{1,3})?[\s]*\(?\d{2,3}\)?[\s]*\d{2,3}[\s]*\d{2}[\s]*\d{2}/);
  }

  let phone = phoneMatch ? phoneMatch[0] : "";
  // Удаляем ВСЕ пробелы, скобки, дефисы
  phone = phone.replace(/[\s\(\)\-]/g, "");

  // Нормализация: все номера должны начинаться с + и кода страны
  if (phone.startsWith("375")) {
    phone = `+${phone}`;
  } else if (phone.startsWith("8") && phone.length === 11) {
    // Российский номер starting with 8 -> +7
    phone = `+7${phone.slice(1)}`;
  } else if (phone.startsWith("7") && phone.length === 11) {
    phone = `+${phone}`;
  } else if (phone.startsWith("+")) {
    // Уже с плюсом, оставляем как есть
  } else if (phone.length >= 9) {
    // Просто цифры, добавляем + (предполагаем полный номер без +)
    phone = `+${phone}`;
  } else {
    phone = "";
  }

  // Извлекаем имя родителя - всё что до номера
  let parentName = text;
  if (phoneMatch) {
    // Удаляем найденный номер из текста
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
  // Получаем текущую дату по Москве
  const mskDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
  const dayOfWeek = mskDate.getDay(); // 0 = Вс, 1 = Пн, ..., 6 = Сб
  
  // Вычисляем понедельник текущей недели
  // Если сегодня воскресенье (0), то понедельник был 6 дней назад
  // Иначе понедельник = (dayOfWeek - 1) дней назад
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(mskDate);
  monday.setDate(mskDate.getDate() - daysToMonday);
  
  // Воскресенье = понедельник + 6 дней
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const start = formatDateInTimeZone(monday, "Europe/Moscow");
  const end = formatDateInTimeZone(sunday, "Europe/Moscow");

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

function computePearson(xs, ys) {
  if (!xs.length || xs.length !== ys.length) return null;
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const denom = Math.sqrt(denX * denY);
  if (!denom) return null;
  return Math.round((num / denom) * 100) / 100;
}

function parseTrendSources(raw) {
  const defaults = [
    { name: "HubSpot Sales Blog", url: "https://blog.hubspot.com/sales/rss.xml" },
    { name: "Planet AI (Aggregator)", url: "https://planet-ai.net/rss.xml" },
  ];
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  const parts = raw.split(/[\n,]+/).map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return defaults;
  return parts.map((p) => {
    const [name, url] = p.includes("|") ? p.split("|").map((s) => s.trim()) : [null, p];
    return { name: name || new URL(url).hostname.replace("www.", ""), url };
  });
}

async function fetchFeedItems(url) {
  const res = await fetch(url, { headers: { "User-Agent": "dashboard-monitor/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return parseFeedXml(xml);
}

function parseFeedXml(xml) {
  if (xml.includes("<entry")) return parseAtom(xml);
  return parseRss(xml);
}

function parseRss(xml) {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  return items.map((block) => ({
    title: extractTag(block, "title"),
    link: extractTag(block, "link") || extractTag(block, "guid"),
    published_at: extractTag(block, "pubDate") || extractTag(block, "dc:date") || "",
    excerpt: stripTags(extractTag(block, "description") || ""),
  }));
}

function parseAtom(xml) {
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  return entries.map((block) => {
    const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
    return {
      title: extractTag(block, "title"),
      link: linkMatch ? linkMatch[1] : "",
      published_at: extractTag(block, "updated") || extractTag(block, "published") || "",
      excerpt: stripTags(extractTag(block, "summary") || extractTag(block, "content") || ""),
    };
  });
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(re);
  if (!match) return "";
  return decodeEntities(stripCdata(match[1]).trim());
}

function stripCdata(str) {
  return str.replace(/^<!\\[CDATA\\[/, "").replace(/\\]\\]>$/, "");
}

function stripTags(str) {
  return String(str || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function generateTrendSummary(env, items) {
  const input = {
    role: "user",
    content: `Сформируй короткую сводку трендов AI в продажах и 3-5 практических рекомендаций для лагеря/образовательных смен. Верни JSON строго в формате: {"summary":"...","recommendations":["..."]}. Источники: ${JSON.stringify(items)}`,
  };
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [input],
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { summary: "Не удалось получить сводку: " + text, recommendations: [] };
  }
  const data = await res.json();
  const text = extractOpenAIText(data);
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    return { summary: cleaned, recommendations: [] };
  }
}

function extractOpenAIText(data) {
  if (data?.output?.length) {
    const content = data.output[0]?.content || [];
    const textPart = content.find((c) => c.type === "output_text");
    if (textPart?.text) return textPart.text;
  }
  if (data?.choices?.length) {
    return data.choices[0]?.message?.content || "";
  }
  return "";
}

async function generateInsightsSummary(env, analytics, trends) {
  const trendItems = (trends?.items || []).slice(0, 8).map((item) => ({
    title: item.title,
    source: item.source,
    published_at: item.published_at,
  }));
  const input = {
    role: "user",
    content:
      "Сформируй краткое summary (2-3 предложения), вывод (1 предложение) и 3-5 рекомендаций. " +
      "Опирайся на внутренние данные и внешние тренды. Верни JSON строго в формате: " +
      '{"summary":"...","conclusion":"...","recommendations":["..."]}. ' +
      "Пиши по-русски. Данные: " +
      JSON.stringify({ analytics, trends_summary: trends?.summary, trend_items: trendItems }),
  };
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [input],
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return { summary: "Не удалось получить сводку: " + text, conclusion: "", recommendations: [] };
  }
  const data = await res.json();
  const text = extractOpenAIText(data);
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    return { summary: cleaned, conclusion: "", recommendations: [] };
  }
}

function stripCodeFences(text) {
  const trimmed = String(text || "").trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}
