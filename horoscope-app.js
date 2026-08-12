/* The Cosmic Reset · monthly horoscope page (picker + reading render) */
(function () {
  "use strict";
  var H = window.TCR_HOROSCOPE || { signs: [], sky: [] };
  var $ = function (id) { return document.getElementById(id); };

  var yEl = $("year"); if (yEl) yEl.textContent = new Date().getFullYear();

  // nav turns opaque once the purple hero scrolls past
  var nav = $("nav"), heroEl = document.querySelector(".horo-hero");
  if (nav && heroEl && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { nav.classList.toggle("is-scrolled", e.intersectionRatio < 0.35); }); }, { threshold: [0, 0.35, 1] }).observe(heroEl);
  }

  // month labels + hero hook (data-driven so each month is a one-file edit)
  Array.prototype.forEach.call(document.querySelectorAll("[data-month]"), function (el) { el.textContent = H.month; });
  var htEl = $("heroTitle"); if (htEl && H.heroTitle) htEl.textContent = H.heroTitle;
  var hsEl = $("heroSub"); if (hsEl && H.heroSub) hsEl.textContent = H.heroSub;

  /* ---------- section icons (inline line SVG) ---------- */
  function ico(kind) {
    var s = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
    switch (kind) {
      case "overall": s += '<path d="M12 3l2.1 5.2L19.5 9l-4 3.6 1.1 5.4L12 15.4 7.4 18l1.1-5.4L4.5 9l5.4-.8z"/>'; break;
      case "love": s += '<path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.6 12 20 12 20z"/>'; break;
      case "career": s += '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/><path d="M3.5 12.5h17"/>'; break;
      case "health": s += '<path d="M12 20C7 16.6 4 13.6 4 9.8A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 8 1.8c0 .9-.2 1.7-.5 2.4"/><path d="M13 12h3l-2 3 3 0"/>'; break;
      case "purpose": s += '<circle cx="12" cy="12" r="8.2"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'; break;
      case "lucky": s += '<path d="M20 13.5A7.5 7.5 0 1 1 10.5 4a6 6 0 0 0 9.5 9.5z"/><path d="M17 4.5l.5 1.4L19 6.4l-1.5.5L17 8.3l-.5-1.4L15 6.4l1.5-.5z"/>'; break;
      default: s += '<circle cx="12" cy="12" r="8"/>';
    }
    return s + "</svg>";
  }
  var GLYPHS = { jupiter: "♃", venus: "♀", mars: "♂", sun: "☉" };
  function skyIcon(kind) {
    if (kind === "newmoon") return '<span class="skymoon skymoon--new" aria-hidden="true"></span>';
    if (kind === "fullmoon") return '<span class="skymoon skymoon--full" aria-hidden="true"></span>';
    return '<span class="skyglyph" aria-hidden="true">' + (GLYPHS[kind] || "✦") + '</span>';
  }

  function dots(n) {
    var o = '<span class="hrate__dots" aria-hidden="true">';
    for (var i = 1; i <= 5; i++) o += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return o + "</span>";
  }

  /* ---------- sky strip ---------- */
  var skyEl = $("skyStrip");
  if (skyEl) {
    skyEl.innerHTML = H.sky.map(function (e) {
      return '<div class="skycard">' +
        '<span class="skycard__icon">' + skyIcon(e.icon) + '</span>' +
        '<div class="skycard__body"><span class="skycard__when">' + e.when + '</span>' +
        '<span class="skycard__title">' + e.title + '</span>' +
        '<span class="skycard__text">' + e.body + '</span></div></div>';
    }).join("");
  }

  /* ---------- sign picker ---------- */
  var pick = $("signPick"), readEl = $("reading"), current = null;
  H.signs.forEach(function (s) {
    var b = document.createElement("button");
    b.className = "spick"; b.type = "button"; b.dataset.sign = s.id;
    b.innerHTML = '<span class="spick__glyph zsign" style="--zs:url(\'assets/signs/' + s.id + '.png\')" aria-hidden="true"></span>' +
      '<span class="spick__name">' + s.name + '</span>' +
      '<span class="spick__dates">' + s.dates + '</span>';
    b.addEventListener("click", function () { select(s.id, true); });
    pick.appendChild(b);
  });

  function stars(label, kind, n) {
    return '<div class="hrate"><span class="hrate__ico">' + ico(kind) + '</span>' +
      '<span class="hrate__label">' + label + '</span>' + dots(n) + '</div>';
  }
  function section(kind, title, text) {
    return '<article class="hcard hcard--' + kind + '">' +
      '<span class="hcard__icon">' + ico(kind) + '</span>' +
      '<h3 class="hcard__title">' + title + '</h3>' +
      '<p class="hcard__text">' + text + '</p></article>';
  }

  function render(s) {
    var chips = s.lucky.dates.map(function (d) { return '<span class="luckchip">' + d + '</span>'; }).join("");
    readEl.innerHTML =
      '<div class="horohead" style="--img:url(\'' + s.img + '\')">' +
        '<div class="horohead__in">' +
          '<span class="horohead__glyph" aria-hidden="true">' + s.glyph + '</span>' +
          '<div class="horohead__id">' +
            '<span class="horohead__el">' + s.element + ' · ' + s.dates + '</span>' +
            '<h2 class="horohead__name">' + s.name + '</h2>' +
            '<p class="horohead__key">"' + s.keyword + '"</p>' +
            '<p class="horohead__mood">' + s.mood + '</p>' +
          '</div>' +
          '<div class="horohead__rates">' +
            stars("Love", "love", s.ratings.love) +
            stars("Career", "career", s.ratings.career) +
            stars("Health", "health", s.ratings.health) +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="hsections">' +
        section("overall", "The big picture", s.overall) +
        section("love", "Love", s.love) +
        section("career", "Career & money", s.career) +
        section("health", "Health & energy", s.health) +
        section("purpose", "Purpose", s.purpose) +
        '<article class="hcard hcard--lucky hcard--wide">' +
          '<span class="hcard__icon">' + ico("lucky") + '</span>' +
          '<h3 class="hcard__title">Your lucky dates</h3>' +
          '<div class="luckchips">' + chips + '</div>' +
          '<p class="hcard__text">' + s.lucky.note + '</p>' +
        '</article>' +
      '</div>' +
      '<div class="horo-cta">' +
        '<p>Want this about <b>your</b> exact chart, not just your Sun sign?</p>' +
        '<a class="btn btn--yellow" href="shop.html#personal">Get my personalised guide · from $10</a>' +
      '</div>';
  }

  function select(id, scroll) {
    var s = H.signs.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    current = id;
    Array.prototype.forEach.call(pick.children, function (b) { b.classList.toggle("is-active", b.dataset.sign === id); });
    render(s);
    readEl.hidden = false;
    var emptyEl = $("horoEmpty"); if (emptyEl) emptyEl.hidden = true;
    try { localStorage.setItem("tcr_sign", id); } catch (e) {}
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    if (scroll) { var y = readEl.getBoundingClientRect().top + window.pageYOffset - 88; window.scrollTo({ top: y, behavior: "smooth" }); }
  }

  // deep link: ?sign= or #sign, else last choice
  function initSign() {
    var q = new URLSearchParams(location.search).get("sign");
    var hash = (location.hash || "").replace("#", "");
    var saved = null; try { saved = localStorage.getItem("tcr_sign"); } catch (e) {}
    var pickId = [q, hash, saved].filter(Boolean).find(function (id) { return H.signs.some(function (s) { return s.id === id; }); });
    if (pickId) select(pickId, false);
  }
  initSign();
})();
