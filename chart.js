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

  window.TCRChart = { geocode: geocode, computeChart: computeChart, signOf: signOf, SIGNS: SIGNS };
})();
