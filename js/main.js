(function () {
  'use strict';

  var CFG = window.TV_HOME_CONFIG, I = window.TVIcons, W = window.TVWeather;
  var homeIds = CFG.homeApps.map(function (a) { return a.id; });
  var $ = function (id) { return document.getElementById(id); };
  var SETTINGS_KEY = 'tvhome.settings.v1';

  var L = window.TVI18n, tr = L.text;
  var settings = loadSettings();
  settings.language = L.setLanguage(settings.language);
  var weather = W.cached();
  var weatherError = null, lastAttempt = 0;
  var allApps = [], shownApps = [];
  var precip = window.TVSky.Precip($('precip'), $('flash'));
  var scope = $('home'), focused = null, homeFocus = null, rowOffset = 0, skyKey = '';
  var BRAND = { netflix: '#000000', youtube: '#ffffff', prime: '#0f79f3', amazon: '#0f79f3', disney: '#0b2a43',
    apple: '#1c1c1e', hbo: '#002be7', max: '#002be7', hulu: '#0b0c0f', peacock: '#1c1c1c', spotify: '#121212',
    twitch: '#6441a5', plex: '#1f1f1f', jellyfin: '#0b0f1d' };

  // ---------- settings ----------
  function loadSettings() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY)); } catch (e) { /* use defaults */ }
    if (!s || typeof s !== 'object') s = {};
    var d = CFG.defaults, out = {};
    Object.keys(d).forEach(function (k) {
      var v = s[k], dv = d[k];
      var ok = dv === null ? (v === null || Array.isArray(v))
             : Array.isArray(dv) ? Array.isArray(v)
             : typeof v === typeof dv;
      out[k] = ok ? v : dv;
    });
    return out;
  }
  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* not persisted */ }
  }

  // ---------- formatting ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtTime(d) {
    if (settings.clock === '24') return pad(d.getHours()) + ':' + pad(d.getMinutes());
    var h = d.getHours() % 12 || 12;
    return h + ':' + pad(d.getMinutes()) + ' ' + (d.getHours() < 12 ? 'AM' : 'PM');
  }
  function fmtHour(d) {
    if (settings.clock === '24') return pad(d.getHours()) + ':00';
    var h = d.getHours() % 12 || 12;
    return h + (d.getHours() < 12 ? ' AM' : ' PM');
  }
  function temp(c) { return Math.round(settings.unit === 'F' ? c * 9 / 5 + 32 : c) + '°'; }
  function wind(k) { return settings.unit === 'F' ? Math.round(k * 0.621) + ' mph' : Math.round(k) + ' km/h'; }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  var dateFmt = new Intl.DateTimeFormat(settings.language, { weekday: 'long', day: 'numeric', month: 'long' });
  var dayFmt = new Intl.DateTimeFormat(settings.language, { weekday: 'short' });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function monogramInitials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(function (p) { return p.length; });
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // ---------- time of day ----------
  function today(now) { return weather && weather.daily.filter(function (d) { return sameDay(d.date, now); })[0]; }
  function sunTimes(now) {
    var t = today(now);
    if (t) return { rise: t.sunrise, set: t.sunset };
    var r = new Date(now), s = new Date(now);
    r.setHours(7, 30, 0, 0); s.setHours(19, 0, 0, 0);
    return { rise: r, set: s };
  }
  function phase(now) {
    if (settings.scenery !== 'auto') return settings.scenery;
    var st = sunTimes(now), t = now.getTime(), m = 40 * 60e3;
    if (Math.abs(t - st.rise) < m) return 'dawn';
    if (Math.abs(t - st.set) < m) return 'dusk';
    return t > st.rise && t < st.set ? 'day' : 'night';
  }
  function period(h) { return h < 5 ? 'night' : h < 12 ? 'morning' : h < 18 ? 'afternoon' : h < 22 ? 'evening' : 'night'; }

  var MOOD = {
    clear: ['Clear skies and sunshine over {p}.', 'Clear skies tonight. The evening is yours.'],
    partly: ['A mix of sun and cloud today.', 'A few clouds drifting by. Settle in.'],
    cloudy: ['Grey skies. A good day for a series.', 'Cloudy and calm. Settle in.'],
    fog: ['Foggy out there. Stay cosy.', 'Fog rolling in tonight. Stay cosy.'],
    drizzle: ['A little drizzle outside.', 'Light drizzle tonight. Settle in.'],
    rain: ['Rain today. Perfect for staying in.', 'Rain outside. The evening is yours.'],
    snow: ['Snow outside. Stay warm.', 'Snow falling tonight. Stay warm.'],
    storm: ['Thunderstorms around. Stay in and stay dry.', 'Storms tonight. Stay in and stay dry.']
  };
  var FALLBACK = { morning: 'A fresh start. Take it easy.', afternoon: 'Take a break. You have earned it.',
    evening: 'Settle in. The evening is yours.', night: 'Late one? Keep it cosy.' };

  // ---------- rendering ----------
  function renderClock(now) {
    $('clock').textContent = fmtTime(now);
    $('date').textContent = dateFmt.format(now);
    var p = period(now.getHours());
    $('greet').textContent = tr('Good ' + p + '.');

    var sub = tr(FALLBACK[p]);
    if (weather) {
      var d = W.describe(weather.current.code), dayish = p === 'morning' || p === 'afternoon';
      sub = tr(MOOD[d.kind][dayish ? 0 : 1], { p: CFG.location.name });
    }
    $('sub').textContent = sub;

    var st = sunTimes(now), line = '';
    if (weather) {
      if (now < st.rise) line = I.ui.sunrise + tr('Sunrise at {time}', { time: fmtTime(st.rise) });
      else if (now < st.set) line = I.ui.sunset + tr('Sunset at {time}', { time: fmtTime(st.set) });
      else {
        var tm = weather.daily[1];
        line = tm ? I.ui.sunrise + tr('Sunrise tomorrow at {time}', { time: fmtTime(tm.sunrise) }) : '';
      }
    }
    $('sunline').innerHTML = line;

    if (!$('ambient').hidden) renderAmbient(now);
  }

  function renderWeather() {
    var now = new Date();
    if (!weather) {
      $('wxCond').textContent = weatherError ? tr('Weather unavailable') : tr('Loading weather…');
      $('wxDetails').textContent = weatherError ? tr('Retrying shortly') : '';
      return;
    }
    var c = weather.current, d = W.describe(c.code), t = today(now) || weather.daily[0];
    $('wxIcon').innerHTML = I.weather(d.kind, c.isDay);
    $('wxTemp').textContent = temp(c.temp);
    $('wxCond').textContent = d.label;
    $('wxHilo').textContent = t ? tr('H {high}   L {low}', { high: temp(t.max), low: temp(t.min) }) : '';
    var stale = Date.now() - weather.fetchedAt > 60 * 60e3;
    $('wxDetails').innerHTML = tr('Feels') + ' ' + temp(c.feels) + '<i></i>' + tr('Wind') + ' ' + wind(c.wind) + '<i></i>' + tr('Humidity') + ' ' +
      Math.round(c.humidity) + '%' + (stale ? '<i></i>' + tr('Updated') + ' ' + fmtTime(new Date(weather.fetchedAt)) : '');
    var hours = weather.hourly.filter(function (h) { return h.time > now; }).slice(0, 6);
    $('wxHours').innerHTML = hours.map(function (h) {
      var hd = W.describe(h.code);
      return '<div class="hr"><span>' + fmtHour(h.time) + '</span>' + I.weather(hd.kind, h.isDay) +
        '<b>' + temp(h.temp) + '</b></div>';
    }).join('');
  }

  function renderSky(now) {
    var ph = phase(now), cur = weather ? weather.current : null;
    var d = cur ? W.describe(cur.code) : { kind: 'clear', intensity: 0 };
    var cloud = cur ? cur.cloud : 0.1;
    var key = [ph, Math.round(cloud * 10), d.kind, now.getDate()].join('|');
    if (key !== skyKey) {
      skyKey = key;
      window.TVSky.render($('sky'), { phase: ph, cloud: cloud, kind: d.kind, date: now });
      window.TVLandscape.render($('landscape'), { phase: ph, cloud: cloud, kind: d.kind });
      document.body.dataset.phase = ph;
    }
    precip.set(settings.effects ? d.kind : null, d.intensity);
  }

  function renderAll() {
    var now = new Date();
    renderClock(now);
    renderWeather();
    renderSky(now);
  }

  // ---------- apps ----------
  function rank(a) {
    var homeIndex = homeIds.indexOf(a.id);
    if (homeIndex >= 0) return homeIndex;
    var hay = (a.id + ' ' + a.name).toLowerCase();
    for (var i = 0; i < CFG.favoriteOrder.length; i++) if (hay.indexOf(CFG.favoriteOrder[i]) >= 0) return homeIds.length + i;
    return 999;
  }
  function brandColor(a) {
    if (a.color && /^#[0-9a-fA-F]{3,8}$/.test(a.color)) return a.color;
    var words = (a.id + ' ' + a.name).toLowerCase().split(/[^a-z0-9+]+/);
    for (var i = 0; i < words.length; i++) if (BRAND[words[i]]) return BRAND[words[i]];
    return null;
  }
  function sortApps(list) {
    var order = settings.order && settings.order.length ? settings.order : null;
    if (!order) return list.slice().sort(function (a, b) { return rank(a) - rank(b) || a.name.localeCompare(b.name); });
    var idx = Object.create(null);
    for (var i = 0; i < order.length; i++) idx[order[i]] = i;
    return list.slice().sort(function (a, b) {
      var ai = a.id in idx ? idx[a.id] : -1;
      var bi = b.id in idx ? idx[b.id] : -1;
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return rank(a) - rank(b) || a.name.localeCompare(b.name);
    });
  }

  // If an icon is a full opaque tile, extend its edge colour across the tile.
  function tintFromIcon(img, tile) {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 12;
      var x = c.getContext('2d'); x.drawImage(img, 0, 0, 12, 12);
      var px = x.getImageData(0, 0, 12, 12).data, corners = [0, 11, 132, 143], r = 0, g = 0, b = 0;
      for (var i = 0; i < corners.length; i++) {
        var o = corners[i] * 4;
        if (px[o + 3] < 200) return;
        r += px[o]; g += px[o + 1]; b += px[o + 2];
      }
      tile.style.background = 'rgb(' + Math.round(r / 4) + ',' + Math.round(g / 4) + ',' + Math.round(b / 4) + ')';
      tile.classList.add('opaque');
    } catch (e) { /* cross-origin icon: keep brand colour */ }
  }

  function renderGrid() {
    var hidden = settings.hidden;
    shownApps = sortApps(allApps).filter(function (a) { return hidden.indexOf(a.id) < 0; });
    var grid = $('grid');
    grid.innerHTML = '';
    shownApps.forEach(function (a, i) {
      var tile = document.createElement('button');
      tile.className = 'tile focusable' + (a.sample ? ' sample' : '');
      tile.dataset.app = a.id;
      tile.dataset.idx = i;
      var bc = brandColor(a);
      if (bc) tile.style.background = bc; else tile.classList.add('plain');
      tile.innerHTML = '<span class="tile-name">' + esc(a.name) + '</span>';
      function toMonogram() {
        tile.classList.add('no-icon');
        var nameEl = tile.querySelector('.tile-name');
        if (nameEl) nameEl.textContent = monogramInitials(a.name);
      }
      if (a.icon) {
        var img = new Image();
        img.alt = '';
        img.onload = function () { if (!a.sample) tintFromIcon(img, tile); };
        img.onerror = function () { img.remove(); toMonogram(); };
        img.src = a.icon;
        tile.insertBefore(img, tile.firstChild);
      } else toMonogram();
      grid.appendChild(tile);
    });
    if (!shownApps.length) grid.innerHTML = '<div class="empty">' + tr('No apps to show. Open Settings to choose apps.') + '</div>';
    scrollGrid(null);
  }

  function scrollGrid(idx) {
    var grid = $('grid'), tiles = grid.querySelectorAll('.tile');
    var width = grid.clientWidth, last = tiles[tiles.length - 1];
    var max = last ? Math.max(0, last.offsetLeft + last.offsetWidth - width) : 0;
    rowOffset = Math.min(rowOffset, max);
    var tile = idx !== null && tiles[idx];
    if (tile) {
      if (tile.offsetLeft < rowOffset) rowOffset = tile.offsetLeft;
      else if (tile.offsetLeft + tile.offsetWidth > rowOffset + width) rowOffset = tile.offsetLeft + tile.offsetWidth - width;
    }
    grid.style.transform = 'translateX(' + (-rowOffset) + 'px)';
  }

  function loadApps() {
    return window.TVApps.list().then(function (list) {
      var prevId = focused && focused.dataset.app;
      allApps = list;
      if (!Array.isArray(settings.hidden)) {
        settings.hidden = list.filter(function (a) { return homeIds.indexOf(a.id) < 0; }).map(function (a) { return a.id; });
      }
      renderGrid();
      if (scope === $('apps-page')) {
        renderAppsPage();
        if (!focused || !document.contains(focused)) focusEl(firstFocusableIn(scope));
      }
      if (scope === $('settings')) {
        renderSettings();
        if (!focused || !document.contains(focused)) focusEl(firstFocusableIn(scope));
      }
      if (scope === $('home')) {
        var again = prevId && document.querySelector('.tile[data-app="' + CSS.escape(prevId) + '"]');
        if (again || !focused || !document.contains(focused)) focusEl(again || firstTile() || document.querySelector('#home .focusable'));
      }
    }).catch(function () { toast(tr('Could not read installed apps')); });
  }
  function firstTile() { return document.querySelector('#grid .tile'); }

  // ---------- weather loading ----------
  function refreshWeather(force) {
    var age = weather ? Date.now() - weather.fetchedAt : Infinity;
    var due = force || age > CFG.weatherRefreshMinutes * 60e3;
    var backoff = weatherError ? 2 * 60e3 : 0;
    if (!due || Date.now() - lastAttempt < backoff) return;
    lastAttempt = Date.now();
    W.fetch(CFG.location).then(function (w) {
      weather = w; weatherError = null; renderAll();
    }).catch(function (e) {
      weatherError = e; renderWeather();
    });
  }

  // ---------- overlays ----------
  function renderForecast() {
    var now = new Date();
    $('fcPlace').textContent = CFG.location.name + (weather ? ' · ' + tr('Updated') + ' ' + fmtTime(new Date(weather.fetchedAt)) : '');
    if (!weather) { $('fcDays').innerHTML = '<div class="empty">' + tr('Weather is not available yet.') + '</div>'; $('fcFacts').innerHTML = ''; return; }
    var days = weather.daily, lo = Infinity, hi = -Infinity;
    days.forEach(function (d) { lo = Math.min(lo, d.min); hi = Math.max(hi, d.max); });
    var span = Math.max(1, hi - lo);
    $('fcDays').innerHTML = days.map(function (d, i) {
      var wd = W.describe(d.code);
      var left = (d.min - lo) / span * 100, width = Math.max(6, (d.max - d.min) / span * 100);
      return '<div class="fc-day' + (sameDay(d.date, now) ? ' today' : '') + '">' +
        '<div class="fc-name">' + (i === 0 && sameDay(d.date, now) ? tr('Today') : dayFmt.format(d.date)) + '</div>' +
        I.weather(wd.kind, true) + '<div class="fc-label">' + wd.label + '</div>' +
        '<div class="fc-temps"><b>' + temp(d.max) + '</b><span>' + temp(d.min) + '</span></div>' +
        '<div class="fc-bar"><i style="left:' + left + '%;width:' + width + '%"></i></div>' +
        '<div class="fc-pop">' + I.ui.drop + (d.pop == null ? '–' : d.pop + '%') + '</div></div>';
    }).join('');
    var c = weather.current, t = today(now) || days[0];
    $('fcFacts').innerHTML = [
      [I.ui.sunrise, 'Sunrise', fmtTime(t.sunrise)], [I.ui.sunset, 'Sunset', fmtTime(t.sunset)],
      [I.ui.wind, 'Wind', wind(c.wind)], [I.ui.drop, 'Humidity', Math.round(c.humidity) + '%'],
      [I.weather(W.describe(c.code).kind, c.isDay), 'Now', temp(c.temp) + ' · ' + tr('feels') + ' ' + temp(c.feels)]
    ].map(function (f) { return '<div class="fact">' + f[0] + '<span>' + tr(f[1]) + '</span><b>' + f[2] + '</b></div>'; }).join('');
  }

  // ---------- Inputs page ----------
  // Inputs come from CFG.homeApps entries that carry a `source: { type, number }`.
  // If none are configured, show a hint telling the user how to add them.
  function configuredInputs() {
    return (CFG.homeApps || []).filter(function (a) { return a.source && a.source.type === 'HDMI'; });
  }
  function renderInputs() {
    var ins = configuredInputs();
    var row = $('inputsRow');
    row.innerHTML = '';
    if (!ins.length) {
      $('inputsSub').textContent = tr('No inputs configured yet.');
      $('inputsNote').innerHTML = tr('Add entries to {file} with a {field}, for example:', { file: 'js/config.local.js', field: 'source' }) +
        '<br><code>{ id: "input.hdmi1", name: "Apple TV", source: { type: "HDMI", number: 1 }, color: "#1c1c1e" }</code>';
      return;
    }
    $('inputsSub').textContent = tr('{n} connected · press OK to switch · hold OK to rename', { n: ins.length });
    $('inputsNote').textContent = '';
    ins.forEach(function (a, i) {
      var el = document.createElement('button');
      el.className = 'in-card focusable' + (i === 0 ? ' featured' : '');
      el.dataset.app = a.id;
      if (a.color && /^#[0-9a-fA-F]{3,8}$/.test(a.color) && i !== 0) el.style.background = a.color;
      var displayName = inputLabel(a);
      el.innerHTML = '<div class="k">' + esc(a.source.type) + ' ' + esc(a.source.number) + (i === 0 ? ' · ' + tr('Featured') : '') + '</div>' +
        '<div class="nm">' + esc(displayName) + '</div>' +
        '<div class="meta">' + esc(a.deviceNote || tr('Hold OK to rename · Press OK to switch')) + '</div>';
      row.appendChild(el);
    });
  }
  function inputLabel(a) {
    var map = settings.inputNames;
    if (map && typeof map === 'object' && !Array.isArray(map) && typeof map[a.id] === 'string' && map[a.id].trim()) {
      return map[a.id];
    }
    return a.name || (a.source.type + ' ' + a.source.number);
  }

  // ---------- Apps page ----------
  var CHIPS = [
    { key: 'all', label: 'All', match: function () { return true; } },
    { key: 'streaming', label: 'Streaming', match: function (a) {
      return /(netflix|hbo|max|disney|peacock|hulu|prime|amazon|apple|crunchy|funi|paramount|pluto|tubi)/i.test(a.id + ' ' + a.name);
    } },
    { key: 'live', label: 'Live TV', match: function (a) {
      return /(fox|cnn|espn|news|sling|fubo|youtube.?tv|samsung.?tv|tvplus|live|antenna)/i.test(a.id + ' ' + a.name);
    } },
    { key: 'utility', label: 'Utilities', match: function (a) {
      return /(settings|store|internet|browser|apps|knox|plex|jellyfin|spotify|music)/i.test(a.id + ' ' + a.name);
    } }
  ];
  var activeChip = 'all';
  function renderAppsPage() {
    var chipRow = $('appChips');
    chipRow.innerHTML = CHIPS.map(function (c) {
      return '<button class="chip focusable' + (c.key === activeChip ? ' on' : '') + '" data-chip="' + c.key + '">' + tr(c.label) + '</button>';
    }).join('');
    var grid = $('bigGrid');
    grid.innerHTML = '';
    var chip = CHIPS.filter(function (c) { return c.key === activeChip; })[0] || CHIPS[0];
    var hidden = settings.hidden || [];
    var list = sortApps(allApps).filter(function (a) {
      if (a.source) return false; // HDMI inputs live on their own page
      if (hidden.indexOf(a.id) >= 0 && activeChip === 'all') return true; // still show hidden on Apps page
      return chip.match(a);
    });
    if (!list.length) { grid.innerHTML = '<div class="empty">' + tr('No apps match this filter.') + '</div>'; return; }
    list.forEach(function (a, i) {
      var tile = document.createElement('button');
      tile.className = 'tile focusable' + (a.sample ? ' sample' : '');
      tile.dataset.app = a.id;
      tile.dataset.idx = i;
      var bc = brandColor(a);
      if (bc) tile.style.background = bc; else tile.classList.add('plain');
      tile.innerHTML = '<span class="tile-name">' + esc(a.name) + '</span>';
      function toMonogram() {
        tile.classList.add('no-icon');
        var nameEl = tile.querySelector('.tile-name');
        if (nameEl) nameEl.textContent = monogramInitials(a.name);
      }
      if (a.icon) {
        var img = new Image();
        img.alt = '';
        img.onload = function () { if (!a.sample) tintFromIcon(img, tile); };
        img.onerror = function () { img.remove(); toMonogram(); };
        img.src = a.icon;
        tile.insertBefore(img, tile.firstChild);
      } else toMonogram();
      grid.appendChild(tile);
    });
  }

  var PREFS = [
    { key: 'language', label: 'Language', values: [['pt-PT', 'Português (Portugal)'], ['en-GB', 'English']] },
    { key: 'unit', label: 'Temperature', values: [['C', 'Celsius'], ['F', 'Fahrenheit']] },
    { key: 'clock', label: 'Clock', values: [['24', '24-hour'], ['12', '12-hour']] },
    { key: 'scenery', label: 'Scenery', values: [['auto', 'Time & weather'], ['night', 'Night'], ['dawn', 'Dawn'], ['day', 'Day'], ['dusk', 'Dusk']] },
    { key: 'effects', label: 'Rain & snow effects', values: [[true, 'On'], [false, 'Off']] }
  ];
  function prefValue(p) {
    var v = p.values.filter(function (x) { return x[0] === settings[p.key]; })[0];
    return tr(v ? v[1] : p.values[0][1]);
  }
  function cyclePref(key) {
    var p = PREFS.filter(function (x) { return x.key === key; })[0];
    if (!p) return;
    var i = p.values.map(function (v) { return v[0]; }).indexOf(settings[key]);
    settings[key] = p.values[(i + 1) % p.values.length][0];
    saveSettings();
    if (key === 'language') { applyLanguage(); renderSettings(); }
    else renderAll();
    toast(tr(p.label) + ': ' + prefValue(p));
  }
  function renderSettings() {
    $('prefs').innerHTML = '<div class="col-title">' + tr('Preferences') + '<span>' + tr('Press OK to change') + '</span></div>' +
      PREFS.map(function (p) {
        return '<button class="row focusable" data-pref="' + p.key + '"><span>' + (p.key === 'language' && settings.language === 'pt-PT' ? 'Idioma / Language' : tr(p.label)) + '</span><b>' + prefValue(p) + '</b></button>';
      }).join('') +
      '<div class="note">' + esc(tr('Weather for {place} from Open-Meteo. Landscapes change with the weather and time of day.', { place: CFG.location.name })) + '</div>';
    $('appList').innerHTML = sortApps(allApps).map(function (a) {
      var off = (settings.hidden || []).indexOf(a.id) >= 0;
      return '<button class="row app-row focusable' + (off ? ' off' : '') + '" data-toggle="' + esc(a.id) + '">' +
        '<span>' + esc(a.name) + '</span><b>' + (off ? tr('Hidden') : I.ui.check) + '</b></button>';
    }).join('');
  }

  function renderAmbient(now) {
    $('ambTime').textContent = fmtTime(now);
    $('ambDate').textContent = dateFmt.format(now);
    if (weather) {
      var c = weather.current, d = W.describe(c.code);
      $('ambWx').innerHTML = I.weather(d.kind, c.isDay) + '<span>' + temp(c.temp) + '</span><em>' + esc(tr('{condition} in {place}', { condition: d.label, place: CFG.location.name })) + '</em>';
    }
  }

  // Scopes are the four top-level pages addressable from the tabs row:
  // #home, #inputs, #apps-page, #settings. Forecast and Ambient remain as
  // overlays over whichever scope is current.
  var SCOPES = ['home', 'inputs', 'apps-page', 'settings'];
  var scopeFocus = Object.create(null); // last focused element per scope id

  function activeTab() { return document.querySelector('.tab.on'); }
  function markTab(scopeId) {
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
      t.classList.toggle('on', t.dataset.scope === scopeId);
    });
  }

  var SCOPE_LABELS = { 'home': 'Home', 'inputs': 'Inputs', 'apps-page': 'Apps', 'settings': 'Settings' };
  function switchScope(id) {
    if (SCOPES.indexOf(id) < 0) return;
    if (focused) scopeFocus[scope.id] = focused;
    SCOPES.forEach(function (s) {
      var el = $(s);
      var show = s === id;
      el.hidden = !show;
      el.style.display = show ? '' : 'none';
    });
    scope = $(id);
    markTab(id);
    $('scopeLabel').textContent = tr(SCOPE_LABELS[id] || 'Home');
    if (id === 'inputs') renderInputs();
    else if (id === 'apps-page') renderAppsPage();
    else if (id === 'settings') renderSettings();
    var want = scopeFocus[id];
    if (want && document.contains(want) && scope.contains(want)) focusEl(want);
    else focusEl(firstFocusableIn(scope));
  }
  function firstFocusableIn(root) {
    if (!root) return null;
    if (root.id === 'home') return firstTile() || root.querySelector('.focusable');
    if (root.id === 'inputs') return root.querySelector('.in-card.focusable');
    if (root.id === 'apps-page') return root.querySelector('.tile.focusable');
    if (root.id === 'settings') return root.querySelector('.row.focusable');
    return root.querySelector('.focusable');
  }

  function openOverlay(id) {
    homeFocus = focused;
    var el = $(id);
    if (id === 'forecast') renderForecast();
    if (id === 'ambient') { renderAmbient(new Date()); document.body.classList.add('ambient-on'); }
    else document.body.classList.add('overlay-on');
    el.hidden = false;
    scope = el;
    focusEl(el.querySelector('.focusable'));
  }
  function closeOverlay() {
    // From a scope page, back() falls through to home. Overlays dismiss here.
    if (!document.body.classList.contains('overlay-on') && !document.body.classList.contains('ambient-on')) {
      if (scope !== $('home')) switchScope('home');
      return;
    }
    scope.hidden = true;
    document.body.classList.remove('ambient-on');
    document.body.classList.remove('overlay-on');
    scope = $('home');
    focusEl(homeFocus && document.contains(homeFocus) ? homeFocus : firstTile());
  }

  // ---------- focus & navigation ----------
  function focusables() {
    var isVisible = function (el) { return el.offsetParent !== null; };
    var scoped = Array.prototype.filter.call(scope.querySelectorAll('.focusable'), isVisible);
    var top = Array.prototype.filter.call(document.querySelectorAll('.topbar .focusable'), isVisible);
    return scoped.concat(top);
  }
  function focusEl(el) {
    if (!el) return;
    if (focused) focused.classList.remove('focused');
    focused = el;
    el.classList.add('focused');
    if (el.classList.contains('tile') && el.parentNode === $('grid')) scrollGrid(+el.dataset.idx);
    if (el.parentNode && el.parentNode.id === 'appList') {
      var list = el.parentNode, top = el.offsetTop, inset = 8;
      if (top - inset < list.scrollTop) list.scrollTop = Math.max(0, top - inset);
      else if (top + el.offsetHeight + inset > list.scrollTop + list.clientHeight) list.scrollTop = top + el.offsetHeight + inset - list.clientHeight;
    }
  }
  function move(dir) {
    // Reset only when focus is truly lost. A focused tab lives outside the active
    // scope but is still a valid focusable — don't throw it away.
    if (!focused || !document.contains(focused) || !focused.classList.contains('focusable')) {
      focusEl(focusables()[0]); return;
    }
    // Home strip: cycle through the horizontal tile row. The Apps page uses the
    // wrapping grid below, which handles left/right geometrically.
    if (focused.classList.contains('tile') && focused.parentNode === $('grid') && (dir === 'left' || dir === 'right')) {
      var tiles = $('grid').querySelectorAll('.tile'), count = tiles.length;
      if (count) focusEl(tiles[(+focused.dataset.idx + (dir === 'right' ? 1 : -1) + count) % count]);
      return;
    }
    // Tabs row cycles with left/right. Up stays on the row (no-op); Down goes
    // back into the current scope.
    if (focused.classList.contains('tab')) {
      if (dir === 'left' || dir === 'right') {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
        var i = tabs.indexOf(focused), n = tabs.length;
        if (n) focusEl(tabs[(i + (dir === 'right' ? 1 : -1) + n) % n]);
        return;
      }
      if (dir === 'down') { focusEl(firstFocusableIn(scope)); return; }
      if (dir === 'up') return;
    }
    // Pressing Up from any tile jumps straight to the active tab — the top bar
    // is otherwise two presses away when the weather card sits between them.
    if (focused.classList.contains('tile') && dir === 'up') {
      var activeTab = document.querySelector('.tab.on');
      if (activeTab) { focusEl(activeTab); return; }
    }
    // Same shortcut from an input card or settings row — one press up to the tabs.
    if (dir === 'up' && (focused.classList.contains('in-card') || focused.classList.contains('row') || focused.classList.contains('chip'))) {
      var at = document.querySelector('.tab.on');
      if (at && focused.getBoundingClientRect().top > at.getBoundingClientRect().bottom + 20) {
        focusEl(at); return;
      }
    }
    var a = focused.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    var best = null, bestScore = Infinity;
    focusables().forEach(function (el) {
      if (el === focused) return;
      var b = el.getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2, primary, cross;
      if (el.classList.contains('tile')) {
        var viewport = $('grid').parentNode.getBoundingClientRect();
        if (b.left < viewport.left || b.right > viewport.right) return;
      }
      if (dir === 'left') { if (bx >= ax - 5) return; primary = Math.max(0, a.left - b.right); cross = Math.abs(by - ay) * 2; }
      if (dir === 'right') { if (bx <= ax + 5) return; primary = Math.max(0, b.left - a.right); cross = Math.abs(by - ay) * 2; }
      if (dir === 'up') { if (by >= ay - 5) return; primary = Math.max(0, a.top - b.bottom); cross = Math.abs(bx - ax); }
      if (dir === 'down') { if (by <= ay + 5) return; primary = Math.max(0, b.top - a.bottom); cross = Math.abs(bx - ax); }
      var score = primary + cross;
      if (score < bestScore) { bestScore = score; best = el; }
    });
    if (best) focusEl(best);
  }

  function activate(el) {
    if (!el) return;
    var d = el.dataset;
    if (d.scope) { switchScope(d.scope); return; }
    if (d.chip) {
      activeChip = d.chip;
      renderAppsPage();
      focusEl(document.querySelector('[data-chip="' + d.chip + '"]'));
      return;
    }
    if (d.app) {
      var app = allApps.filter(function (a) { return a.id === d.app; })[0];
      window.TVApps.launch(d.app).catch(function (e) { toast(tr('Could not open {app}.', { app: app ? app.name : tr('app') }) + ' ' + tr(e.message)); });
    } else if (d.pref) {
      var p = PREFS.filter(function (x) { return x.key === d.pref; })[0];
      var i = p.values.map(function (v) { return v[0]; }).indexOf(settings[p.key]);
      settings[p.key] = p.values[(i + 1) % p.values.length][0];
      saveSettings();
      if (p.key === 'language') {
        applyLanguage();
        renderSettings();
        focusEl($('prefs').querySelector('[data-pref="language"]'));
      } else {
        el.querySelector('b').textContent = prefValue(p);
      }
      renderAll();
    } else if (d.toggle) {
      var h = settings.hidden, k = h.indexOf(d.toggle);
      if (k >= 0) h.splice(k, 1); else h.push(d.toggle);
      saveSettings();
      el.classList.toggle('off', k < 0);
      el.querySelector('b').innerHTML = k < 0 ? tr('Hidden') : I.ui.check;
      renderGrid();
    } else if (d.action === 'home') {
      rowOffset = 0; scrollGrid(null); focusEl(firstTile());
    } else if (d.action === 'close') {
      closeOverlay();
    } else if (d.action) {
      openOverlay(d.action);
    }
  }

  function back() {
    // Overlays dismiss first, then scope pages fall back to home, then exit the launcher.
    if (document.body.classList.contains('overlay-on') || document.body.classList.contains('ambient-on')) {
      closeOverlay();
      return;
    }
    if (scope !== $('home')) { switchScope('home'); return; }
    var first = firstTile();
    if (first && focused !== first) { rowOffset = 0; focusEl(first); return; }
    window.TVApps.exit();
  }

  // Long-press OK on a tile enters reorder mode (arrows move the tile, order
  // persisted in settings.order). Long-press OK on an input card enters rename
  // mode (an inline text field, name persisted in settings.inputNames).
  var EDIT_HOLD_MS = 500;
  var editTile = null, renameCard = null, renameOriginal = '', okTimer = null, okHandled = false;
  function enterEdit(el) {
    if (!el) return;
    if (el.classList.contains('tile')) { editTile = el; el.classList.add('editing'); return; }
    if (el.classList.contains('in-card')) { enterRename(el); return; }
  }
  function exitEdit() {
    if (editTile) editTile.classList.remove('editing');
    editTile = null;
    if (renameCard) exitRename(true); // cancel on generic exit
  }
  function enterRename(card) {
    renameCard = card;
    card.classList.add('renaming');
    var nmEl = card.querySelector('.nm');
    renameOriginal = nmEl ? nmEl.textContent : '';
    if (!nmEl) return;
    nmEl.innerHTML = '<input class="rename-input" type="text" value="' + esc(renameOriginal) + '" maxlength="24" autocapitalize="words" />';
    var input = nmEl.querySelector('input');
    input.focus();
    input.setSelectionRange(0, input.value.length);
  }
  function exitRename(cancel) {
    if (!renameCard) return;
    var card = renameCard, id = card.dataset.app;
    var input = card.querySelector('.rename-input');
    if (!cancel && input) {
      var v = input.value.trim();
      var map = (settings.inputNames && typeof settings.inputNames === 'object' && !Array.isArray(settings.inputNames)) ? settings.inputNames : {};
      if (v) map[id] = v; else delete map[id];
      settings.inputNames = map;
      saveSettings();
    }
    renameCard = null;
    card.classList.remove('renaming');
    renderInputs();
    var again = document.querySelector('.in-card[data-app="' + CSS.escape(id) + '"]');
    if (again) focusEl(again);
  }
  function moveEdit(dir) {
    if (!editTile) return;
    var id = editTile.dataset.app;
    var idx = -1;
    for (var i = 0; i < shownApps.length; i++) if (shownApps[i].id === id) { idx = i; break; }
    if (idx < 0) return;
    var j = idx + dir;
    if (j < 0 || j >= shownApps.length) return;
    var tmp = shownApps[idx]; shownApps[idx] = shownApps[j]; shownApps[j] = tmp;
    settings.order = shownApps.map(function (a) { return a.id; });
    saveSettings();
    renderGrid();
    var moved = document.querySelector('.tile[data-app="' + CSS.escape(id) + '"]');
    if (moved) { focusEl(moved); moved.classList.add('editing'); editTile = moved; }
  }

  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    if (scope === $('ambient')) { e.preventDefault(); closeOverlay(); return; }
    if (renameCard) {
      // Enter commits, Samsung Back / Esc cancels. Backspace (8) is left alone so
      // the input can delete a character. Letters, digits and arrows flow to the
      // text field so the TV's virtual keyboard works normally.
      if (k === 13) { exitRename(false); e.preventDefault(); return; }
      if (k === 10009 || k === 27) { exitRename(true); e.preventDefault(); return; }
      return;
    }
    if (editTile) {
      if (k === 37) moveEdit(-1);
      else if (k === 39) moveEdit(1);
      else if (k === 13 || k === 10009 || k === 27 || k === 8) exitEdit();
      else { return; }
      e.preventDefault();
      return;
    }
    if (k === 13 && focused && (focused.classList.contains('tile') || focused.classList.contains('in-card')) && !okTimer) {
      okHandled = false;
      var target = focused;
      okTimer = setTimeout(function () {
        okTimer = null; okHandled = true;
        enterEdit(target);
      }, EDIT_HOLD_MS);
      e.preventDefault();
      return;
    }
    if (k === 13 && okTimer) { e.preventDefault(); return; }
    if (k >= 403 && k <= 406 && scope === $('home')) {
      // Red/Green/Yellow/Blue: cycle effects / unit / scenery / clock.
      cyclePref({ 403: 'effects', 404: 'unit', 405: 'scenery', 406: 'clock' }[k]);
      e.preventDefault();
      return;
    }
    if (k === 37) move('left');
    else if (k === 38) move('up');
    else if (k === 39) move('right');
    else if (k === 40) move('down');
    else if (k === 13) activate(focused);
    else if (k === 10009 || k === 27 || k === 8) back();
    else return;
    e.preventDefault();
  });
  document.addEventListener('keyup', function (e) {
    if (e.keyCode !== 13) return;
    if (okTimer) {
      clearTimeout(okTimer); okTimer = null;
      if (!okHandled) activate(focused);
    }
  });
  // Samsung remote pointer and desktop mouse.
  document.addEventListener('mouseover', function (e) {
    if (renameCard || editTile) return;
    var el = e.target.closest && e.target.closest('.focusable');
    if (el && scope.contains(el) && el !== focused) focusEl(el);
  });
  document.addEventListener('click', function (e) {
    if (renameCard) return; // allow the virtual keyboard to interact with the input
    if (scope === $('ambient')) { closeOverlay(); return; }
    var el = e.target.closest && e.target.closest('.focusable');
    if (el && scope.contains(el)) { focusEl(el); activate(el); }
  });

  // ---------- toast ----------
  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, 3500);
  }

  // ---------- layout & lifecycle ----------
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    var st = $('stage');
    st.style.transform = 'scale(' + s + ')';
    st.style.left = Math.max(0, (window.innerWidth - 1920 * s) / 2) + 'px';
    st.style.top = Math.max(0, (window.innerHeight - 1080 * s) / 2) + 'px';
  }

  function applyLanguage() {
    L.setLanguage(settings.language);
    L.apply(document);
    dateFmt = new Intl.DateTimeFormat(settings.language, { weekday: 'long', day: 'numeric', month: 'long' });
    dayFmt = new Intl.DateTimeFormat(settings.language, { weekday: 'short' });
    scrollGrid(null);
    var empty = $('grid').querySelector('.empty');
    if (empty) empty.textContent = tr('No apps to show. Open Settings to choose apps.');
    if (!$('forecast').hidden) renderForecast();
  }

  function init() {
    // Register the four colour buttons so the TV routes them to this app.
    if (window.tizen && tizen.tvinputdevice && tizen.tvinputdevice.registerKey) {
      ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'].forEach(function (name) {
        try { tizen.tvinputdevice.registerKey(name); } catch (e) { /* already registered */ }
      });
    }
    applyLanguage();
    Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (el) { el.innerHTML = I.ui[el.dataset.icon]; });
    $('place').textContent = CFG.location.name;
    if (!window.TVApps.isTizen) document.body.classList.add('preview');
    fit();
    window.addEventListener('resize', fit);
    var q = window.TVApps.isTizen ? null : new URLSearchParams(location.search);
    if (q && q.get('scenery')) settings.scenery = q.get('scenery');
    renderAll();
    loadApps();
    refreshWeather(false);
    if (q && q.get('open')) setTimeout(function () { openOverlay(q.get('open')); }, 300);
    if (q && q.get('scope')) switchScope(q.get('scope'));
    setInterval(function () { renderClock(new Date()); renderSky(new Date()); }, 5000);
    setInterval(function () { refreshWeather(false); renderWeather(); }, 60e3);
    document.addEventListener('visibilitychange', function () {
      precip.pause(document.hidden);
      if (!document.hidden) { renderAll(); refreshWeather(false); loadApps(); }
    });
  }

  init();
})();
