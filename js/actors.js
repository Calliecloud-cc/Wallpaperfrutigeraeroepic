/* Everything that moves: sky life, the globe, the rainbow, sea life, dolphins and the water surface.
   Uses AI sprites when they exist and draws its own stand-ins when they don't. */
(function (A) {
  'use strict';
  var U = A.U, TAU = U.TAU, L = A.cfg.layout, CFG = A.cfg;
  var PW = A.PW, PH = A.PH;
  var WL = L.waterline * PH, FS = L.farShore * PH;
  var R = U.rng(2024), i;
  var art = {};            // sprites, filled by init()
  var rainbowAmt = 0;

  /* ---------------------------------------------------------------- helpers */
  function sprite(ctx, img, len) {
    var ar = img.height / img.width;
    ctx.drawImage(img, -len / 2, -len * ar / 2, len, len * ar);
  }
  function between(range) { return U.rand(range[0], range[1]); }

  /* ---------------------------------------------------------------- sky: stars and shooting stars */
  var stars = [];
  for (i = 0; i < 170; i++) stars.push({ x: R() * PW, y: R() * FS * 0.92, r: 0.5 + R() * 1.4, p: R() * TAU, s: 0.6 + R() * 1.6 });
  var shooting = null, shootTimer = 12;

  function drawStars(ctx, P, w, t, dt) {
    var a = P.stars * (1 - w.cloud * 0.85);
    if (a < 0.02) { shooting = null; return; }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var k = 0; k < stars.length; k++) {
      var s = stars[k], tw = 0.35 + 0.65 * Math.pow(Math.sin(t * s.s + s.p) * 0.5 + 0.5, 2);
      ctx.fillStyle = U.rgba(U.WHITE, a * tw);
      U.circle(ctx, s.x, s.y, s.r); ctx.fill();
    }
    shootTimer -= dt;
    if (!shooting && shootTimer <= 0 && a > 0.5) {
      shooting = { x: U.rand(0.2, 0.9) * PW, y: U.rand(0.04, 0.25) * PH, vx: -U.rand(380, 520), vy: U.rand(140, 220), life: 0 };
      shootTimer = U.rand(18, 50);
    }
    if (shooting) {
      shooting.life += dt; shooting.x += shooting.vx * dt; shooting.y += shooting.vy * dt;
      var fade = Math.sin(Math.min(1, shooting.life / 0.9) * Math.PI) * a;
      var tx = shooting.x - shooting.vx * 0.18, ty = shooting.y - shooting.vy * 0.18;
      var g = ctx.createLinearGradient(shooting.x, shooting.y, tx, ty);
      g.addColorStop(0, U.rgba(U.WHITE, fade)); g.addColorStop(1, U.rgba([180, 220, 255], 0));
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(shooting.x, shooting.y); ctx.lineTo(tx, ty); ctx.stroke();
      if (shooting.life > 0.9) shooting = null;
    }
    ctx.restore();
  }

  /* ---------------------------------------------------------------- rainbow */
  var BANDS = [[148, 60, 211], [80, 80, 255], [0, 170, 255], [40, 220, 90], [255, 238, 40], [255, 150, 20], [255, 50, 50]];
  function rainbowRing(l, cx, cy, r, wd, rev, a) {
    var cols = rev ? BANDS.slice().reverse() : BANDS;
    var g = l.createRadialGradient(cx, cy, r - wd, cx, cy, r);
    g.addColorStop(0, U.rgba(cols[0], 0));
    for (var k = 0; k < cols.length; k++) g.addColorStop(0.08 + k * 0.14, U.rgba(cols[k], a));
    g.addColorStop(1, U.rgba(cols[cols.length - 1], 0));
    l.fillStyle = g; U.circle(l, cx, cy, r); l.fill();
  }
  function drawRainbow(ctx, P, w, dt, withLayer) {
    var target = 0;
    if (P.sunUp && P.sunY > 0.05) {
      var shower = w.rain > 0.05 ? U.clamp(1 - (w.cloud - 0.5) / 0.5, 0, 1) : 0;
      target = (0.4 + 0.6 * shower) * (1 - U.sstep(0.6, 0.97, w.cloud) * 0.85) * U.sstep(0.05, 0.22, P.sunY) * (1 - w.storm) * (1 - w.fog * 0.7);
    }
    rainbowAmt += (target - rainbowAmt) * Math.min(1, dt / 4);
    if (rainbowAmt < 0.02) return;
    var rb = L.rainbow, cx = rb.x * PW, cy = rb.y * PH, r = rb.r * PH, wd = rb.width * PH, amt = rainbowAmt;
    withLayer(function (l) {
      var ig = l.createRadialGradient(cx, cy, r * 0.4, cx, cy, r - wd);
      ig.addColorStop(0, 'rgba(255,255,255,0)'); ig.addColorStop(1, 'rgba(255,255,255,0.18)');
      l.fillStyle = ig; U.circle(l, cx, cy, r - wd); l.fill();
      rainbowRing(l, cx, cy, r, wd, false, 0.85);
      rainbowRing(l, cx, cy, r * 1.24, wd * 0.9, true, 0.3);
    }, function (l) {
      l.globalCompositeOperation = 'destination-in';
      var g = l.createLinearGradient(0, cy - r * 1.3, 0, FS);
      g.addColorStop(0, 'rgba(0,0,0,' + (amt * 0.55).toFixed(3) + ')');
      g.addColorStop(0.75, 'rgba(0,0,0,' + (amt * 0.5).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      l.fillStyle = g; l.fillRect(0, 0, PW, PH);
    });
  }

  /* ---------------------------------------------------------------- the glossy globe */
  var conts = [], gclouds = [];
  (function () {
    var r = U.rng(66), j, k;
    for (j = 0; j < 7; j++) { var c = { lon: r(), lat: (r() - 0.5) * 1.3, b: [] }; for (k = 0; k < 7; k++) c.b.push({ dl: (r() - 0.5) * 0.1, da: (r() - 0.5) * 0.45, r: 0.08 + r() * 0.12 }); conts.push(c); }
    for (j = 0; j < 16; j++) gclouds.push({ lon: r(), lat: (r() - 0.5) * 1.5, r: 0.05 + r() * 0.09 });
  })();

  function orbitRing(ctx, cx, cy, Rg, t, P, front) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.35); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    var rx = Rg * 1.6, ry = Rg * 0.32, a0 = front ? 0 : Math.PI, a1 = front ? Math.PI : TAU;
    var col = U.mix([150, 240, 255], [255, 220, 160], P.warm), vis = 0.45 + 0.55 * (1 - P.night * 0.5);
    [[Rg * 0.09, 0.08], [Rg * 0.035, 0.28], [Rg * 0.012, 0.85]].forEach(function (l) {
      ctx.strokeStyle = U.rgba(col, l[1] * vis * (front ? 1 : 0.45)); ctx.lineWidth = l[0];
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, a0, a1); ctx.stroke();
    });
    var ang = (t * 0.35) % TAU, inFront = Math.sin(ang) > 0;
    if (inFront === front) U.sparkle(ctx, rx * Math.cos(ang), ry * Math.sin(ang), Rg * 0.12, vis);
    ctx.restore();
  }

  function globeProc(ctx, cx, cy, Rg, t, P) {
    var rot = t * 0.025 * TAU;
    var ag = ctx.createRadialGradient(cx, cy, Rg * 0.95, cx, cy, Rg * 1.3);
    ag.addColorStop(0, U.rgba([140, 225, 255], 0.55 * (0.45 + 0.55 * P.light))); ag.addColorStop(1, U.rgba([140, 225, 255], 0));
    ctx.fillStyle = ag; U.circle(ctx, cx, cy, Rg * 1.3); ctx.fill();
    ctx.save(); U.circle(ctx, cx, cy, Rg); ctx.clip();
    var og = ctx.createRadialGradient(cx - Rg * 0.3, cy - Rg * 0.3, 0, cx, cy, Rg);
    og.addColorStop(0, 'rgb(96,212,255)'); og.addColorStop(0.6, 'rgb(22,124,230)'); og.addColorStop(1, 'rgb(6,48,148)');
    ctx.fillStyle = og; ctx.fillRect(cx - Rg, cy - Rg, Rg * 2, Rg * 2);
    var lit = (Math.cos((P.hour - 12) / 24 * TAU) + 1) / 2, sx = cx + Rg * (-1.5 + 3 * lit), cities = [];
    conts.forEach(function (c) {
      c.b.forEach(function (b) {
        var lon = (c.lon + b.dl) * TAU + rot, lat = c.lat + b.da;
        if (Math.cos(lon) * Math.cos(lat) <= 0.02) return;
        var x = cx + Rg * Math.cos(lat) * Math.sin(lon), y = cy - Rg * Math.sin(lat);
        var rx = Math.max(0.5, Rg * b.r * Math.abs(Math.cos(lon))), ry = Math.max(0.5, Rg * b.r * (0.55 + 0.45 * Math.cos(lat)));
        var g = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 0, x, y, Math.max(rx, ry));
        g.addColorStop(0, 'rgb(150,226,96)'); g.addColorStop(1, 'rgb(52,150,58)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
        if (x > sx) cities.push([x, y, U.clamp((x - sx) / (Rg * 0.3), 0, 1)]);
      });
    });
    gclouds.forEach(function (c) {
      var lon = c.lon * TAU + rot * 1.35, lat = c.lat;
      if (Math.cos(lon) * Math.cos(lat) <= 0.02) return;
      var x = cx + Rg * Math.cos(lat) * Math.sin(lon), y = cy - Rg * Math.sin(lat);
      var rx = Math.max(0.5, Rg * c.r * Math.abs(Math.cos(lon)) * 1.6), ry = Math.max(0.5, Rg * c.r * 0.6);
      var g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      g.addColorStop(0, U.rgba(U.WHITE, 0.7)); g.addColorStop(1, U.rgba(U.WHITE, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
    });
    var sg = ctx.createLinearGradient(sx - Rg * 0.35, 0, sx + Rg * 0.35, 0);
    sg.addColorStop(0, 'rgba(2,8,30,0)'); sg.addColorStop(1, 'rgba(2,8,30,0.8)');
    ctx.fillStyle = sg; ctx.fillRect(cx - Rg, cy - Rg, Rg * 2, Rg * 2);
    ctx.globalCompositeOperation = 'lighter';
    cities.forEach(function (c) { ctx.fillStyle = U.rgba([255, 210, 120], 0.8 * c[2]); U.circle(ctx, c[0], c[1], Math.max(0.8, Rg * 0.012)); ctx.fill(); });
    ctx.globalCompositeOperation = 'source-over';
    var hg = ctx.createRadialGradient(cx - Rg * 0.35, cy - Rg * 0.5, 0, cx - Rg * 0.35, cy - Rg * 0.5, Rg * 0.75);
    hg.addColorStop(0, U.rgba(U.WHITE, 0.6)); hg.addColorStop(1, U.rgba(U.WHITE, 0));
    ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(cx - Rg * 0.3, cy - Rg * 0.48, Rg * 0.62, Rg * 0.36, -0.35, 0, TAU); ctx.fill();
    ctx.restore();
  }

  var globeSparks = U.points(U.rng(9), 6, -1.8, 1.8, -1.4, 1.4);
  function drawGlobe(ctx, P, t) {
    var g = L.globe, Rg = g.r * PH, cx = g.x * PW, cy = g.y * PH + Math.sin(t * 0.35) * PH * 0.006;
    orbitRing(ctx, cx, cy, Rg, t, P, false);
    if (art.globe) {
      var s = Rg * 2.3;
      ctx.drawImage(art.globe, cx - s / 2, cy - s / 2, s, s);
      if (P.night > 0.05) { ctx.fillStyle = U.rgba([5, 12, 40], P.night * 0.5); U.circle(ctx, cx, cy, Rg); ctx.fill(); }
    } else {
      globeProc(ctx, cx, cy, Rg, t, P);
    }
    orbitRing(ctx, cx, cy, Rg, t, P, true);
    globeSparks.forEach(function (s) {
      U.sparkle(ctx, cx + s.x * Rg, cy + s.y * Rg, Rg * 0.1, Math.max(0, Math.sin(t * 0.8 * s.s + s.p)) * 0.6);
    });
  }

  /* ---------------------------------------------------------------- clouds */
  var cloudImgs = [0, 1, 2, 3, 4].map(function (k) { return U.cloudBitmap(11 + k * 7); });
  var clouds = [];
  for (i = 0; i < 10; i++) clouds.push({ img: cloudImgs[i % 5], x: R() * PW * 1.4 - 300, y: (0.04 + R() * 0.26) * PH, s: 0.4 + R() * 0.75, v: 3 + R() * 6, rank: (i * 7) % 10 });
  clouds.sort(function (a, b) { return a.s - b.s; });

  function drawClouds(ctx, P, w, dt, withLayer) {
    // The artwork has its own clouds, so with it on, drifting clouds stay small, high and over the
    // open sky on the left (fading out before the towers), and only build up as the weather clouds over.
    var art = A.platesOn;
    var nf = art ? 1 + 8 * U.clamp((w.cloud - 0.2) / 0.8, 0, 1) : 3 + 7 * w.cloud, speed = 0.6 + w.wind / 22;
    var fadeX0 = (A.cfg.layout.cloudFadeX || [0.4, 0.55])[0] * PW, fadeX1 = (A.cfg.layout.cloudFadeX || [0.4, 0.55])[1] * PW;
    withLayer(function (l) {
      clouds.forEach(function (c) {
        c.x += c.v * speed * dt;
        var sc = art ? c.s * 0.7 : c.s, cw = 460 * sc, ch = 230 * sc, y = art ? c.y * 0.6 : c.y;
        var maxX = art ? fadeX1 : PW + 40;
        if (c.x > maxX) { c.x = -cw - U.rand(0, 200); c.y = (0.04 + Math.random() * 0.26) * PH; }
        var a = U.clamp(nf - c.rank, 0, 1);
        if (a < 0.01) return;
        l.globalAlpha = a * (art ? 0.8 : 0.85 + 0.15 * w.cloud);
        l.drawImage(c.img, c.x, y - ch / 2, cw, ch);
      });
      l.globalAlpha = 1;
    }, function (l) {
      if (art) {
        l.globalCompositeOperation = 'destination-out';
        var m = l.createLinearGradient(fadeX0, 0, fadeX1, 0);
        m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, 'rgba(0,0,0,1)');
        l.fillStyle = m; l.fillRect(fadeX0, 0, PW - fadeX0, FS);
      }
      l.globalCompositeOperation = 'source-atop';
      if (P.warm > 0.02) {
        var g = l.createLinearGradient(0, 0, 0, FS);
        g.addColorStop(0, U.rgba(U.mix(P.glow, [255, 170, 150], 0.3), P.warm * 0.25));
        g.addColorStop(1, U.rgba(U.mix(P.glow, [255, 130, 90], 0.5), P.warm * 0.55));
        l.fillStyle = g; l.fillRect(0, 0, PW, FS);
      }
      if (P.night > 0.02) { l.fillStyle = U.rgba([24, 34, 72], P.night * 0.8); l.fillRect(0, 0, PW, FS); }
      var grey = U.sstep(0.5, 1, w.cloud) * 0.45 + w.storm * 0.3;
      if (grey > 0.02) { l.fillStyle = U.rgba([118, 126, 140], grey); l.fillRect(0, 0, PW, FS); }
    });
  }

  /* ---------------------------------------------------------------- birds, turbines, butterflies, fireflies */
  var flock = null, flockTimer = 6;
  function drawBirds(ctx, P, w, t, dt) {
    if (!flock) {
      flockTimer -= dt;
      if (flockTimer <= 0) {
        flockTimer = U.rand(25, 60);
        if (P.light > 0.45 && w.storm < 0.3 && w.rain < 0.7) {
          var dir = Math.random() < 0.5 ? 1 : -1, n = 3 + Math.floor(Math.random() * 5), m = [];
          for (var k = 0; k < n; k++) m.push({ dx: k * U.rand(16, 30), dy: U.rand(-24, 24), p: Math.random() * TAU, s: U.rand(6, 10) });
          flock = { dir: dir, x: dir > 0 ? -60 : PW + 60, y: U.rand(0.1, 0.32) * PH, v: U.rand(40, 65), m: m };
        }
      }
      return;
    }
    flock.x += flock.dir * flock.v * dt;
    if (flock.x < -260 || flock.x > PW + 260) { flock = null; return; }
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = U.rgba(U.mix([60, 72, 90], P.top, 0.2), 0.85);
    flock.m.forEach(function (b) {
      var x = flock.x - flock.dir * b.dx, y = flock.y + b.dy + Math.sin(t * 0.8 + b.p) * 4, s = b.s, f = Math.sin(t * 7 + b.p);
      ctx.lineWidth = Math.max(1, s * 0.18);
      ctx.beginPath(); ctx.moveTo(x - s, y + f * s * 0.35);
      ctx.quadraticCurveTo(x - s * 0.45, y - s * 0.4, x, y);
      ctx.quadraticCurveTo(x + s * 0.45, y - s * 0.4, x + s, y + f * s * 0.35);
      ctx.stroke();
    });
    ctx.restore();
  }

  var turbineAng = L.turbines.map(function (_, k) { return k * 1.7; });
  function drawTurbines(ctx, P, w, t, dt) {
    var col = U.rgba(U.mix(U.shade('#ffffff', P), P.bot, 0.18));
    L.turbines.forEach(function (tb, k) {
      turbineAng[k] += dt * (0.5 + w.wind / 25) * (0.85 + k * 0.07);
      var x = tb.x * PW, y = tb.y * PH, s = tb.h * PH;
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - s * 0.018, y); ctx.lineTo(x - s * 0.008, y - s); ctx.lineTo(x + s * 0.008, y - s); ctx.lineTo(x + s * 0.018, y); ctx.closePath(); ctx.fill();
      for (var b = 0; b < 3; b++) {
        ctx.save(); ctx.translate(x, y - s); ctx.rotate(turbineAng[k] + b * TAU / 3);
        ctx.beginPath(); ctx.ellipse(0, -s * 0.24, s * 0.022, s * 0.25, 0, 0, TAU); ctx.fill(); ctx.restore();
      }
      U.circle(ctx, x, y - s, s * 0.03); ctx.fill();
      if (P.night > 0.1) {
        var bl = Math.max(0, Math.sin(t * 2.2 + k));
        ctx.fillStyle = U.rgba([255, 60, 60], P.night * bl); U.circle(ctx, x, y - s - s * 0.03, s * 0.025); ctx.fill();
      }
    });
  }

  function butterfly(ctx, x, y, s, t, a) {
    if (a < 0.03) return;
    var flap = 0.22 + 0.78 * Math.abs(Math.cos(t * 11));
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.3); ctx.globalAlpha = a;
    [-1, 1].forEach(function (side) {
      ctx.save(); ctx.scale(side * flap, 1);
      var g = ctx.createLinearGradient(0, -s, s, s);
      g.addColorStop(0, '#c4f6ff'); g.addColorStop(0.5, '#1aa6ff'); g.addColorStop(1, '#0a3fbf');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(s * 0.55, -s * 0.35, s * 0.6, s * 0.42, -0.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(s * 0.4, s * 0.3, s * 0.38, s * 0.3, 0.5, 0, TAU); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = '#10233a'; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.08, s * 0.45, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  var fireflies = U.points(U.rng(31), 26, 0.02, 0.45, L.farShore - 0.08, L.farShore - 0.005);
  var pollen = U.points(U.rng(32), 18, 0.05, 0.6, 0.3, 0.5);
  function drawShoreLife(ctx, P, w, t) {
    var day = U.clamp((P.light - 0.4) / 0.5, 0, 1) * (1 - w.rain) * (1 - w.storm);
    butterfly(ctx, PW * (0.42 + 0.14 * Math.sin(t * 0.11)), PH * (0.47 + 0.03 * Math.sin(t * 0.37) + 0.01 * Math.sin(t * 1.3)), 8, t, day);
    butterfly(ctx, PW * (0.3 + 0.1 * Math.sin(t * 0.09 + 2)), PH * (0.44 + 0.03 * Math.sin(t * 0.31 + 1)), 6.5, t + 0.37, day * 0.9);
    U.motes(ctx, pollen, t, day * 0.35, [255, 255, 235], 4, PW, PH);
    U.motes(ctx, fireflies, t, P.night * (1 - w.rain * 0.8), [220, 255, 120], 6, PW, PH);
  }

  /* ---------------------------------------------------------------- sea life */
  var KINDS = [
    { name: 'clownfish', len: [40, 54], cols: ['#ff8a1f', '#e85200'] },
    { name: 'bluetang', len: [56, 76], cols: ['#2f7dff', '#123fb8'] },
    { name: 'yellowtang', len: [46, 62], cols: ['#ffe23a', '#f0b000'] },
    { name: 'angelfish', len: [56, 74], cols: ['#fff6d8', '#1b1b1b'] }
  ];

  function fishProc(ctx, len, kind, t, P) {
    var s = len / 2.4, K = KINDS[kind];
    var c1 = U.shade(K.cols[0], P), c2 = U.shade(K.cols[1], P);
    var wag = Math.sin(t * 9) * 0.28;
    if (kind === 3) {
      ctx.fillStyle = U.rgba(U.shade('#f5d23a', P));
      ctx.beginPath(); ctx.moveTo(-s * 0.55, 0); ctx.lineTo(-s * 1.0, -s * 0.3 + wag * s * 0.2); ctx.lineTo(-s * 1.0, s * 0.3 + wag * s * 0.2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = U.rgba(U.shade('#f4f4f0', P)); ctx.lineWidth = Math.max(1, s * 0.06); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.6); ctx.quadraticCurveTo(-s * 0.3, -s * 1.3, -s * 1.1 + wag * s * 0.3, -s * 1.15); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.7, s * 0.68, 0, 0, TAU);
      ctx.fillStyle = U.rgba(c1); ctx.fill();
      ctx.save(); ctx.clip();
      ctx.fillStyle = U.rgba(U.shade('#151515', P)); ctx.fillRect(-s * 0.05, -s, s * 0.32, s * 2); ctx.fillRect(-s * 0.7, -s, s * 0.25, s * 2);
      ctx.fillStyle = U.rgba(U.shade('#f7d038', P)); ctx.fillRect(-s * 0.45, -s, s * 0.3, s * 2);
      ctx.restore();
      ctx.fillStyle = U.rgba(U.WHITE, 0.95); U.circle(ctx, s * 0.42, -s * 0.12, s * 0.09); ctx.fill();
      ctx.fillStyle = U.rgba([10, 26, 42]); U.circle(ctx, s * 0.44, -s * 0.12, s * 0.05); ctx.fill();
      return;
    }
    ctx.fillStyle = U.rgba(kind === 1 ? U.shade('#ffd23a', P) : c2);
    ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.lineTo(-s * 1.38, -s * 0.46 + wag * s * 0.3); ctx.lineTo(-s * 1.38, s * 0.46 + wag * s * 0.3); ctx.closePath(); ctx.fill();
    var g = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.5);
    g.addColorStop(0, U.rgba(U.mix(c1, U.WHITE, 0.25))); g.addColorStop(1, U.rgba(c2));
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, s, s * (kind === 2 ? 0.62 : 0.5), 0, 0, TAU); ctx.fill();
    if (kind === 0) {
      ctx.save(); ctx.clip(); ctx.fillStyle = U.rgba(U.shade('#ffffff', P), 0.95);
      [-0.35, 0.25].forEach(function (k) { ctx.fillRect(s * k - s * 0.09, -s, s * 0.18, s * 2); });
      ctx.restore();
    }
    ctx.fillStyle = U.rgba(U.WHITE, 0.95); U.circle(ctx, s * 0.58, -s * 0.1, s * 0.12); ctx.fill();
    ctx.fillStyle = U.rgba([10, 26, 42]); U.circle(ctx, s * 0.62, -s * 0.1, s * 0.065); ctx.fill();
    ctx.fillStyle = U.rgba(U.WHITE, 0.35 * P.light); ctx.beginPath(); ctx.ellipse(s * 0.1, -s * 0.26, s * 0.55, s * 0.1, 0, 0, TAU); ctx.fill();
  }

  function newFish(f, initial) {
    f.kind = Math.floor(Math.random() * KINDS.length);
    f.len = between(KINDS[f.kind].len);
    f.dir = Math.random() < 0.5 ? 1 : -1;
    f.y = between(L.fishBand) * PH;
    f.v = U.rand(18, 42) * (f.len / 60);
    f.p = Math.random() * TAU;
    f.x = initial ? U.rand(0, PW) : (f.dir > 0 ? -f.len - U.rand(0, 300) : PW + f.len + U.rand(0, 300));
  }
  var fishes = []; for (i = 0; i < 12; i++) { var nf = {}; newFish(nf, true); fishes.push(nf); }

  var school = { dir: 1, x: -200, y: 0.7 * PH, v: 30, wait: 3, fish: [] };
  for (i = 0; i < 22; i++) { var a = R() * TAU, rr = Math.sqrt(R()); school.fish.push({ ox: Math.cos(a) * rr * 80, oy: Math.sin(a) * rr * 30, p: R() * TAU, s: 6 + R() * 3 }); }
  function updSchool(dt) {
    if (school.wait > 0) {
      school.wait -= dt;
      if (school.wait <= 0) { school.dir = Math.random() < 0.5 ? 1 : -1; school.x = school.dir > 0 ? -150 : PW + 150; school.y = U.rand(0.64, 0.8) * PH; school.v = U.rand(35, 55); }
      return;
    }
    school.x += school.dir * school.v * dt;
    if (school.x < -220 || school.x > PW + 220) school.wait = U.rand(8, 25);
  }
  function drawSchool(ctx, P, t) {
    if (school.wait > 0) return;
    var body = U.rgba(U.shade('#c9d8e4', P)), tail = U.rgba(U.shade('#93a8b8', P)), hl = U.rgba(U.WHITE, 0.6 * P.light);
    school.fish.forEach(function (f) {
      var x = school.x + f.ox + Math.sin(t * 1.3 + f.p) * 6, y = school.y + f.oy + Math.sin(t * 0.6 + f.p) * 8 + Math.sin(t * 0.3) * 20, s = f.s;
      ctx.save(); ctx.translate(x, y); ctx.scale(school.dir, 1);
      ctx.fillStyle = tail; ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.lineTo(-s * 1.4, -s * 0.4); ctx.lineTo(-s * 1.4, s * 0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = hl; ctx.fillRect(-s * 0.6, -s * 0.08, s * 1.2, s * 0.08);
      ctx.restore();
    });
  }

  function turtleProc(ctx, len, t, P) {
    var s = len / 2, pad = Math.sin(t * 2.2);
    var fl = U.rgba(U.shade('#7f9a5a', P));
    ctx.fillStyle = fl;
    [[s * 0.3, -s * 0.28, -0.9 + pad * 0.5, s * 0.45], [s * 0.3, s * 0.28, 0.9 - pad * 0.5, s * 0.45], [-s * 0.42, -s * 0.22, -2.4 - pad * 0.3, s * 0.22], [-s * 0.42, s * 0.22, 2.4 + pad * 0.3, s * 0.22]].forEach(function (f) {
      ctx.save(); ctx.translate(f[0], f[1]); ctx.rotate(f[2]); ctx.beginPath(); ctx.ellipse(f[3] * 0.5, 0, f[3] * 0.55, f[3] * 0.16, 0, 0, TAU); ctx.fill(); ctx.restore();
    });
    ctx.beginPath(); ctx.ellipse(s * 0.62, 0, s * 0.16, s * 0.12, 0, 0, TAU); ctx.fill();
    var g = ctx.createRadialGradient(-s * 0.1, -s * 0.15, 0, 0, 0, s * 0.5);
    g.addColorStop(0, U.rgba(U.shade('#b39a5a', P))); g.addColorStop(1, U.rgba(U.shade('#5a4a2a', P)));
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.34, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = U.rgba(U.shade('#3f3420', P), 0.6); ctx.lineWidth = 1.2;
    for (var k = -1; k <= 1; k++) { ctx.beginPath(); ctx.ellipse(k * s * 0.22, 0, s * 0.11, s * 0.14, 0, 0, TAU); ctx.stroke(); }
    ctx.fillStyle = U.rgba(U.WHITE, 0.3 * P.light); ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.18, s * 0.3, s * 0.07, 0, 0, TAU); ctx.fill();
  }
  var turtle = { active: false, wait: 20 };
  function updTurtle(dt) {
    if (!turtle.active) {
      turtle.wait -= dt;
      if (turtle.wait <= 0) { turtle.active = true; turtle.dir = Math.random() < 0.5 ? 1 : -1; turtle.x = turtle.dir > 0 ? -120 : PW + 120; turtle.y = U.rand(0.65, 0.74) * PH; turtle.v = U.rand(14, 20); turtle.len = U.rand(110, 140); }
      return;
    }
    turtle.x += turtle.dir * turtle.v * dt;
    if (turtle.x < -200 || turtle.x > PW + 200) { turtle.active = false; turtle.wait = U.rand(60, 140); }
  }

  function drawSeaLife(ctx, P, t, dt) {
    updSchool(dt); drawSchool(ctx, P, t);
    updTurtle(dt);
    if (turtle.active) {
      ctx.save(); ctx.translate(turtle.x, turtle.y + Math.sin(t * 0.5) * 6); ctx.scale(turtle.dir, 1); ctx.rotate(Math.sin(t * 0.4) * 0.05);
      if (art.turtle) sprite(ctx, art.turtle, turtle.len); else turtleProc(ctx, turtle.len, t, P);
      ctx.restore();
    }
    fishes.forEach(function (f) {
      f.x += f.dir * f.v * dt;
      if ((f.dir > 0 && f.x > PW + f.len + 20) || (f.dir < 0 && f.x < -f.len - 20)) newFish(f, false);
      var y = f.y + Math.sin(t * 1.1 + f.p) * 6;
      ctx.save(); ctx.translate(f.x, y); ctx.scale(f.dir, 1); ctx.rotate(Math.sin(t * 1.7 + f.p) * 0.04);
      var img = art[KINDS[f.kind].name];
      if (img) { ctx.scale(1 + Math.sin(t * 8 + f.p) * 0.025, 1); sprite(ctx, img, f.len); }
      else fishProc(ctx, f.len, f.kind, t + f.p, P);
      ctx.restore();
    });
  }

  /* jellyfish */
  var jellies = []; for (i = 0; i < 3; i++) jellies.push({ x: (0.25 + i * 0.25 + R() * 0.08) * PW, y: (0.66 + R() * 0.16) * PH, s: 12 + R() * 10, p: R() * TAU, v: 4 + R() * 4, hue: i % 2 ? [255, 140, 220] : [120, 230, 255] });
  function drawJellies(ctx, P, t, dt) {
    var a = 0.25 + 0.6 * P.night;
    jellies.forEach(function (j) {
      j.y -= j.v * dt * (0.4 + 0.6 * Math.max(0, Math.sin(t * 1.6 + j.p)));
      j.x += Math.sin(t * 0.2 + j.p) * 3 * dt;
      if (j.y < WL + 50) { j.y = (0.86 + Math.random() * 0.06) * PH; j.x = U.rand(0.08, 0.92) * PW; }
      var pulse = 1 + Math.sin(t * 1.6 + j.p) * 0.12, s = j.s, x = j.x, y = j.y;
      ctx.save();
      if (P.night > 0.3) ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(j.hue, a * 0.5); ctx.lineWidth = 1;
      for (var k = -2; k <= 2; k++) {
        ctx.beginPath(); ctx.moveTo(x + k * s * 0.3, y);
        for (var q = 1; q <= 6; q++) ctx.lineTo(x + k * s * 0.3 + Math.sin(t * 2 + q * 0.8 + k + j.p) * 3, y + q * s * 0.45);
        ctx.stroke();
      }
      var g = ctx.createRadialGradient(x, y - s * 0.3, 0, x, y, s * 1.1);
      g.addColorStop(0, U.rgba(U.mix(j.hue, U.WHITE, 0.5), a * 0.9)); g.addColorStop(0.7, U.rgba(j.hue, a * 0.45)); g.addColorStop(1, U.rgba(j.hue, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, s * pulse, s * 0.75 / pulse, 0, Math.PI, TAU); ctx.fill();
      ctx.restore();
    });
  }

  /* light rays, caustics, snow, seaweed, bubbles */
  function drawRays(ctx, P, w, t) {
    var a = 0.16 * Math.max(P.light - 0.15, 0) * (1 - w.cloud * 0.6) * (1 - w.storm * 0.8) * (A.platesOn ? 0.6 : 1);
    if (a < 0.004) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var col = U.mix(U.WHITE, [255, 220, 150], P.warm);
    for (var k = 0; k < 7; k++) {
      var cx = PW * (0.06 + k * 0.145) + Math.sin(t * 0.21 + k * 1.7) * PW * 0.04, tw = PW * 0.025, bw = PW * 0.08;
      var g = ctx.createLinearGradient(0, WL, 0, PH);
      g.addColorStop(0, U.rgba(col, a * (0.7 + 0.3 * Math.sin(t * 0.5 + k)))); g.addColorStop(1, U.rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(cx - tw, WL); ctx.lineTo(cx + tw, WL); ctx.lineTo(cx + bw + PW * 0.06, PH); ctx.lineTo(cx - bw + PW * 0.06, PH); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  var glints = U.points(U.rng(41), 60, 0, 1, L.reefTop - 0.03, 0.99);
  function drawCaustics(ctx, P, w, t) {
    var a = 0.28 * P.light * (1 - w.cloud * 0.5) * (1 - w.storm) * (A.platesOn ? 0.6 : 1);
    if (a < 0.02) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glints.forEach(function (g) {
      var f = Math.max(0, Math.sin(t * 1.4 * g.s + g.p)); if (f < 0.05) return;
      var x = g.x * PW + Math.sin(t * 0.5 + g.p) * 10, y = g.y * PH;
      ctx.fillStyle = U.rgba([235, 255, 250], a * f);
      ctx.beginPath(); ctx.ellipse(x, y, 10 + 8 * g.s, 2.5, Math.sin(g.p) * 0.4, 0, TAU); ctx.fill();
    });
    ctx.restore();
  }
  var snow = U.points(U.rng(42), 80, 0, 1, L.waterline + 0.02, 0.98);
  function drawSnow(ctx, P, t) {
    var dayA = 0.22 * (1 - P.night), nightA = 0.75 * P.night;
    snow.forEach(function (s) {
      var y = ((s.y * PH - WL + t * 4 * s.s) % (PH - WL)) + WL, x = s.x * PW + Math.sin(t * 0.3 + s.p) * 8;
      if (dayA > 0.02) { ctx.fillStyle = U.rgba(U.WHITE, dayA); U.circle(ctx, x, y, 1.2); ctx.fill(); }
    });
    if (nightA > 0.02) U.motes(ctx, snow, t, nightA, [90, 255, 230], 4, PW, PH);
  }
  var weeds = [0.015, 0.035, 0.06, 0.09, 0.115, 0.47, 0.5, 0.86, 0.885, 0.915, 0.945, 0.975].map(function (x, k) {
    return { x: x, h: 0.09 + ((k * 37) % 11) / 11 * 0.13, p: k * 1.3, c: k % 3 === 0 ? '#2f9e44' : (k % 3 === 1 ? '#59c13a' : '#7fd66a') };
  });
  function drawWeeds(ctx, P, t) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    weeds.forEach(function (wd) {
      ctx.strokeStyle = U.rgba(U.mix(U.shade(wd.c, P), [20, 80, 120], 0.2), 0.92);
      ctx.lineWidth = 7;
      ctx.beginPath();
      for (var k = 0; k <= 14; k++) {
        var s = k / 14, y = PH * (1.01 - s * wd.h), x = wd.x * PW + Math.sin(t * 0.8 + wd.p + s * 3) * 16 * s;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = U.rgba(U.WHITE, 0.18 * P.light); ctx.lineWidth = 1.5; ctx.stroke();
    });
    ctx.restore();
  }
  var vents = [0.18, 0.43, 0.71], bubbles = [], ventTimers = [0.5, 1, 1.5];
  function drawBubbles(ctx, P, t, dt) {
    vents.forEach(function (vx, k) {
      ventTimers[k] -= dt;
      if (ventTimers[k] <= 0) {
        ventTimers[k] = U.rand(0.25, 1.1) * (Math.sin(t * 0.2 + k * 2) > 0 ? 1 : 3);
        bubbles.push({ x: vx * PW + U.rand(-6, 6), y: (L.reefTop + 0.04) * PH, r: U.rand(2.5, 7), v: U.rand(40, 70), p: Math.random() * TAU });
      }
    });
    if (Math.random() < dt * 0.6) bubbles.push({ x: U.rand(0.05, 0.95) * PW, y: PH * 0.98, r: U.rand(6, 14), v: U.rand(30, 50), p: Math.random() * TAU });
    var tint = U.mix([210, 250, 255], [120, 255, 240], P.night);
    for (var k = bubbles.length - 1; k >= 0; k--) {
      var b = bubbles[k];
      b.y -= b.v * dt; b.x += Math.sin(t * 2.2 + b.p) * 12 * dt;
      if (b.y < WL + b.r) { surfacePops.push({ x: b.x, life: 0 }); bubbles.splice(k, 1); continue; }
      U.bubble(ctx, b.x, b.y, b.r, tint, P.night);
    }
    if (bubbles.length > 120) bubbles.splice(0, bubbles.length - 120);
  }

  /* ---------------------------------------------------------------- water surface, dolphins, splashes */
  var surfacePops = [], drops = [], foams = [];
  var surfGlints = U.points(U.rng(51), 30, 0, 1, 0, 0);
  function drawSurface(ctx, P, w, t, dt) {
    var vis = 0.3 + 0.7 * P.light;
    var g = ctx.createLinearGradient(0, WL, 0, WL + 26);
    g.addColorStop(0, U.rgba(U.WHITE, 0.35 * vis)); g.addColorStop(1, U.rgba(U.WHITE, 0));
    ctx.fillStyle = g; ctx.fillRect(0, WL, PW, 26);
    ctx.save();
    ctx.strokeStyle = U.rgba(U.WHITE, 0.75 * vis); ctx.lineWidth = 2;
    ctx.beginPath();
    for (var x = 0; x <= PW + 8; x += 8) {
      var y = WL + Math.sin(x / PW * 22 + t * 1.6) * 1.6 + Math.sin(x / PW * 7 - t * 0.9) * 1.3;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
    var ga = P.light * (1 - w.cloud * 0.7) * (1 - w.storm);
    surfGlints.forEach(function (s) {
      var x = ((s.x * PW + t * 12 * s.s) % PW);
      U.sparkle(ctx, x, WL - 1, 6 + 4 * s.s, ga * Math.max(0, Math.sin(t * 2 * s.s + s.p)) * 0.8);
    });
    for (var k = surfacePops.length - 1; k >= 0; k--) {
      var p = surfacePops[k]; p.life += dt;
      if (p.life > 0.6) { surfacePops.splice(k, 1); continue; }
      ctx.strokeStyle = U.rgba(U.WHITE, 0.5 * (1 - p.life / 0.6)); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(p.x, WL, 4 + p.life * 30, 1.5 + p.life * 3, 0, 0, TAU); ctx.stroke();
    }
  }

  function dolphinProc(ctx, len, P) {
    var s = len;
    var g = ctx.createLinearGradient(0, -s * 0.16, 0, s * 0.1);
    g.addColorStop(0, U.rgba(U.shade('#4f6e8c', P))); g.addColorStop(0.55, U.rgba(U.shade('#8ea6bd', P))); g.addColorStop(1, U.rgba(U.shade('#e4ecf2', P)));
    ctx.fillStyle = g;
    ctx.beginPath(); // dorsal fin
    ctx.moveTo(-s * 0.02, -s * 0.13); ctx.quadraticCurveTo(-s * 0.08, -s * 0.2, -s * 0.16, -s * 0.26); ctx.quadraticCurveTo(-s * 0.13, -s * 0.15, -s * 0.2, -s * 0.09); ctx.closePath(); ctx.fill();
    ctx.beginPath(); // flukes
    ctx.moveTo(-s * 0.44, 0); ctx.quadraticCurveTo(-s * 0.52, -s * 0.12, -s * 0.6, -s * 0.13); ctx.quadraticCurveTo(-s * 0.54, -s * 0.02, -s * 0.5, 0.0);
    ctx.quadraticCurveTo(-s * 0.54, s * 0.04, -s * 0.6, s * 0.1); ctx.quadraticCurveTo(-s * 0.52, s * 0.1, -s * 0.44, s * 0.02); ctx.closePath(); ctx.fill();
    ctx.beginPath(); // body
    ctx.moveTo(s * 0.5, s * 0.005);
    ctx.quadraticCurveTo(s * 0.44, -s * 0.03, s * 0.36, -s * 0.05);
    ctx.quadraticCurveTo(s * 0.3, -s * 0.11, s * 0.18, -s * 0.12);
    ctx.quadraticCurveTo(-s * 0.1, -s * 0.15, -s * 0.32, -s * 0.06);
    ctx.quadraticCurveTo(-s * 0.42, -s * 0.02, -s * 0.47, 0);
    ctx.lineTo(-s * 0.47, s * 0.025);
    ctx.quadraticCurveTo(-s * 0.3, s * 0.06, 0, s * 0.1);
    ctx.quadraticCurveTo(s * 0.3, s * 0.09, s * 0.5, s * 0.02);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = U.rgba(U.shade('#6f8aa3', P)); // pectoral fin
    ctx.beginPath(); ctx.moveTo(s * 0.18, s * 0.07); ctx.quadraticCurveTo(s * 0.12, s * 0.16, s * 0.05, s * 0.19); ctx.quadraticCurveTo(s * 0.08, s * 0.11, s * 0.08, s * 0.08); ctx.closePath(); ctx.fill();
    ctx.fillStyle = U.rgba([20, 30, 40]); U.circle(ctx, s * 0.34, -s * 0.03, s * 0.012); ctx.fill();
    ctx.strokeStyle = U.rgba(U.WHITE, 0.55 * (0.4 + 0.6 * P.light)); ctx.lineWidth = Math.max(1, s * 0.012); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.085); ctx.quadraticCurveTo(s * 0.05, -s * 0.13, -s * 0.2, -s * 0.07); ctx.stroke();
  }

  var pod = null, podTimer = 5;
  function spawnPod() {
    var dir = Math.random() < 0.5 ? 1 : -1, span = U.rand(300, 420), x0 = U.rand(0.12, 0.6) * PW;
    if (dir < 0) x0 = PW - x0;
    var n = 1 + Math.floor(Math.random() * 3), m = [];
    for (var k = 0; k < n; k++) m.push({ off: k * U.rand(0.3, 0.5), dx: -dir * k * U.rand(30, 60), dy: k * U.rand(4, 14), sc: k ? U.rand(0.75, 0.92) : 1, prev: -1 });
    pod = { dir: dir, x0: x0, x1: x0 + dir * span, peak: U.rand(85, 130), dur: U.rand(2.3, 2.9), start: null, m: m, len: U.rand(140, 170) };
  }
  function splash(x, big) {
    for (var k = 0; k < (big ? 18 : 10); k++) drops.push({ x: x + U.rand(-10, 10), y: WL, vx: U.rand(-110, 110), vy: -U.rand(120, big ? 300 : 200), life: 0, max: U.rand(0.7, 1.2), r: U.rand(1.5, 3.5) });
    foams.push({ x: x, life: 0 });
  }
  function drawDolphins(ctx, P, w, t, dt, withLayer) {
    if (!pod) {
      podTimer -= dt;
      if (podTimer <= 0) { spawnPod(); podTimer = between(CFG.dolphinsEvery || [20, 45]); }
    }
    if (pod) {
      if (pod.start === null) pod.start = t;
      var done = true, waterTint = U.mix(A.Scene.water(P).top, A.Scene.water(P).bot, 0.4);
      withLayer(function (l) {
        pod.m.forEach(function (m) {
          var s = ((t - pod.start - m.off) / pod.dur) * 1.4 - 0.2;
          if (s < 1.25) done = false;
          if (m.prev < 0 && s >= 0) splash(U.lerp(pod.x0, pod.x1, 0) + m.dx, true);
          if (m.prev < 1 && s >= 1) splash(pod.x1 + m.dx, false);
          m.prev = s;
          if (s < -0.2 || s > 1.2) return;
          var pk = pod.peak * m.sc;
          var x = pod.x0 + m.dx + (pod.x1 - pod.x0) * s, y = WL + m.dy - pk * (1 - Math.pow(2 * s - 1, 2));
          var dy = 4 * pk * (2 * s - 1), dx = Math.abs(pod.x1 - pod.x0);
          var fade = U.clamp((s + 0.2) / 0.1, 0, 1) * U.clamp((1.2 - s) / 0.1, 0, 1);
          l.save(); l.globalAlpha = fade; l.translate(x, y); l.scale(pod.dir, 1); l.rotate(Math.atan2(dy, dx));
          if (art.dolphin) { l.rotate(0.35); sprite(l, art.dolphin, pod.len * m.sc); } // the sprite is already drawn nose-up
          else dolphinProc(l, pod.len * m.sc, P);
          l.restore();
        });
      }, function (l) {
        l.globalCompositeOperation = 'source-atop';
        l.fillStyle = U.rgba(waterTint, 0.45 + 0.3 * P.night); l.fillRect(0, WL + 2, PW, PH - WL);
        if (P.night > 0.05) { l.fillStyle = U.rgba([10, 20, 50], P.night * 0.45); l.fillRect(0, 0, PW, WL + 2); }
      });
      if (done) pod = null;
    }
    // splash droplets and foam
    for (var k = drops.length - 1; k >= 0; k--) {
      var d = drops[k]; d.life += dt;
      d.vy += 520 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
      if (d.life > d.max || (d.y > WL && d.vy > 0)) { drops.splice(k, 1); continue; }
      ctx.fillStyle = U.rgba([235, 250, 255], 0.85 * (1 - d.life / d.max) * (0.4 + 0.6 * P.light));
      U.circle(ctx, d.x, d.y, d.r); ctx.fill();
    }
    for (k = foams.length - 1; k >= 0; k--) {
      var f = foams[k]; f.life += dt;
      if (f.life > 1.4) { foams.splice(k, 1); continue; }
      var fa = 1 - f.life / 1.4;
      ctx.fillStyle = U.rgba(U.WHITE, 0.45 * fa * (0.4 + 0.6 * P.light));
      ctx.beginPath(); ctx.ellipse(f.x, WL, 12 + f.life * 55, 3 + f.life * 3, 0, 0, TAU); ctx.fill();
    }
  }

  /* ---------------------------------------------------------------- public */
  A.Actors = {
    init: function (sprites) { art = sprites || {}; },
    sky: function (ctx, P, w, t, dt, withLayer) {
      drawStars(ctx, P, w, t, dt);
      drawRainbow(ctx, P, w, dt, withLayer);
      drawGlobe(ctx, P, t);
      drawClouds(ctx, P, w, dt, withLayer);
      drawBirds(ctx, P, w, t, dt);
      drawTurbines(ctx, P, w, t, dt);
      drawShoreLife(ctx, P, w, t);
    },
    underwater: function (ctx, P, w, t, dt, withLayer) {
      drawRays(ctx, P, w, t);
      drawCaustics(ctx, P, w, t);
      drawSnow(ctx, P, t);
      var Wc = A.Scene.water(P), tint = U.mix(Wc.top, Wc.bot, 0.5);
      withLayer(function (l) { drawSeaLife(l, P, t, dt); }, function (l) {
        l.globalCompositeOperation = 'source-atop';
        var g = l.createLinearGradient(0, WL, 0, PH);
        g.addColorStop(0, U.rgba(tint, 0.1 + 0.45 * P.night + 0.2 * w.storm));
        g.addColorStop(1, U.rgba(Wc.bot, 0.3 + 0.45 * P.night + 0.2 * w.storm));
        l.fillStyle = g; l.fillRect(0, WL, PW, PH - WL);
      });
      drawJellies(ctx, P, t, dt);
      if (!A.platesOn) drawWeeds(ctx, P, t);  // the artwork has its own reef
      drawBubbles(ctx, P, t, dt);
    },
    surface: function (ctx, P, w, t, dt, withLayer) {
      drawSurface(ctx, P, w, t, dt);
      drawDolphins(ctx, P, w, t, dt, withLayer);
    },
    jumpNow: function () { podTimer = 0; pod = null; }
  };
})(window.Aero);
