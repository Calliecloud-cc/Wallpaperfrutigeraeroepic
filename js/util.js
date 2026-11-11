/* Shared maths, colour and drawing helpers. Everything hangs off window.Aero. */
(function (A) {
  'use strict';
  var TAU = Math.PI * 2;
  var WHITE = [255, 255, 255];

  var U = {
    TAU: TAU,
    WHITE: WHITE,
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    smooth: function (t) { return t * t * (3 - 2 * t); },
    sstep: function (a, b, v) { var t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); },
    hex: function (h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; },
    mix: function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; },
    mul: function (c, k) { return [c[0] * k, c[1] * k, c[2] * k]; },
    rgba: function (c, a) {
      if (a === undefined) a = 1;
      return 'rgba(' + Math.round(U.clamp(c[0], 0, 255)) + ',' + Math.round(U.clamp(c[1], 0, 255)) + ',' +
        Math.round(U.clamp(c[2], 0, 255)) + ',' + U.clamp(a, 0, 1).toFixed(3) + ')';
    },
    rng: function (seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; },
    rand: function (a, b) { return a + Math.random() * (b - a); },
    circle: function (ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.01, r), 0, TAU); },
    loadImage: function (src) {
      return new Promise(function (resolve) {
        if (!src) { resolve(null); return; }
        var im = new Image();
        im.onload = function () { resolve(im); };
        im.onerror = function () { resolve(null); };
        im.src = src;
      });
    }
  };

  // Light a base colour for the time of day (P = palette from time.js).
  U.shade = function (c, P, far) {
    c = typeof c === 'string' ? U.hex(c) : c;
    var o = U.mul(c, 0.25 + 0.75 * P.light);
    o = U.mix(o, [255, 150, 80], P.warm * 0.25);
    o = U.mix(o, [25, 45, 105], P.night * 0.4);
    if (far) o = U.mix(o, P.bot, far);
    return o;
  };

  U.bubble = function (ctx, x, y, r, tint, glow) {
    var g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, U.rgba(tint, 0.04));
    g.addColorStop(0.72, U.rgba(tint, 0.16));
    g.addColorStop(0.94, U.rgba(U.mix(tint, WHITE, 0.6), 0.6));
    g.addColorStop(1, U.rgba(WHITE, 0));
    ctx.fillStyle = g; U.circle(ctx, x, y, r); ctx.fill();
    var hx = x - r * 0.36, hy = y - r * 0.4;
    var hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.45);
    hg.addColorStop(0, U.rgba(WHITE, 0.9)); hg.addColorStop(1, U.rgba(WHITE, 0));
    ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.42, r * 0.26, -0.6, 0, TAU); ctx.fill();
    if (glow > 0.05) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var gg = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
      gg.addColorStop(0, U.rgba([90, 255, 230], 0.22 * glow)); gg.addColorStop(1, U.rgba([90, 255, 230], 0));
      ctx.fillStyle = gg; U.circle(ctx, x, y, r * 1.6); ctx.fill(); ctx.restore();
    }
  };

  U.sparkle = function (ctx, x, y, s, a, col) {
    if (a < 0.02) return;
    col = col || WHITE;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    var g = ctx.createRadialGradient(x, y, 0, x, y, s);
    g.addColorStop(0, U.rgba(col, 0.8 * a)); g.addColorStop(1, U.rgba(col, 0));
    ctx.fillStyle = g; U.circle(ctx, x, y, s); ctx.fill();
    ctx.fillStyle = U.rgba(WHITE, 0.9 * a);
    ctx.beginPath(); ctx.ellipse(x, y, s * 1.25, s * 0.06, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y, s * 0.06, s * 1.25, 0, 0, TAU); ctx.fill();
    ctx.restore();
  };

  // Soft glows that wander and pulse (fireflies, plankton, pollen).
  U.motes = function (ctx, list, t, amt, col, r, w, h) {
    if (amt < 0.02) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      var x = (f.x + Math.sin(t * 0.25 * f.s + f.p) * 0.02) * w;
      var y = (f.y + Math.cos(t * 0.31 * f.s + f.p) * 0.015) * h;
      var a = amt * (0.15 + 0.85 * Math.max(0, Math.sin(t * 1.2 * f.s + f.p * 3)));
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, U.rgba(col, a)); g.addColorStop(0.3, U.rgba(col, a * 0.45)); g.addColorStop(1, U.rgba(col, 0));
      ctx.fillStyle = g; U.circle(ctx, x, y, r); ctx.fill();
    }
    ctx.restore();
  };

  U.points = function (R, n, x0, x1, y0, y1) {
    var a = [];
    for (var i = 0; i < n; i++) a.push({ x: x0 + R() * (x1 - x0), y: y0 + R() * (y1 - y0), p: R() * TAU, s: 0.5 + R() });
    return a;
  };

  // A soft, shaded cumulus cloud rendered once into its own canvas.
  U.cloudBitmap = function (seed) {
    var c = document.createElement('canvas'); c.width = 460; c.height = 230;
    var x = c.getContext('2d'), R = U.rng(seed);
    var puffs = [];
    for (var i = 0; i < 11; i++) {
      var px = 70 + R() * 320, edge = Math.abs(px - 230) / 160;
      puffs.push([px, 150 - R() * 55 * (1 - edge * 0.6), 34 + R() * 46 * (1 - edge * 0.5)]);
    }
    puffs.push([230, 165, 70], [150, 168, 52], [310, 168, 52]);
    puffs.forEach(function (p) {
      var g = x.createRadialGradient(p[0] - p[2] * 0.3, p[1] - p[2] * 0.45, p[2] * 0.05, p[0], p[1], p[2]);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.6, 'rgba(246,249,252,0.95)');
      g.addColorStop(0.85, 'rgba(222,230,240,0.7)');
      g.addColorStop(1, 'rgba(210,220,232,0)');
      x.fillStyle = g; x.beginPath(); x.arc(p[0], p[1], p[2], 0, TAU); x.fill();
    });
    // flat-ish shaded base
    var bg = x.createLinearGradient(0, 140, 0, 200);
    bg.addColorStop(0, 'rgba(200,212,228,0)'); bg.addColorStop(1, 'rgba(180,195,215,0.35)');
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height);
    return c;
  };

  A.U = U;
})(window.Aero = window.Aero || {});
