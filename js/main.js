/* Main loop: sizing, artwork loading, time, layer order, frame-rate limits and the debug readout.

   Handy URL options for testing:
     ?debug          show the clock, phase and weather in a corner
     ?hour=19.4      freeze the clock at 7:24 pm (Sydney)
     ?speed=720      time-lapse (720 = a whole day in 2 minutes)
     ?weather=storm  force weather: clear, partly, cloudy, fog, drizzle, showers, rain, storm
     ?fps=60         override the frame rate
     ?noart          ignore the artwork files and use the painted stand-in */
(function (A) {
  'use strict';
  var U = A.U, C = A.cfg, PW = A.PW, PH = A.PH;
  var q = new URLSearchParams(location.search);
  var forcedHour = q.has('hour') ? parseFloat(q.get('hour')) : null;
  var speed = q.has('speed') ? parseFloat(q.get('speed')) || 1 : 1;
  var baseFps = parseFloat(q.get('fps')) || C.fps || 30, fps = baseFps;
  var debug = q.has('debug');

  var canvas = document.getElementById('wall');
  var ctx = canvas.getContext('2d', { alpha: false });
  var layer = document.createElement('canvas');
  var lctx = layer.getContext('2d');
  var W = 0, H = 0, dpr = 1, k = 1, ox = 0, oy = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, C.maxPixelRatio || 1.5);
    W = window.innerWidth || 1280; H = window.innerHeight || 720;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    layer.width = canvas.width; layer.height = canvas.height;
    k = Math.max(W / PW, H / PH); ox = (W - PW * k) / 2; oy = (H - PH * k) / 2;
  }
  function plateSpace(c) { c.setTransform(dpr * k, 0, 0, dpr * k, dpr * ox, dpr * oy); }
  window.addEventListener('resize', resize);
  resize();

  // Draw a group into the scratch layer, optionally post-process it (tint, mask), then stamp it on.
  function withLayer(draw, post) {
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.globalCompositeOperation = 'source-over'; lctx.globalAlpha = 1;
    lctx.clearRect(0, 0, layer.width, layer.height);
    plateSpace(lctx);
    draw(lctx);
    if (post) { lctx.save(); post(lctx); lctx.restore(); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(layer, 0, 0); ctx.restore();
  }

  // Artwork: plates are used only when all four load; sprites are used one by one.
  var plates = null, sprites = {};
  if (!q.has('noart')) {
    var pnames = Object.keys(C.art.plates);
    Promise.all(pnames.map(function (n) { return U.loadImage(C.art.plates[n]); })).then(function (imgs) {
      if (imgs.every(Boolean)) { plates = {}; pnames.forEach(function (n, j) { plates[n] = imgs[j]; }); }
    });
    var snames = Object.keys(C.art.sprites);
    Promise.all(snames.map(function (n) { return U.loadImage(C.art.sprites[n]); })).then(function (imgs) {
      snames.forEach(function (n, j) { if (imgs[j]) sprites[n] = imgs[j]; });
    });
  }
  A.Actors.init(sprites);

  A.Weather.start(q.get('weather'));

  // Lower the frame rate on battery where the browser can tell (Lively/Chromium; Plash handles Macs itself).
  if (navigator.getBattery) {
    navigator.getBattery().then(function (b) {
      function upd() { fps = b.charging ? baseFps : Math.min(baseFps, C.batteryFps || 15); }
      b.addEventListener('chargingchange', upd); upd();
    }).catch(function () { /* not available */ });
  }

  var dbg = document.getElementById('debug');
  if (debug) dbg.hidden = false;
  function fmt(h) { var hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }

  var startHour = forcedHour != null ? forcedHour : A.Time.zoneHour(new Date());
  var last = performance.now(), t = 0, dbgTimer = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    var elapsed = (now - last) / 1000;
    if (elapsed < 1 / fps - 0.004) return;
    last = now;
    var dt = Math.min(elapsed, 0.1);
    t += dt;

    var hour;
    if (forcedHour != null && speed === 1) hour = forcedHour;
    else if (speed !== 1) hour = (startHour + t * speed / 3600) % 24;
    else hour = A.Time.zoneHour(new Date());

    A.Weather.update(dt);
    var w = A.Weather.W.cur;
    var P = A.Time.palette(hour);
    A.platesOn = !!plates;

    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    plateSpace(ctx);
    if (plates) {
      ctx.drawImage(plates[P.plateA], 0, 0, PW, PH);
      if (P.plateT > 0.001 && P.plateB !== P.plateA) { ctx.globalAlpha = P.plateT; ctx.drawImage(plates[P.plateB], 0, 0, PW, PH); ctx.globalAlpha = 1; }
    } else {
      A.Scene.background(ctx, P, w);
    }
    A.Actors.sky(ctx, P, w, t, dt, withLayer);
    A.Actors.underwater(ctx, P, w, t, dt, withLayer);
    A.Actors.surface(ctx, P, w, t, dt, withLayer);
    A.Effects.weather(ctx, P, w, t, dt);
    A.Effects.lens(ctx, P, w, t, dt);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    A.Effects.vignette(ctx, W, H);

    if (debug && (dbgTimer -= dt) <= 0) {
      dbgTimer = 0.5;
      var ws = A.Weather.W;
      dbg.textContent = 'Sydney ' + fmt(hour) + '  look: ' + P.look + '\n' +
        'art: ' + (plates ? P.plateA + (P.plateT > 0.01 ? ' → ' + P.plateB + ' ' + Math.round(P.plateT * 100) + '%' : '') : 'painted stand-in') +
        '  sprites: ' + (Object.keys(sprites).length || 'none') + '\n' +
        'weather: ' + w.kind + ' (' + ws.source + ')  cloud ' + w.cloud.toFixed(2) + '  rain ' + w.rain.toFixed(2) + '  wind ' + Math.round(w.wind) + ' km/h\n' +
        'fps cap ' + fps + '  screen ' + W + '×' + H + ' @' + dpr;
    }
  }
  requestAnimationFrame(frame);

  // Press D for the debug readout, J to make the dolphins jump (handy when previewing in a browser).
  window.addEventListener('keydown', function (e) {
    if (e.key === 'd' || e.key === 'D') { debug = !debug; dbg.hidden = !debug; }
    if (e.key === 'j' || e.key === 'J') A.Actors.jumpNow();
  });
})(window.Aero);
