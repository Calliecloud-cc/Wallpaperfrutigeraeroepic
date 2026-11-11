/* Painted stand-in background, used until the AI artwork plates exist (or if they fail to load).
   Draws in "plate space": a 1536 x 1024 canvas that main.js scales to cover the screen. */
(function (A) {
  'use strict';
  var U = A.U, TAU = U.TAU, L = A.cfg.layout;
  var PW = A.PW, PH = A.PH;
  var WL = L.waterline * PH, FS = L.farShore * PH;
  var R = U.rng(101), i;

  function bump(n, c, w) { var d = (n - c) / w; return Math.exp(-d * d); }
  function farHill(n) { return FS - PH * (0.1 * bump(n, 0.1, 0.16) + 0.06 * bump(n, 0.34, 0.12) + 0.05 * bump(n, 0.55, 0.15) + 0.07 * bump(n, 0.82, 0.2) + 0.012 * Math.sin(n * 40)); }
  function nearHill(n) { return FS - PH * (0.05 * bump(n, 0.08, 0.14) + 0.035 * bump(n, 0.28, 0.1) + 0.025 * bump(n, 0.45, 0.08) + 0.004 * Math.sin(n * 70)); }

  var towers = [];
  (function () {
    var x = L.city.x0 * PW, x1 = L.city.x1 * PW, k = 0, r = U.rng(7);
    while (x < x1) {
      var w = PW * (0.02 + r() * 0.028), h = PH * (0.07 + r() * 0.17) * (k % 3 === 1 ? 1.35 : 1);
      towers.push({ x: x + w / 2, w: w, h: h, k: k });
      x += w * (0.85 + r() * 0.55); k++;
    }
  })();
  var domes = [{ x: 0.665, r: 0.045 }, { x: 0.9, r: 0.035 }];
  var trees = []; for (i = 0; i < 46; i++) trees.push({ x: R(), r: 0.006 + R() * 0.01, d: R() });
  var corals = [];
  var cc = ['#ff7aa8', '#ff9f5a', '#c08cff', '#ffd25a', '#ff6f91', '#7fe0ff', '#ffa3c7', '#ff8a3d'];
  for (i = 0; i < 26; i++) corals.push({ x: 0.01 + i * 0.039 + R() * 0.02, s: 0.011 + R() * 0.016, c: cc[i % cc.length], y: L.reefTop + 0.065 + R() * 0.04 });
  var rocks = []; for (i = 0; i < 10; i++) rocks.push({ x: R(), y: L.reefTop + 0.08 + R() * 0.06, rx: 0.04 + R() * 0.05, ry: 0.025 + R() * 0.03 });

  function water(P) {
    return {
      top: U.mix(U.mix([86, 232, 242], [255, 200, 130], P.warm * 0.4), [12, 38, 92], P.night * 0.92),
      bot: U.mix([5, 100, 160], [2, 10, 36], P.night * 0.9)
    };
  }

  function ridge(ctx, fn, c1, c2, P, far, gloss) {
    var minY = PH, x, y;
    ctx.beginPath(); ctx.moveTo(0, FS + 4);
    for (x = 0; x <= PW + 6; x += 6) { y = fn(x / PW); if (y < minY) minY = y; ctx.lineTo(x, y); }
    ctx.lineTo(PW, FS + 4); ctx.closePath();
    var g = ctx.createLinearGradient(0, minY, 0, FS);
    g.addColorStop(0, U.rgba(U.shade(c1, P, far))); g.addColorStop(1, U.rgba(U.shade(c2, P, far)));
    ctx.fillStyle = g; ctx.fill();
    if (gloss) {
      ctx.save(); ctx.clip();
      var gx = P.sunUp ? U.lerp(PW * 0.08, PW * 0.92, P.sunX) : PW * 0.3;
      var rg = ctx.createRadialGradient(gx, minY, 0, gx, minY, PW * 0.5);
      rg.addColorStop(0, U.rgba([255, 255, 230], 0.4 * P.light * gloss)); rg.addColorStop(1, U.rgba([255, 255, 230], 0));
      ctx.fillStyle = rg; ctx.fillRect(0, minY, PW, FS - minY + 4);
      ctx.restore();
    }
  }

  function sunMoon(ctx, P, w) {
    var g, x, y, veil = 1 - U.sstep(0.45, 1, w.cloud) * 0.92;
    if (P.sunUp && veil > 0.02) {
      ctx.save(); ctx.globalAlpha = veil;
      x = U.lerp(PW * 0.06, PW * 0.94, P.sunX); y = FS - P.sunY * FS * 0.85;
      var sc = U.mix([255, 255, 240], [255, 190, 110], P.warm);
      g = ctx.createRadialGradient(x, y, 0, x, y, PH * 0.45);
      g.addColorStop(0, U.rgba(sc, 0.9)); g.addColorStop(0.1, U.rgba(P.glow, 0.5)); g.addColorStop(1, U.rgba(P.glow, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, PW, FS);
      ctx.fillStyle = U.rgba(U.mix(sc, U.WHITE, 0.6)); U.circle(ctx, x, y, PH * 0.028); ctx.fill();
      ctx.restore();
    }
    if (P.moonUp && P.night > 0.05 && veil > 0.02) {
      ctx.save(); ctx.globalAlpha = veil;
      x = U.lerp(PW * 0.1, PW * 0.9, P.moonX); y = FS - P.moonY * FS * 0.8;
      g = ctx.createRadialGradient(x, y, 0, x, y, PH * 0.16);
      g.addColorStop(0, U.rgba([200, 220, 255], 0.3 * P.night)); g.addColorStop(1, U.rgba([200, 220, 255], 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, PW, FS);
      ctx.fillStyle = U.rgba([240, 246, 255], 0.95 * P.night); U.circle(ctx, x, y, PH * 0.02); ctx.fill();
      ctx.fillStyle = U.rgba(P.top, 0.9 * P.night); U.circle(ctx, x + PH * 0.009, y - PH * 0.004, PH * 0.018); ctx.fill();
      ctx.restore();
    }
  }

  function city(ctx, P) {
    var Lc = U.shade(U.mix(U.WHITE, P.glow, 0.3), P), Dc = U.shade('#7fb8d6', P);
    domes.forEach(function (d) {
      var x = d.x * PW, r = d.r * PW;
      var g = ctx.createRadialGradient(x - r * 0.3, FS - r * 0.6, 0, x, FS, r);
      g.addColorStop(0, U.rgba(U.mix(Lc, U.WHITE, 0.4), 0.95)); g.addColorStop(1, U.rgba(U.shade('#5fb0a0', P), 0.9));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, FS, r, r * 0.75, 0, Math.PI, TAU); ctx.fill();
    });
    towers.forEach(function (tw) {
      var x = tw.x, r = tw.w / 2, th = tw.h, y0 = FS + 1;
      ctx.beginPath(); ctx.moveTo(x - r, y0); ctx.lineTo(x - r, y0 - th + r); ctx.arc(x, y0 - th + r, r, Math.PI, 0); ctx.lineTo(x + r, y0); ctx.closePath();
      var g = ctx.createLinearGradient(x - r, 0, x + r, 0);
      g.addColorStop(0, U.rgba(Lc)); g.addColorStop(0.45, U.rgba(U.mix(Lc, Dc, 0.3))); g.addColorStop(1, U.rgba(Dc));
      ctx.fillStyle = g; ctx.fill();
      ctx.fillStyle = U.rgba(U.WHITE, 0.4 * P.light); ctx.fillRect(x - r * 0.6, y0 - th + r, r * 0.16, th - r);
      // green roof garden
      ctx.fillStyle = U.rgba(U.shade('#6fd35a', P)); ctx.beginPath(); ctx.ellipse(x, y0 - th + r * 0.55, r * 0.75, r * 0.3, 0, Math.PI, TAU); ctx.fill();
      if (P.night > 0.05) {
        var row = 0;
        for (var yy = y0 - th + r * 1.4; yy < y0 - PH * 0.012; yy += PH * 0.016, row++) {
          for (var c = 0; c < 3; c++) {
            if (((tw.k * 73 + row * 31 + c * 17) % 7) < 3) {
              var wc = ((tw.k + row + c) % 3 === 0) ? [140, 230, 255] : [255, 220, 140];
              ctx.fillStyle = U.rgba(wc, 0.9 * P.night); ctx.fillRect(x - r * 0.6 + c * r * 0.42, yy, r * 0.28, PH * 0.006);
            }
          }
        }
      }
    });
  }

  function shore(ctx, P) {
    trees.forEach(function (tr) {
      var x = tr.x * PW, rr = tr.r * PH, y = FS - rr * 0.6 + tr.d * 3;
      var g = ctx.createRadialGradient(x - rr * 0.35, y - rr * 0.4, 0, x, y, rr);
      g.addColorStop(0, U.rgba(U.shade('#b6f07a', P))); g.addColorStop(1, U.rgba(U.shade('#2f9a35', P)));
      ctx.fillStyle = g; U.circle(ctx, x, y, rr); ctx.fill();
    });
    ctx.fillStyle = U.rgba(U.shade('#e9dcae', P)); ctx.fillRect(0, FS - 1, PW, 4);
    var g = ctx.createLinearGradient(0, FS + 3, 0, WL);
    g.addColorStop(0, U.rgba(U.mix(P.bot, [60, 190, 215], 0.45 * (1 - P.night * 0.7))));
    g.addColorStop(1, U.rgba(U.mix(P.top, [20, 140, 190], 0.5 * (1 - P.night * 0.6))));
    ctx.fillStyle = g; ctx.fillRect(0, FS + 3, PW, WL - FS - 2);
    // faint reflections of the towers
    towers.forEach(function (tw) {
      ctx.fillStyle = U.rgba(U.WHITE, 0.08 + 0.1 * P.light);
      ctx.fillRect(tw.x - tw.w * 0.3, FS + 4, tw.w * 0.6, Math.min(WL - FS - 6, tw.h * 0.25));
    });
  }

  function reef(ctx, P, Wc) {
    var x, n, g;
    ctx.fillStyle = U.rgba(U.mix(Wc.bot, Wc.top, 0.3), 0.8);
    ctx.beginPath(); ctx.moveTo(0, PH);
    for (x = 0; x <= PW + 6; x += 6) { n = x / PW; ctx.lineTo(x, PH * (L.reefTop - 0.03 + 0.04 * Math.sin(n * 7) + 0.025 * Math.sin(n * 17 + 1))); }
    ctx.lineTo(PW, PH); ctx.closePath(); ctx.fill();
    // sand
    ctx.beginPath(); ctx.moveTo(0, PH);
    for (x = 0; x <= PW + 6; x += 6) { n = x / PW; ctx.lineTo(x, PH * (L.reefTop + 0.08 + 0.02 * Math.sin(n * 5 + 1) + 0.01 * Math.sin(n * 13))); }
    ctx.lineTo(PW, PH); ctx.closePath();
    g = ctx.createLinearGradient(0, PH * (L.reefTop + 0.05), 0, PH);
    g.addColorStop(0, U.rgba(U.mix(U.shade('#f6e7b8', P), Wc.top, 0.3))); g.addColorStop(1, U.rgba(U.mix(U.shade('#c4a468', P), Wc.bot, 0.45)));
    ctx.fillStyle = g; ctx.fill();
    rocks.forEach(function (r) {
      var rx = r.rx * PW, ry = r.ry * PH, cx = r.x * PW, cy = r.y * PH;
      var rg = ctx.createRadialGradient(cx - rx * 0.3, cy - ry * 0.5, 0, cx, cy, rx);
      rg.addColorStop(0, U.rgba(U.mix(U.shade('#8aa0a8', P), Wc.top, 0.25))); rg.addColorStop(1, U.rgba(U.mix(U.shade('#3d5560', P), Wc.bot, 0.3)));
      ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, TAU); ctx.fill();
    });
    corals.forEach(function (c) {
      var col = U.mix(U.shade(c.c, P), Wc.top, 0.15), bx = c.x * PW, by = c.y * PH, s = c.s * PW;
      [[0, -0.9, 0.55], [-0.6, -0.5, 0.45], [0.6, -0.55, 0.5], [-0.25, -1.5, 0.4], [0.35, -1.35, 0.38], [0, -0.2, 0.6]].forEach(function (p) {
        var px = bx + p[0] * s, py = by + p[1] * s, pr = p[2] * s;
        var cg = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 0, px, py, pr);
        cg.addColorStop(0, U.rgba(U.mix(col, U.WHITE, 0.35))); cg.addColorStop(1, U.rgba(U.mul(col, 0.72)));
        ctx.fillStyle = cg; U.circle(ctx, px, py, pr); ctx.fill();
      });
    });
  }

  function background(ctx, P, w) {
    var g = ctx.createLinearGradient(0, 0, 0, FS);
    g.addColorStop(0, U.rgba(P.top)); g.addColorStop(1, U.rgba(P.bot));
    ctx.fillStyle = g; ctx.fillRect(0, 0, PW, FS + 2);
    sunMoon(ctx, P, w);
    ridge(ctx, farHill, '#9fd8a0', '#5ea878', P, 0.45, 0.4);
    city(ctx, P);
    ridge(ctx, nearHill, '#86dc52', '#2f9a35', P, 0.08, 1);
    shore(ctx, P);
    var Wc = water(P);
    g = ctx.createLinearGradient(0, WL, 0, PH);
    g.addColorStop(0, U.rgba(Wc.top)); g.addColorStop(1, U.rgba(Wc.bot));
    ctx.fillStyle = g; ctx.fillRect(0, WL, PW, PH - WL);
    reef(ctx, P, Wc);
  }

  A.Scene = { background: background, water: water };
})(window.Aero);
