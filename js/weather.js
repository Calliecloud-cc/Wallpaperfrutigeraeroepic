/* Live weather from Open-Meteo, eased smoothly so the scene never jumps. */
(function (A) {
  'use strict';
  var U = A.U, C = A.cfg.weather || {};
  var PRESETS = {
    clear:   { cloud: 0.12, rain: 0, storm: 0, fog: 0 },
    partly:  { cloud: 0.45, rain: 0, storm: 0, fog: 0 },
    cloudy:  { cloud: 0.9, rain: 0, storm: 0, fog: 0 },
    fog:     { cloud: 0.7, rain: 0, storm: 0, fog: 0.85 },
    drizzle: { cloud: 0.7, rain: 0.3, storm: 0, fog: 0.1 },
    showers: { cloud: 0.55, rain: 0.6, storm: 0, fog: 0 },
    rain:    { cloud: 0.95, rain: 0.8, storm: 0, fog: 0.1 },
    storm:   { cloud: 1, rain: 1, storm: 1, fog: 0 }
  };
  var NUM = ['cloud', 'rain', 'storm', 'fog', 'wind'];
  var CACHE = 'aero-weather-v1';

  function make(kind, extra) {
    var w = { kind: kind, cloud: 0, rain: 0, storm: 0, fog: 0, wind: 12, code: -1 };
    var p = PRESETS[kind] || {};
    Object.keys(p).forEach(function (k) { w[k] = p[k]; });
    if (extra) Object.keys(extra).forEach(function (k) { w[k] = extra[k]; });
    return w;
  }

  var W = { cur: make('clear'), target: make('clear'), source: 'default', updated: 0 };

  // WMO weather codes → scene settings.
  function fromApi(c) {
    var code = c.weather_code | 0;
    var cover = (c.cloud_cover == null ? 30 : c.cloud_cover) / 100;
    var precip = c.precipitation || 0;
    var kind = 'clear';
    if (code === 2) kind = 'partly';
    else if (code === 3) kind = 'cloudy';
    else if (code === 45 || code === 48) kind = 'fog';
    else if (code >= 51 && code <= 57) kind = 'drizzle';
    else if (code >= 80 && code <= 82) kind = 'showers';
    else if ((code >= 61 && code <= 67) || (code >= 71 && code <= 77) || code === 85 || code === 86) kind = 'rain';
    else if (code >= 95) kind = 'storm';
    else if (cover > 0.5) kind = 'partly';
    var w = make(kind, { wind: c.wind_speed_10m || 12, code: code });
    w.cloud = U.clamp(w.cloud * 0.5 + cover * 0.5, 0, 1);
    if (code === 61 || code === 80) w.rain = 0.5;
    if (code === 65 || code === 82) w.rain = 1;
    if (precip > 0 && w.rain === 0) w.rain = Math.min(0.35, precip / 2);
    return w;
  }

  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE) || 'null');
      if (c && Date.now() - c.at < 3 * 3600 * 1000) return c.w;
    } catch (e) { /* storage unavailable */ }
    return null;
  }
  function writeCache(w) { try { localStorage.setItem(CACHE, JSON.stringify({ at: Date.now(), w: w })); } catch (e) { /* ignore */ } }

  function refresh() {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + C.latitude + '&longitude=' + C.longitude +
      '&current=weather_code,cloud_cover,precipitation,wind_speed_10m&timezone=auto';
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { W.target = fromApi(j.current || {}); W.source = 'live'; W.updated = Date.now(); writeCache(W.target); })
      .catch(function () { if (W.source !== 'cache') W.source = 'offline'; });
  }

  function start(override) {
    if (override && PRESETS[override]) {
      W.target = make(override); W.cur = make(override); W.source = 'override'; return;
    }
    if (!C.enabled) { W.source = 'disabled'; return; }
    var c = readCache();
    if (c) { W.target = c; W.cur = make(c.kind, c); W.source = 'cache'; }
    refresh();
    setInterval(refresh, Math.max(5, C.refreshMinutes || 15) * 60000);
  }

  function update(dt) {
    var k = Math.min(1, dt / 25);
    NUM.forEach(function (key) { W.cur[key] += (W.target[key] - W.cur[key]) * k; });
    W.cur.kind = W.target.kind; W.cur.code = W.target.code;
  }

  A.Weather = { W: W, start: start, update: update, PRESETS: PRESETS };
})(window.Aero);
