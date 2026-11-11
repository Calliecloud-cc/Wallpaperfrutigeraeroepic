/* Clock and time-of-day colours. Uses the configured time zone, whatever the computer is set to. */
(function (A) {
  'use strict';
  var U = A.U, C = A.cfg, S = C.schedule;

  // Sky looks: top colour, horizon colour, sun glow, light level, star visibility, warmth.
  var LOOK = {};
  var RAW = {
    night:     ['#040a22', '#0e1f4d', '#1b2f6b', 0.18, 1, 0],
    predawn:   ['#0d1a4a', '#4a4f8e', '#8a7fb8', 0.3, 0.6, 0.3],
    dawn:      ['#3a5fb3', '#ffb4a0', '#ffd2a8', 0.55, 0.1, 0.85],
    morning:   ['#2f8de6', '#cdeeff', '#fff3d6', 0.9, 0, 0.2],
    noon:      ['#1b7fe4', '#c6f1ff', '#ffffff', 1, 0, 0],
    afternoon: ['#2584df', '#d6f2ff', '#fff6e0', 0.95, 0, 0.12],
    golden:    ['#3a6ac0', '#ffc27a', '#ffe0a0', 0.78, 0, 0.7],
    sunset:    ['#3a58b0', '#ffad66', '#ffcf7a', 0.58, 0.05, 1],
    dusk:      ['#22296a', '#cf6a8c', '#ff9a8a', 0.33, 0.45, 0.6]
  };
  Object.keys(RAW).forEach(function (k) {
    var r = RAW[k];
    LOOK[k] = { top: U.hex(r[0]), bot: U.hex(r[1]), glow: U.hex(r[2]), light: r[3], stars: r[4], warm: r[5] };
  });

  var noon = (S.sunrise + S.sunset) / 2;
  var KEYS = [
    [0, 'night'], [S.firstLight - 0.6, 'night'], [S.firstLight, 'predawn'], [S.sunrise, 'dawn'],
    [S.sunrise + 1.3, 'morning'], [noon, 'noon'], [S.sunset - 2.2, 'afternoon'], [S.sunset - 0.35, 'golden'],
    [S.sunset + 0.15, 'sunset'], [S.lastLight, 'dusk'], [S.lastLight + 0.7, 'night'], [24, 'night']
  ];
  // Which artwork plate shows when (they cross-fade between neighbours).
  var PLATES = [
    [0, 'night'], [S.firstLight - 0.4, 'night'], [S.sunrise - 0.05, 'dawn'], [S.sunrise + 0.7, 'dawn'],
    [S.sunrise + 1.6, 'day'], [S.sunset - 1.4, 'day'], [S.sunset - 0.25, 'sunset'], [S.sunset + 0.3, 'sunset'],
    [S.lastLight + 0.5, 'night'], [24, 'night']
  ];

  function seg(keys, h) {
    var i = 0;
    while (i < keys.length - 2 && keys[i + 1][0] <= h) i++;
    var a = keys[i], b = keys[i + 1];
    var t = b[0] > a[0] ? U.clamp((h - a[0]) / (b[0] - a[0]), 0, 1) : 0;
    return [a[1], b[1], U.smooth(t)];
  }

  var fmt = null;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { timeZone: C.timeZone, hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' });
  } catch (e) { fmt = null; }

  function zoneHour(d) {
    if (!fmt) return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    var h = 0, m = 0, s = 0;
    fmt.formatToParts(d).forEach(function (p) {
      if (p.type === 'hour') h = +p.value; else if (p.type === 'minute') m = +p.value; else if (p.type === 'second') s = +p.value;
    });
    return (h % 24) + m / 60 + (s + d.getMilliseconds() / 1000) / 3600;
  }

  function palette(hour) {
    var h = ((hour % 24) + 24) % 24;
    var sg = seg(KEYS, h), a = LOOK[sg[0]], b = LOOK[sg[1]], t = sg[2];
    var P = {
      hour: h, look: t < 0.5 ? sg[0] : sg[1],
      top: U.mix(a.top, b.top, t), bot: U.mix(a.bot, b.bot, t), glow: U.mix(a.glow, b.glow, t),
      light: U.lerp(a.light, b.light, t), stars: U.lerp(a.stars, b.stars, t), warm: U.lerp(a.warm, b.warm, t)
    };
    var d = (h - S.sunrise) / (S.sunset - S.sunrise);
    P.sunUp = d > 0 && d < 1; P.sunX = U.clamp(d, 0, 1); P.sunY = P.sunUp ? Math.sin(d * Math.PI) : 0;
    var nightLen = 24 - (S.sunset - S.sunrise), n = ((h - S.sunset + 24) % 24) / nightLen;
    P.moonUp = n > 0 && n < 1; P.moonX = U.clamp(n, 0, 1); P.moonY = P.moonUp ? Math.sin(n * Math.PI) : 0;
    P.night = 1 - U.clamp((P.light - 0.2) / 0.5, 0, 1);
    var ps = seg(PLATES, h);
    P.plateA = ps[0]; P.plateB = ps[1]; P.plateT = ps[2];
    return P;
  }

  A.Time = { zoneHour: zoneHour, palette: palette };
})(window.Aero);
