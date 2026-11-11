/* Weather and camera effects drawn over the scene: overcast, fog, rain, raindrops on the glass,
   lightning, lens flare and a soft vignette. */
(function (A) {
  'use strict';
  var U = A.U, TAU = U.TAU, L = A.cfg.layout;
  var PW = A.PW, PH = A.PH;
  var WL = L.waterline * PH, FS = L.farShore * PH;
  var i;

  function overcast(ctx, P, w) {
    var k = U.sstep(0.55, 1, w.cloud) * 0.9 + w.storm * 0.3;
    if (k < 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = U.rgba([128, 128, 128], U.clamp(k * 0.5, 0, 1)); ctx.fillRect(0, 0, PW, PH);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = U.rgba([165, 175, 192], U.clamp(k * 0.55, 0, 1)); ctx.fillRect(0, 0, PW, WL);
    ctx.fillStyle = U.rgba([120, 150, 172], U.clamp(k * 0.45, 0, 1)); ctx.fillRect(0, WL, PW, PH - WL);
    ctx.restore();
  }

  function fog(ctx, P, w) {
    if (w.fog < 0.02) return;
    var c = U.mix([226, 233, 240], [70, 80, 105], P.night * 0.8);
    var g = ctx.createLinearGradient(0, FS - PH * 0.45, 0, WL);
    g.addColorStop(0, U.rgba(c, 0)); g.addColorStop(0.75, U.rgba(c, w.fog * 0.7)); g.addColorStop(1, U.rgba(c, w.fog * 0.55));
    ctx.fillStyle = g; ctx.fillRect(0, 0, PW, WL);
    ctx.fillStyle = U.rgba(U.mix(c, [120, 190, 210], 0.5), w.fog * 0.18); ctx.fillRect(0, WL, PW, PH - WL);
  }

  /* rain streaks, with tiny splashes where they hit the water */
  var drops = [];
  for (i = 0; i < 320; i++) drops.push({ x: Math.random() * PW * 1.2, y: Math.random() * WL, len: U.rand(14, 28), v: U.rand(700, 1000) });
  var ticks = [];
  function rain(ctx, P, w, dt) {
    var n = Math.floor(w.rain * drops.length);
    if (n < 1) return;
    var slant = U.clamp(w.wind / 90, 0.05, 0.5);
    ctx.save();
    ctx.strokeStyle = U.rgba(U.mix([215, 230, 250], [140, 160, 200], P.night), 0.32 + 0.1 * w.rain);
    ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    ctx.beginPath();
    for (var k = 0; k < n; k++) {
      var d = drops[k];
      d.y += d.v * dt; d.x -= d.v * slant * dt;
      if (d.y > WL) {
        if (Math.random() < 0.35) ticks.push({ x: d.x, life: 0 });
        d.y = -d.len - Math.random() * 200; d.x = Math.random() * PW * 1.2;
      }
      ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.len * slant, d.y - d.len);
    }
    ctx.stroke();
    ctx.strokeStyle = U.rgba(U.WHITE, 0.45); ctx.lineWidth = 1;
    for (k = ticks.length - 1; k >= 0; k--) {
      var tk = ticks[k]; tk.life += dt;
      if (tk.life > 0.35) { ticks.splice(k, 1); continue; }
      var h = Math.sin(tk.life / 0.35 * Math.PI) * 7;
      ctx.beginPath(); ctx.moveTo(tk.x - 2, WL - h * 0.6); ctx.lineTo(tk.x, WL - h); ctx.lineTo(tk.x + 2, WL - h * 0.6); ctx.stroke();
    }
    if (ticks.length > 200) ticks.splice(0, ticks.length - 200);
    ctx.restore();
  }

  /* glossy raindrops sliding down the glass in front of the scene */
  var beads = [];
  for (i = 0; i < 40; i++) beads.push({ x: Math.random() * PW, y: Math.random() * PH, r: U.rand(4, 13), v: 0, wait: U.rand(0, 6), order: i });
  function glass(ctx, P, w, dt) {
    var n = w.rain * beads.length;
    if (n < 0.5) return;
    var vis = 0.5 + 0.5 * P.light;
    beads.forEach(function (b) {
      var a = U.clamp(n - b.order, 0, 1); if (a < 0.02) return;
      b.wait -= dt;
      if (b.wait <= 0) { b.v = b.r > 8 ? U.rand(30, 90) : 0; b.wait = U.rand(1, 5); }
      b.y += b.v * dt; b.v *= Math.pow(0.4, dt);
      if (b.y > PH + 20) { b.y = -20; b.x = Math.random() * PW; b.r = U.rand(4, 13); }
      var x = b.x, y = b.y, r = b.r;
      var g = ctx.createRadialGradient(x, y + r * 0.35, r * 0.1, x, y, r);
      g.addColorStop(0, U.rgba(U.WHITE, 0.22 * a * vis)); g.addColorStop(0.75, U.rgba([200, 230, 255], 0.08 * a)); g.addColorStop(1, U.rgba([0, 25, 50], 0.35 * a));
      ctx.fillStyle = g; U.circle(ctx, x, y, r); ctx.fill();
      ctx.fillStyle = U.rgba(U.WHITE, 0.75 * a * vis);
      ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.42, r * 0.3, r * 0.16, -0.6, 0, TAU); ctx.fill();
      ctx.strokeStyle = U.rgba(U.WHITE, 0.25 * a * vis); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0.3, Math.PI - 0.3); ctx.stroke();
    });
  }

  /* lightning */
  var flash = 0, bolt = null, boltLife = 0, stormTimer = 6, flicker = -1;
  function lightning(ctx, P, w, dt) {
    if (w.storm > 0.4) {
      stormTimer -= dt;
      if (stormTimer <= 0) {
        stormTimer = U.rand(7, 22); flash = 1; flicker = 0.12;
        if (Math.random() < 0.7) {
          var x = U.rand(0.25, 0.95) * PW, y = 0; bolt = [[x, y]];
          while (y < FS * 0.92) { y += U.rand(18, 45); x += U.rand(-28, 28); bolt.push([x, y]); }
          boltLife = 0.28;
        }
      }
    }
    if (flicker > 0) { flicker -= dt; if (flicker <= 0) flash = Math.max(flash, 0.7); }
    if (flash > 0.01) {
      ctx.fillStyle = U.rgba([235, 240, 255], flash * 0.4); ctx.fillRect(0, 0, PW, WL);
      ctx.fillStyle = U.rgba([200, 230, 255], flash * 0.15); ctx.fillRect(0, WL, PW, PH - WL);
      flash *= Math.pow(0.002, dt);
    }
    if (bolt && boltLife > 0) {
      boltLife -= dt;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round';
      [[9, 0.12], [3, 0.5], [1.2, 1]].forEach(function (s) {
        ctx.strokeStyle = U.rgba([220, 230, 255], s[1] * U.clamp(boltLife / 0.28, 0, 1)); ctx.lineWidth = s[0];
        ctx.beginPath(); bolt.forEach(function (p, k) { if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      });
      ctx.restore();
    }
  }

  /* lens flare from the sun */
  function flare(ctx, P, w, t) {
    var clear = (1 - U.sstep(0.35, 0.8, w.cloud)) * (1 - w.fog) * (1 - w.storm);
    if (A.platesOn) {
      // Use the sun painted into each plate; two plates mid-fade each get their own fading flare.
      var S = A.cfg.artSun || {}, strength = { day: 1, dawn: 0.55, sunset: 0.55 };
      [[P.plateA, 1 - P.plateT], [P.plateB, P.plateT]].forEach(function (pw) {
        var pos = S[pw[0]];
        if (pos && pw[1] > 0.01) flareAt(ctx, pos[0] * PW, pos[1] * PH, clear * pw[1] * (strength[pw[0]] || 0), t);
      });
      return;
    }
    if (!P.sunUp || P.sunY < 0.08) return;
    flareAt(ctx, U.lerp(PW * 0.06, PW * 0.94, P.sunX), FS - P.sunY * FS * 0.85, P.light * clear * U.sstep(0.08, 0.25, P.sunY), t);
  }
  function flareAt(ctx, x, y, amt, t) {
    if (amt < 0.02) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var g = ctx.createRadialGradient(x, y, 0, x, y, PH * 0.12);
    g.addColorStop(0, U.rgba(U.WHITE, 0.5 * amt)); g.addColorStop(1, U.rgba(U.WHITE, 0));
    ctx.fillStyle = g; U.circle(ctx, x, y, PH * 0.12); ctx.fill();
    for (var k = 0; k < 8; k++) {
      var ang = k / 8 * TAU + t * 0.02, len = PH * (k % 2 ? 0.06 : 0.11);
      ctx.strokeStyle = U.rgba(U.WHITE, 0.09 * amt); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); ctx.stroke();
    }
    var dx = PW / 2 - x, dy = PH / 2 - y;
    [[0.35, 0.025, [120, 220, 255]], [0.6, 0.012, [180, 255, 160]], [0.95, 0.05, [120, 180, 255]], [1.3, 0.02, [255, 220, 150]], [1.6, 0.07, [140, 200, 255]]].forEach(function (f) {
      var fx = x + dx * f[0] * 2, fy = y + dy * f[0] * 2, rr = PH * f[1];
      var fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, rr);
      fg.addColorStop(0, U.rgba(f[2], 0.16 * amt)); fg.addColorStop(0.75, U.rgba(f[2], 0.09 * amt)); fg.addColorStop(1, U.rgba(f[2], 0));
      ctx.fillStyle = fg; U.circle(ctx, fx, fy, rr); ctx.fill();
    });
    ctx.restore();
  }

  function vignette(ctx, W, H) {
    var g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, 'rgba(0,10,30,0)'); g.addColorStop(1, 'rgba(0,10,30,0.28)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  A.Effects = {
    weather: function (ctx, P, w, t, dt) { overcast(ctx, P, w); fog(ctx, P, w); rain(ctx, P, w, dt); lightning(ctx, P, w, dt); },
    lens: function (ctx, P, w, t, dt) { flare(ctx, P, w, t); glass(ctx, P, w, dt); },
    vignette: vignette
  };
})(window.Aero);
