/* ============================================================
   THE COSMIC RESET · birth-chart engine
   Sun (Meeus) · Moon (Schlyter) · Ascendant + MC (standard formulae)
   Keyless city lookup via Open-Meteo. Historical DST via the browser's
   IANA timezone database. Optional external API override via config.
   ============================================================ */
(function () {
  "use strict";

  var DEG = Math.PI / 180;
  var SIGNS = [
    { name: "Aries", glyph: "♈" }, { name: "Taurus", glyph: "♉" }, { name: "Gemini", glyph: "♊" },
    { name: "Cancer", glyph: "♋" }, { name: "Leo", glyph: "♌" }, { name: "Virgo", glyph: "♍" },
    { name: "Libra", glyph: "♎" }, { name: "Scorpio", glyph: "♏" }, { name: "Sagittarius", glyph: "♐" },
    { name: "Capricorn", glyph: "♑" }, { name: "Aquarius", glyph: "♒" }, { name: "Pisces", glyph: "♓" }
  ];

  function norm360(x) { return ((x % 360) + 360) % 360; }
  function signOf(lon) {
    lon = norm360(lon);
    var i = Math.floor(lon / 30);
    return { index: i, name: SIGNS[i].name, glyph: SIGNS[i].glyph, deg: lon - i * 30, lon: lon };
  }
  function signByIndex(i) { i = ((i % 12) + 12) % 12; return { index: i, name: SIGNS[i].name, glyph: SIGNS[i].glyph }; }

  // Lahiri ayanamsa (deg): converts tropical longitudes to Vedic sidereal
  function ayanamsa(JD) { return 23.853 + 0.013972 * ((JD - 2451545.0) / 365.25); }

  // ---- timezone: minutes that `tz` is ahead of UTC at a given instant ----
  function tzOffsetMinutes(utcMs, tz) {
    try {
      var d = new Date(utcMs);
      var s = d.toLocaleString("en-US", {
        timeZone: tz, hour12: false,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      var parts = s.split(", ");
      var dmy = parts[0].split("/").map(Number);
      var hms = parts[1].split(":").map(Number);
      var mo = dmy[0], da = dmy[1], ye = dmy[2];
      var ho = hms[0] % 24, mi = hms[1], se = hms[2];
      var asUTC = Date.UTC(ye, mo - 1, da, ho, mi, se);
      return Math.round((asUTC - utcMs) / 60000);
    } catch (e) { return 0; }
  }

  // local wall-clock (at birthplace) -> UTC Date
  function wallToUTC(Y, M, D, h, min, tz) {
    var guess = Date.UTC(Y, M - 1, D, h, min);
    var off = tzOffsetMinutes(guess, tz);
    var utc = guess - off * 60000;
    off = tzOffsetMinutes(utc, tz);            // refine once (DST edges)
    return new Date(guess - off * 60000);
  }

  function julianDay(Y, M, D, hourUT) {
    if (M <= 2) { Y -= 1; M += 12; }
    var A = Math.floor(Y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5 + hourUT / 24;
  }

  function sunLongitude(JD) {
    var T = (JD - 2451545.0) / 36525;
    var L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    var M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    var Mr = M * DEG;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
          + 0.000289 * Math.sin(3 * Mr);
    return norm360(L0 + C);
  }

  function moonLongitude(JD) {
    var d = JD - 2451543.5;
    var N = 125.1228 - 0.0529538083 * d;
    var i = 5.1454;
    var w = 318.0634 + 0.1643573223 * d;
    var e = 0.054900;
    var M = 115.3654 + 13.0649929509 * d;
    var Mr = norm360(M) * DEG;
    var E = Mr;
    for (var k = 0; k < 6; k++) E = E - (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
    var x = Math.cos(E) - e;
    var y = Math.sqrt(1 - e * e) * Math.sin(E);
    var v = Math.atan2(y, x);
    var vw = v + w * DEG;
    var Nr = N * DEG, ir = i * DEG;
    var xe = Math.cos(Nr) * Math.cos(vw) - Math.sin(Nr) * Math.sin(vw) * Math.cos(ir);
    var ye = Math.sin(Nr) * Math.cos(vw) + Math.cos(Nr) * Math.sin(vw) * Math.cos(ir);
    var lon = norm360(Math.atan2(ye, xe) / DEG);

    // perturbations (Schlyter)
    var Ms = 356.0470 + 0.9856002585 * d;
    var ws = 282.9404 + 4.70935e-5 * d;
    var Ls = norm360(ws + Ms);
    var Lm = norm360(N + w + M);
    var Dm = norm360(Lm - Ls);
    var F = norm360(Lm - N);
    var Mm = norm360(M);
    Ms = norm360(Ms);
    lon += -1.274 * Math.sin((Mm - 2 * Dm) * DEG)
         + 0.658 * Math.sin((2 * Dm) * DEG)
         - 0.186 * Math.sin((Ms) * DEG)
         - 0.059 * Math.sin((2 * Mm - 2 * Dm) * DEG)
         - 0.057 * Math.sin((Mm - 2 * Dm + Ms) * DEG)
         + 0.053 * Math.sin((Mm + 2 * Dm) * DEG)
         + 0.046 * Math.sin((2 * Dm - Ms) * DEG)
         + 0.041 * Math.sin((Mm - Ms) * DEG)
         - 0.035 * Math.sin((Dm) * DEG)
         - 0.031 * Math.sin((Mm + Ms) * DEG)
         - 0.015 * Math.sin((2 * F - 2 * Dm) * DEG)
         + 0.011 * Math.sin((Mm - 4 * Dm) * DEG);
    return norm360(lon);
  }

  // Ascendant + Midheaven, given JD, east-longitude and latitude (deg)
  function angles(JD, lonEast, lat) {
    var T = (JD - 2451545.0) / 36525;
    var GMST = norm360(280.46061837 + 360.98564736629 * (JD - 2451545.0)
             + 0.000387933 * T * T - (T * T * T) / 38710000);
    var theta = norm360(GMST + lonEast);           // RAMC (deg)
    var eps = (23.4392911 - 0.0130042 * T) * DEG;
    var th = theta * DEG, phi = lat * DEG;

    var mc = norm360(Math.atan2(Math.sin(th), Math.cos(th) * Math.cos(eps)) / DEG);

    var asc = norm360(Math.atan2(Math.cos(th),
              -(Math.sin(th) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) / DEG);

    // disambiguate hemisphere: the ascendant's RA must be ~ RAMC + 90
    function eclipToRA(lon) {
      var l = lon * DEG;
      return norm360(Math.atan2(Math.sin(l) * Math.cos(eps), Math.cos(l)) / DEG);
    }
    function diff(a, b) { var x = Math.abs(norm360(a - b)); return x > 180 ? 360 - x : x; }
    if (diff(eclipToRA(asc), norm360(theta + 90)) > 90) asc = norm360(asc + 180);

    return { asc: asc, mc: mc };
  }

  // ---- keyless geocoding (Open-Meteo) ----
  function geocode(query) {
    var url = "https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&format=json&name="
            + encodeURIComponent(query);
    return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      return (j.results || []).map(function (r) {
        var bits = [r.name, r.admin1, r.country].filter(Boolean);
        return { label: bits.join(", "), lat: r.latitude, lon: r.longitude, tz: r.timezone };
      });
    }).catch(function () { return []; });
  }

  /* Compute the chart.
     place = { lat, lon, tz }.  date = {y,m,d,h,min}.
     Returns { sun, moon, rising, mc } as signOf() objects, plus careerHouse.
     If TCR_CONFIG.astroEndpoint is set, that API is used instead. */
  function computeChart(date, place) {
    var cfg = window.TCR_CONFIG || {};
    if (cfg.astroEndpoint) {
      return fetch(cfg.astroEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date, place: place })
      }).then(function (r) { return r.json(); }).then(function (j) {
        var rise = signOf(j.ascendant != null ? j.ascendant : j.rising);
        return {
          sun: signOf(j.sun), moon: signOf(j.moon), rising: rise,
          career: signByIndex(rise.index + 9), careerHouse: 10, system: "vedic", source: "api"
        };
      });
    }

    var utc = wallToUTC(date.y, date.m, date.d, date.h, date.min, place.tz);
    var hourUT = utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600;
    var JD = julianDay(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(), hourUT);
    var ang = angles(JD, place.lon, place.lat);
    var ay = ayanamsa(JD);
    function sid(x) { return norm360(x - ay); }        // tropical -> Vedic sidereal
    var rising = signOf(sid(ang.asc));
    return Promise.resolve({
      sun: signOf(sid(sunLongitude(JD))),
      moon: signOf(sid(moonLongitude(JD))),
      rising: rising,
      career: signByIndex(rising.index + 9),           // 10th house, whole-sign (Vedic)
      careerHouse: 10,
      system: "vedic",
      source: "builtin"
    });
  }

  /* ============================================================
     FULL CHART: all planets (geocentric, sidereal), houses, nodes.
     Planetary positions via Paul Schlyter's low-precision method.
     ============================================================ */
  function kepler(Mdeg, e) {
    var M = norm360(Mdeg) * DEG;
    var E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
    for (var k = 0; k < 8; k++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return E;
  }
  function helio(el) {
    var E = kepler(el.M, el.e);
    var xv = el.a * (Math.cos(E) - el.e);
    var yv = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
    var v = Math.atan2(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
    var N = el.N * DEG, w = el.w * DEG, i = el.i * DEG, vw = v + w;
    return {
      x: r * (Math.cos(N) * Math.cos(vw) - Math.sin(N) * Math.sin(vw) * Math.cos(i)),
      y: r * (Math.sin(N) * Math.cos(vw) + Math.cos(N) * Math.sin(vw) * Math.cos(i)),
      z: r * Math.sin(vw) * Math.sin(i), r: r
    };
  }
  function sunRect(d) {
    var w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d, M = 356.0470 + 0.9856002585 * d;
    var E = kepler(M, e);
    var xv = Math.cos(E) - e, yv = Math.sqrt(1 - e * e) * Math.sin(E);
    var v = Math.atan2(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
    var lon = v + w * DEG;
    return { x: r * Math.cos(lon), y: r * Math.sin(lon), lon: norm360(lon / DEG), M: M };
  }
  function els(d) {
    return {
      Mercury: { N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5.00e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d },
      Venus:   { N: 76.6799 + 2.46590e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.8910 + 1.38374e-5 * d, a: 0.723330, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d },
      Mars:    { N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d },
      Jupiter: { N: 100.4542 + 2.76854e-5 * d, i: 1.3030 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.8950 + 0.0830853001 * d },
      Saturn:  { N: 113.6634 + 2.38980e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.9670 + 0.0334442282 * d },
      Uranus:  { N: 74.0005 + 1.3978e-5 * d, i: 0.7733 + 1.9e-8 * d, w: 96.6612 + 3.0565e-5 * d, a: 19.18171 - 1.55e-8 * d, e: 0.047318 + 7.45e-9 * d, M: 142.5905 + 0.011725806 * d },
      Neptune: { N: 131.7806 + 3.0173e-5 * d, i: 1.7700 - 2.55e-7 * d, w: 272.8461 - 6.027e-6 * d, a: 30.05826 + 3.313e-8 * d, e: 0.008606 + 2.15e-9 * d, M: 260.2471 + 0.005995147 * d }
    };
  }
  function plutoLon(d) {
    var S = (50.03 + 0.033459652 * d) * DEG, P = (238.95 + 0.003968789 * d) * DEG;
    var lon = 238.9508 + 0.00400703 * d
      - 19.799 * Math.sin(P) + 19.848 * Math.cos(P)
      + 0.897 * Math.sin(2 * P) - 4.956 * Math.cos(2 * P)
      + 0.610 * Math.sin(3 * P) + 1.211 * Math.cos(3 * P)
      - 0.341 * Math.sin(4 * P) - 0.190 * Math.cos(4 * P)
      + 0.128 * Math.sin(5 * P) - 0.034 * Math.cos(5 * P)
      - 0.038 * Math.sin(6 * P) + 0.031 * Math.cos(6 * P)
      + 0.020 * Math.sin(S - P) - 0.010 * Math.cos(S - P);
    return norm360(lon);
  }
  function geoLon(d) {
    var e = els(d), s = sunRect(d), out = {};
    var Mj = e.Jupiter.M, Ms = e.Saturn.M, Mu = e.Uranus.M;
    function pert(name, lon) {
      var r = 0, D = DEG;
      if (name === 'Jupiter') r = -0.332 * Math.sin((2 * Mj - 5 * Ms - 67.6) * D) - 0.056 * Math.sin((2 * Mj - 2 * Ms + 21) * D) + 0.042 * Math.sin((3 * Mj - 5 * Ms + 21) * D) - 0.036 * Math.sin((Mj - 2 * Ms) * D) + 0.022 * Math.cos((Mj - Ms) * D) + 0.023 * Math.sin((2 * Mj - 3 * Ms + 52) * D) - 0.016 * Math.sin((Mj - 5 * Ms - 69) * D);
      else if (name === 'Saturn') r = 0.812 * Math.sin((2 * Mj - 5 * Ms - 67.6) * D) - 0.229 * Math.cos((2 * Mj - 4 * Ms - 2) * D) + 0.119 * Math.sin((Mj - 2 * Ms - 3) * D) + 0.046 * Math.sin((2 * Mj - 6 * Ms - 69) * D) + 0.014 * Math.sin((Mj - 3 * Ms + 32) * D);
      else if (name === 'Uranus') r = 0.040 * Math.sin((Ms - 2 * Mu + 6) * D) + 0.035 * Math.sin((Ms - 3 * Mu + 33) * D) - 0.015 * Math.sin((Mj - Mu + 20) * D);
      return lon + r;
    }
    ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].forEach(function (name) {
      var h = helio(e[name]);
      var lon = norm360(Math.atan2(h.y + s.y, h.x + s.x) / DEG);
      out[name] = pert(name, lon);
    });
    out.Sun = s.lon;
    out.Pluto = plutoLon(d);
    return out;
  }

  var GLYPH = { Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇", Rahu: "☊", Ketu: "☋" };

  function computeFullChart(date, place) {
    var utc = wallToUTC(date.y, date.m, date.d, date.h, date.min, place.tz);
    var hourUT = utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600;
    var JD = julianDay(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(), hourUT);
    var d = JD - 2451543.5, ay = ayanamsa(JD);
    function sid(x) { return norm360(x - ay); }
    var ang = angles(JD, place.lon, place.lat);
    var ascS = signOf(sid(ang.asc)), mcS = signOf(sid(ang.mc));
    var ascIdx = ascS.index;

    var g0 = geoLon(d), g1 = geoLon(d + 1);          // +1 day for retrograde direction
    var moon0 = moonLongitude(JD), rahu0 = norm360(125.1228 - 0.0529538083 * d);
    var order = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Rahu", "Ketu"];
    var trop = {
      Sun: g0.Sun, Moon: moon0, Mercury: g0.Mercury, Venus: g0.Venus, Mars: g0.Mars,
      Jupiter: g0.Jupiter, Saturn: g0.Saturn, Uranus: g0.Uranus, Neptune: g0.Neptune, Pluto: g0.Pluto,
      Rahu: rahu0, Ketu: norm360(rahu0 + 180)
    };
    var trop1 = {
      Sun: g1.Sun, Moon: moonLongitude(JD + 1), Mercury: g1.Mercury, Venus: g1.Venus, Mars: g1.Mars,
      Jupiter: g1.Jupiter, Saturn: g1.Saturn, Uranus: g1.Uranus, Neptune: g1.Neptune, Pluto: g1.Pluto,
      Rahu: norm360(125.1228 - 0.0529538083 * (d + 1)), Ketu: 0
    }; trop1.Ketu = norm360(trop1.Rahu + 180);

    var bodies = order.map(function (name) {
      var sl = sid(trop[name]), s = signOf(sl);
      var diff = ((trop1[name] - trop[name] + 540) % 360) - 180;   // daily motion, signed
      var retro = (name === "Rahu" || name === "Ketu") ? true : (diff < 0);
      return {
        key: name, name: name, glyph: GLYPH[name],
        lon: sl, sign: s.name, signGlyph: s.glyph, signIndex: s.index,
        deg: s.deg, house: ((s.index - ascIdx + 12) % 12) + 1, retro: retro
      };
    });

    var houses = [];
    for (var h = 0; h < 12; h++) { var si = signByIndex(ascIdx + h); houses.push({ num: h + 1, sign: si.name, glyph: si.glyph, index: si.index }); }

    return {
      system: "sidereal", ayanamsa: ay,
      ascendant: { lon: ascS.lon, sign: ascS.name, glyph: ascS.glyph, deg: ascS.deg },
      mc: { lon: mcS.lon, sign: mcS.name, glyph: mcS.glyph, deg: mcS.deg },
      bodies: bodies, houses: houses
    };
  }

  window.TCRChart = { geocode: geocode, computeChart: computeChart, computeFullChart: computeFullChart, signOf: signOf, SIGNS: SIGNS };
})();
