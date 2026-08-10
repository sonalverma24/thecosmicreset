/* The Cosmic Reset · home page logic (Vedic chart + inline guide builder + checkout) */
(function () {
  "use strict";

  var CFG = window.TCR_CONFIG || {};
  var PERS = window.TCR_PERSONALIZED || { deliveryHours: 24, focuses: [] };
  var SIGNS = window.TCR_SIGNS || [];
  var $ = function (id) { return document.getElementById(id); };

  var yEl = $("year"); if (yEl) yEl.textContent = new Date().getFullYear();

  // ---------- toast ----------
  var toastEl = $("toast"), toastTimer;
  function toast(msg, ms) { if (!toastEl) return; toastEl.innerHTML = msg; toastEl.classList.add("is-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, ms || 4200); }

  // ---------- nav scroll ----------
  var nav = $("nav"), hero = document.querySelector(".hero");
  if (nav && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { nav.classList.toggle("is-scrolled", e.intersectionRatio < 0.35); }); }, { threshold: [0, 0.35, 1] }).observe(hero);
  }

  function sym() { return ({ USD: "$", INR: "₹", GBP: "£", EUR: "€", AUD: "A$", CAD: "C$" })[CFG.currency || "USD"] || ""; }

  // ---------- hero typewriter ----------
  var typeEl = $("typeWord");
  if (typeEl) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var WORDS = ["career", "relationships", "money", "wellbeing"];
    if (reduce) {
      var wi = 0; typeEl.textContent = WORDS[0];
      setInterval(function () { wi = (wi + 1) % WORDS.length; typeEl.textContent = WORDS[wi]; }, 2200);
    } else {
      var w = 0, ch = 0, deleting = false;
      typeEl.textContent = "";
      (function tick() {
        var word = WORDS[w];
        if (!deleting) {
          ch++; typeEl.textContent = word.slice(0, ch);
          if (ch === word.length) { deleting = true; return setTimeout(tick, 1300); }
          return setTimeout(tick, 80);
        } else {
          ch--; typeEl.textContent = word.slice(0, ch);
          if (ch === 0) { deleting = false; w = (w + 1) % WORDS.length; return setTimeout(tick, 220); }
          return setTimeout(tick, 40);
        }
      })();
    }
  }

  // ============================================================ CHART CALCULATOR
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS_IN = [31,29,31,30,31,30,31,31,30,31,30,31];
  var bMonth = $("bMonth"), bDay = $("bDay"), bYear = $("bYear"), bTime = $("bTime"), bPlace = $("bPlace"), placeResults = $("placeResults");
  var lastChart = null, lastDate = null, lastPlace = null;

  if (bMonth && bDay) {
    MONTHS.forEach(function (n, i) { var o = document.createElement("option"); o.value = String(i + 1); o.textContent = n; bMonth.appendChild(o); });
    function fillDays() { var m = parseInt(bMonth.value, 10) || 1, max = DAYS_IN[m - 1], cur = parseInt(bDay.value, 10) || 1; bDay.innerHTML = ""; for (var d = 1; d <= max; d++) { var o = document.createElement("option"); o.value = String(d); o.textContent = String(d); bDay.appendChild(o); } bDay.value = String(Math.min(cur, max)); }
    bMonth.value = "1"; fillDays(); bMonth.addEventListener("change", fillDays);
  }

  var selectedPlace = null, geoTimer;
  function hidePlaces() { if (placeResults) { placeResults.hidden = true; placeResults.innerHTML = ""; } }
  function showPlaces(list) {
    if (!placeResults) return;
    if (!list.length) { hidePlaces(); return; }
    placeResults.innerHTML = "";
    list.forEach(function (p) { var li = document.createElement("li"); var b = document.createElement("button"); b.type = "button"; b.textContent = p.label; b.addEventListener("click", function () { selectedPlace = p; bPlace.value = p.label; hidePlaces(); }); li.appendChild(b); placeResults.appendChild(li); });
    placeResults.hidden = false;
  }
  if (bPlace) {
    bPlace.addEventListener("input", function () { selectedPlace = null; var q = bPlace.value.trim(); clearTimeout(geoTimer); if (q.length < 2) { hidePlaces(); return; } geoTimer = setTimeout(function () { window.TCRChart.geocode(q).then(showPlaces); }, 300); });
    document.addEventListener("click", function (e) { if (!e.target.closest(".field--place")) hidePlaces(); });
  }

  function setText(id, t) { var el = $(id); if (el) el.textContent = t; }
  function setSign(id, idx, base) { var el = $(id); if (!el) return; el.className = (base ? base + " " : "") + "zsign"; el.style.setProperty("--zs", "url('assets/signs/" + SIGNS[idx].id + ".png')"); }

  function renderChart(c, date) {
    lastChart = c; lastDate = date;
    setSign("rSunG", c.sun.index, "chart__glyph"); setText("rSun", c.sun.name);
    setSign("rMoonG", c.moon.index, "chart__glyph"); setText("rMoon", c.moon.name);
    setSign("rRiseG", c.rising.index, "chart__glyph"); setText("rRise", c.rising.name);
    setText("rCareer", c.career.name); setSign("rCareerG", c.career.index, "");
    var noTime = (date.h === 12 && date.min === 0);
    setText("rSrc", "Sidereal." + (noTime ? " Rising is an estimate; add an exact birth time for precision." : ""));
    var res = $("chartResult"); res.hidden = false; requestAnimationFrame(function () { res.classList.add("is-show"); });
    updateBuilder();
    res.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var chartForm = $("chartForm"), chartBtn = $("chartBtn");
  if (chartForm) {
    chartForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var m = parseInt(bMonth.value, 10), d = parseInt(bDay.value, 10), yr = parseInt(bYear.value, 10);
      if (!yr || yr < 1900 || yr > 2030) { toast("Enter a birth year between 1900 and 2030."); bYear.focus(); return; }
      var tm = (bTime.value || "12:00").split(":"), h = parseInt(tm[0], 10) || 0, min = parseInt(tm[1], 10) || 0;
      var date = { y: yr, m: m, d: d, h: h, min: min };
      function go(place) { lastPlace = place; chartBtn.disabled = false; chartBtn.textContent = "Reveal my chart"; window.TCRChart.computeChart(date, place).then(function (c) { renderChart(c, date); }).catch(function () { toast("Couldn't read that chart. Check the details and try again."); }); }
      if (selectedPlace) { go(selectedPlace); return; }
      var q = bPlace.value.trim();
      if (q.length < 2) { toast("Add your birth city so we can find your Rising sign."); bPlace.focus(); return; }
      chartBtn.disabled = true; chartBtn.textContent = "Finding city…";
      window.TCRChart.geocode(q).then(function (list) { if (!list.length) { chartBtn.disabled = false; chartBtn.textContent = "Reveal my chart"; toast("Couldn't find that city. Try a nearby larger city."); return; } selectedPlace = list[0]; bPlace.value = list[0].label; go(list[0]); });
    });
  }

  // ============================================================ INLINE BUILDER
  var pFocus = $("pFocus"), pEmail = $("pEmail"), buildPrice = $("buildPrice"), buildBtn = $("buildBtn");
  if (pFocus) {
    PERS.focuses.forEach(function (f, i) { var o = document.createElement("option"); o.value = String(i); o.textContent = f.label + " (" + sym() + f.price + ")"; pFocus.appendChild(o); });
    pFocus.value = String(Math.max(0, PERS.focuses.length - 1));
    pFocus.addEventListener("change", updateBuilder);
  }
  function currentFocus() { return PERS.focuses[parseInt(pFocus.value, 10) || 0] || { label: "", price: 0, key: "" }; }
  function updateBuilder() {
    var f = currentFocus();
    if (buildPrice) buildPrice.textContent = sym() + f.price;
    var note = $("buildNote"), rz = $("buildRzp");
    if (rz) rz.innerHTML = "";
    if (buildBtn) buildBtn.hidden = false;
    if (hasPay(f.price)) {
      if (buildBtn) buildBtn.textContent = "Get my guide";
      if (note) note.textContent = "Made to order · delivered within 24 hours · secure checkout.";
    } else {
      if (buildBtn) buildBtn.textContent = "Join the waitlist";
      if (note) note.textContent = "Personalised guides launch soon. Join the waitlist and we'll build yours first.";
    }
  }

  if (buildBtn) {
    buildBtn.addEventListener("click", function () {
      if (!lastChart) { toast("Calculate your chart first."); return; }
      var email = (pEmail.value || "").trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Enter a valid delivery email."); pEmail.focus(); return; }
      var f = currentFocus();
      var combo = "Sun " + lastChart.sun.name + " · Moon " + lastChart.moon.name + " · Rising " + lastChart.rising.name + " · " + f.label;
      var order = {
        email: email, sun: lastChart.sun.name, moon: lastChart.moon.name, rising: lastChart.rising.name,
        career: lastChart.career.name, focus: f.label, price: f.price,
        birth: (lastDate ? (lastDate.y + "-" + lastDate.m + "-" + lastDate.d + " " + lastDate.h + ":" + lastDate.min) : ""),
        place: (lastPlace ? lastPlace.label : "")
      };
      var id = buttonId(f.price);
      if (id) {
        postOrder(order);
        renderRzpButton($("buildRzp"), id);
        buildBtn.hidden = true;
        var note = $("buildNote"); if (note) note.textContent = "Your details are saved. Complete your " + sym() + f.price + " payment with the button below.";
        return;
      }
      if ((CFG.paymentLinks && CFG.paymentLinks[f.price]) || CFG.razorpayKeyId) {
        openRazorpay(f.price, "Personalized sidereal guide · " + combo, Object.assign({ type: "order" }, order), function (resp) {
          postOrder(Object.assign({ payment_id: (resp && resp.razorpay_payment_id) || "" }, order));
          toast("Order received ✦ Your guide reaches <b>" + email + "</b> within " + PERS.deliveryHours + " hours.", 6000);
        });
        return;
      }
      // coming soon: capture to the waitlist
      postSubscriber(email, "guide waitlist: " + combo);
      toast("You're on the waitlist ✦ We'll email <b>" + email + "</b> the moment personalised guides open.", 6000);
    });
  }

  // ============================================================ CHECKOUT + CAPTURE
  function buttonId(price) { return CFG.paymentButtons && CFG.paymentButtons[price]; }
  function hasPay(price) { return !!buttonId(price) || !!(CFG.paymentLinks && CFG.paymentLinks[price]) || !!CFG.razorpayKeyId; }
  function renderRzpButton(container, id) {
    if (!container) return;
    container.innerHTML = "";
    var form = document.createElement("form");
    var s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/payment-button.js";
    s.setAttribute("data-payment_button_id", id);
    s.async = true;
    form.appendChild(s); container.appendChild(form);
  }
  function postSubscriber(email, source) {
    if (!CFG.sheetsEndpoint) return;
    fetch(CFG.sheetsEndpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams({ type: "subscriber", email: email, source: source, ts: new Date().toISOString() }) }).catch(function () {});
  }
  function openRazorpay(price, description, notes, onSuccess) {
    // hosted payment-link path (no Razorpay Key ID needed): save details, then open the link
    var link = CFG.paymentLinks && CFG.paymentLinks[price];
    if (link) {
      var o = {}; Object.keys(notes || {}).forEach(function (k) { if (k !== "type") o[k] = notes[k]; });
      postOrder(o);
      window.open(link, "_blank", "noopener");
      toast("Opening secure checkout in a new tab. Your details are saved.", 6000);
      return;
    }
    if (!CFG.razorpayKeyId) { toast("Checkout is in preview. Add your Razorpay Key ID or a payment link in <b>config.js</b> to take live payments."); return; }
    if (typeof Razorpay === "undefined") { toast("Payment library is still loading. Try again in a moment."); return; }
    var opts = { key: CFG.razorpayKeyId, amount: Math.round(price * 100), currency: CFG.currency || "USD", name: CFG.brandName || "The Cosmic Reset", description: description, theme: { color: CFG.themeColor || "#2C0A71" }, notes: notes || {}, handler: function (r) { if (onSuccess) onSuccess(r); }, modal: { ondismiss: function () {} } };
    if (notes && notes.email) opts.prefill = { email: notes.email };
    var rzp = new Razorpay(opts);
    rzp.on("payment.failed", function () { toast("Payment didn't go through. No charge was made. Please try again."); });
    rzp.open();
  }
  function postOrder(o) {
    if (!CFG.sheetsEndpoint) return;
    var body = new URLSearchParams(); body.append("type", "order"); body.append("ts", new Date().toISOString());
    Object.keys(o).forEach(function (k) { body.append(k, o[k]); });
    fetch(CFG.sheetsEndpoint, { method: "POST", mode: "no-cors", body: body }).catch(function () {});
  }
  window.TCR_openRazorpay = openRazorpay; window.TCR_postOrder = postOrder; // shared with shop.js

  // ============================================================ REVEAL
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".section-head, .calc__inner, .review").forEach(function (n) { n.classList.add("reveal"); io.observe(n); });
  }
})();
