/* The Cosmic Reset · shop (marketplace grid + birth-details modal + checkout) */
(function () {
  "use strict";
  var CFG = window.TCR_CONFIG || {};
  var SHOP = window.TCR_SHOP || [];
  var $ = function (id) { return document.getElementById(id); };

  var yEl = $("year"); if (yEl) yEl.textContent = new Date().getFullYear();

  function sym() { return ({ USD: "$", INR: "₹", GBP: "£", EUR: "€", AUD: "A$", CAD: "C$" })[CFG.currency || "USD"] || ""; }
  function buttonId(price) { return CFG.paymentButtons && CFG.paymentButtons[price]; }
  function hasPay(price) { return !!buttonId(price) || !!(CFG.paymentLinks && CFG.paymentLinks[price]) || !!CFG.razorpayKeyId; }
  function renderRzpButton(container, id) {
    container.innerHTML = "";
    var form = document.createElement("form");
    var s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/payment-button.js";
    s.setAttribute("data-payment_button_id", id);
    s.async = true;
    form.appendChild(s); container.appendChild(form);
  }

  // ---------- toast ----------
  var toastEl = $("toast"), toastTimer;
  function toast(m, ms) { if (!toastEl) return; toastEl.innerHTML = m; toastEl.classList.add("is-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, ms || 4200); }

  // ---------- nav scroll ----------
  var nav = $("nav"), sh = document.querySelector(".shop-hero");
  if (nav && sh && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { nav.classList.toggle("is-scrolled", e.intersectionRatio < 0.35); }); }, { threshold: [0, 0.35, 1] }).observe(sh);
  }

  // ---------- motifs (white line art) ----------
  function motif(kind) {
    var s = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">';
    switch (kind) {
      case "sun": s += '<circle cx="50" cy="50" r="16" fill="#fff" stroke="none"/>' + rays(); break;
      case "moon": s += '<path d="M62 22a30 30 0 1 0 0 56 24 24 0 1 1 0-56z" fill="#fff" stroke="none"/>'; break;
      case "venus": s += '<circle cx="50" cy="38" r="18"/><line x1="50" y1="56" x2="50" y2="86"/><line x1="38" y1="72" x2="62" y2="72"/>'; break;
      case "saturn": s += '<circle cx="50" cy="48" r="16"/><ellipse cx="50" cy="48" rx="32" ry="11" transform="rotate(-20 50 48)"/>'; break;
      case "orbit": s += '<circle cx="50" cy="50" r="7" fill="#fff" stroke="none"/><ellipse cx="50" cy="50" rx="34" ry="16" transform="rotate(-24 50 50)"/><circle cx="82" cy="42" r="4" fill="#fff" stroke="none"/>'; break;
      default: s += '<path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="#fff" stroke="none"/>'; // star
    }
    return s + "</svg>";
  }
  function rays() { var o = "", i, a, x1, y1, x2, y2; for (i = 0; i < 8; i++) { a = i * Math.PI / 4; x1 = 50 + Math.cos(a) * 24; y1 = 50 + Math.sin(a) * 24; x2 = 50 + Math.cos(a) * 32; y2 = 50 + Math.sin(a) * 32; o += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>'; } return o; }

  // ---------- render (three depth tiers, left vertical tabs) ----------
  var SECTIONS = window.TCR_SECTIONS || [];
  var pgrid = $("pgrid"), tabsEl = $("shoptabs");
  var active = SECTIONS.length ? SECTIONS[0].key : "";

  function depthDots(d) { var o = '<span class="shoptab__depth" aria-hidden="true">'; for (var i = 1; i <= 3; i++) o += '<i class="' + (i <= d ? "on" : "") + '"></i>'; return o + "</span>"; }
  SECTIONS.forEach(function (s) {
    var b = document.createElement("button"); b.className = "shoptab"; b.type = "button"; b.dataset.section = s.key;
    b.innerHTML = '<span class="shoptab__num">' + s.num + '</span>' +
      '<span class="shoptab__body"><span class="shoptab__title">' + s.title + '</span>' +
      '<span class="shoptab__tag">' + s.tag + '</span>' +
      '<span class="shoptab__meta"><span class="shoptab__price">' + s.price + '</span>' + depthDots(s.depth) + '</span></span>';
    b.addEventListener("click", function () { setActive(s.key); });
    tabsEl.appendChild(b);
  });

  function art(p) {
    if (p.image) return '<div class="pcard__art pcard__art--photo" style="background-image:url(\'' + p.image + '\')"><span class="pcard__art-overlay"></span>' + (p.tag ? '<span class="pcard__tag">' + p.tag + '</span>' : "") + '</div>';
    if (p.sign) return '<div class="pcard__art pcard__art--sign">' + (p.tag ? '<span class="pcard__tag">' + p.tag + '</span>' : "") + '<span class="pcard__sign zsign" style="--zs:url(\'assets/signs/' + p.sign + '.png\')" aria-hidden="true"></span></div>';
    return '<div class="pcard__art">' + (p.tag ? '<span class="pcard__tag">' + p.tag + '</span>' : "") + motif(p.motif) + '</div>';
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function isAvail(p) { return p.available === true; }
  function tileName(p) { return p.sign ? cap(p.sign) : p.title.replace(/ Guide$| Reading$/, ""); }
  function tileThumb(p) {
    return p.sign
      ? '<span class="stile__g zsign" style="--zs:url(\'assets/signs/' + p.sign + '.png\')" aria-hidden="true"></span>'
      : '<span class="stile__img" style="background-image:url(\'' + p.image + '\')"></span>';
  }
  function render() {
    var list = SHOP.filter(function (p) { return p.section === active; });
    pgrid.className = "stilegrid";
    pgrid.innerHTML = list.map(function (p) {
      var soon = !isAvail(p);
      return '<button class="stile' + (soon ? " stile--soon" : "") + '" type="button" data-sign-open="' + p.id + '">' +
        (soon ? '<span class="stile__soon">Soon</span>' : (p.bestseller ? '<span class="stile__best">Bestseller</span>' : "")) +
        tileThumb(p) +
        '<span class="stile__n">' + tileName(p) + '</span></button>';
    }).join("");
  }

  // ---------- guide info popup ----------
  var signModal = $("signModal"), currentSign = null;
  function closeSign() { if (signModal) { signModal.hidden = true; document.body.style.overflow = ""; } }
  function whyText(p) {
    if (p.section === "personal") return p.desc.replace(/\.$/, "") + ", built entirely from your birth chart, not your Sun sign, and delivered to your inbox within 24 hours.";
    var s = cap(p.sign), trait = p.desc.replace(/\.$/, "").toLowerCase();
    if (p.section === "playbook") return "The " + s + " Playbook is the full deep dive into being a " + s + ": " + trait + ". A complete read of your strengths, blind spots and how to actually use them.";
    return "A fast, no-fluff read on the " + s + " pattern: " + trait + ". You'll see what drives you, where you get stuck, and one clear way to work with it.";
  }
  function insideList(p) {
    if (p.section === "personal") return ["A reading built from your exact placements", "Written for you, not your zodiac sign", "Practical, specific and calm", "Delivered to your inbox in 24 hours"];
    var s = cap(p.sign);
    if (p.section === "playbook") return ["A full read of the " + s + " personality", "Love, sex and how you attach", "Career, money and ambition", "Your shadow and how to meet it", "Practical resets and prompts throughout"];
    return ["Your core " + s + " pattern on one page", "Your strengths and blind spots", "How you love, work and recover", "One reset to work with your nature"];
  }
  function openSign(p) {
    currentSign = p;
    var g = $("smGlyph");
    if (p.sign) { g.style.display = ""; g.style.setProperty("--zs", "url('assets/signs/" + p.sign + ".png')"); } else { g.style.display = "none"; }
    $("smCat").textContent = p.cat;
    $("smTitle").textContent = p.title;
    $("smPrice").textContent = sym() + p.price + (p.personalized ? " · delivered in 24 hours" : " · instant download");
    $("smWhy").textContent = whyText(p);
    $("smInside").innerHTML = insideList(p).map(function (i) { return "<li>" + i + "</li>"; }).join("");
    var avail = isAvail(p);
    $("smBuyArea").hidden = !avail; $("smSoon").hidden = avail;
    var b = $("smBuy"); b.hidden = false; b.textContent = "Buy now"; $("smRzp").innerHTML = ""; $("smNote").textContent = "";
    signModal.hidden = false; document.body.style.overflow = "hidden";
  }
  $("smBuy").addEventListener("click", function () {
    if (!currentSign) return;
    var email = ($("smEmail").value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { $("smNote").textContent = "Enter a valid delivery email."; return; }
    var p = currentSign, order = { type: "order", product: p.title, price: p.price, email: email };
    var id = buttonId(p.price);
    if (id) { postOrder({ email: email, product: p.title, price: p.price }); renderRzpButton($("smRzp"), id); $("smBuy").hidden = true; $("smNote").textContent = "Your email is saved. Complete your " + sym() + p.price + " payment below."; return; }
    openRazorpay(p.price, p.title + " · " + sym() + p.price, order, function (resp) {
      postOrder({ email: email, product: p.title, price: p.price, payment_id: (resp && resp.razorpay_payment_id) || "" });
      closeSign(); toast("Payment received ✦ your <b>" + p.title + "</b> is on its way to " + email + ". Check your inbox (and spam) for the PDF.", 7000);
    });
  });
  function setActive(key) {
    active = key;
    Array.prototype.forEach.call(tabsEl.children, function (t) { t.classList.toggle("is-active", t.dataset.section === key); });
    render();
    try { history.replaceState(null, "", "#" + key); } catch (e) { location.hash = key; }
  }
  var h = (location.hash || "").replace("#", "");
  if (h && SECTIONS.some(function (s) { return s.key === h; })) active = h;
  setActive(active);
  window.addEventListener("hashchange", function () { var k = (location.hash || "").replace("#", ""); if (SECTIONS.some(function (s) { return s.key === k; })) setActive(k); });

  // ---------- modal ----------
  var modal = $("buyModal"), mBirth = $("mBirth"), current = null;
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS_IN = [31,29,31,30,31,30,31,31,30,31,30,31];
  var mName = $("mName"), mMonth = $("mMonth"), mDay = $("mDay"), mYear = $("mYear"), mTime = $("mTime"), mPlace = $("mPlace"), mPlaceResults = $("mPlaceResults"), mEmail = $("mEmail");

  MONTHS.forEach(function (n, i) { var o = document.createElement("option"); o.value = String(i + 1); o.textContent = n; mMonth.appendChild(o); });
  function fillDays() { var m = parseInt(mMonth.value, 10) || 1, max = DAYS_IN[m - 1], cur = parseInt(mDay.value, 10) || 1; mDay.innerHTML = ""; for (var d = 1; d <= max; d++) { var o = document.createElement("option"); o.value = String(d); o.textContent = String(d); mDay.appendChild(o); } mDay.value = String(Math.min(cur, max)); }
  mMonth.value = "1"; fillDays(); mMonth.addEventListener("change", fillDays);

  var selPlace = null, geoTimer;
  function hideP() { mPlaceResults.hidden = true; mPlaceResults.innerHTML = ""; }
  mPlace.addEventListener("input", function () {
    selPlace = null; var q = mPlace.value.trim(); clearTimeout(geoTimer);
    if (q.length < 2) { hideP(); return; }
    geoTimer = setTimeout(function () { window.TCRChart.geocode(q).then(function (list) { if (!list.length) { hideP(); return; } mPlaceResults.innerHTML = ""; list.forEach(function (pl) { var li = document.createElement("li"); var b = document.createElement("button"); b.type = "button"; b.textContent = pl.label; b.addEventListener("click", function () { selPlace = pl; mPlace.value = pl.label; hideP(); }); li.appendChild(b); mPlaceResults.appendChild(li); }); mPlaceResults.hidden = false; }); }, 300);
  });

  function openModal(p) {
    current = p;
    $("mCat").textContent = p.cat;
    $("mTitle").textContent = p.title;
    $("mPrice").textContent = sym() + p.price + (p.personalized ? " · delivered within 24 hours" : " · instant download");
    $("mNote").textContent = p.personalized ? "Made to order from your birth details." : "Instant digital download after payment.";
    mBirth.hidden = !p.personalized;
    var mBuy = $("mBuy");
    mBuy.hidden = false; mBuy.textContent = buttonId(p.price) ? "Continue to payment" : ("Pay " + sym() + p.price);
    $("mRzp").innerHTML = "";
    modal.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-sign-open]"); if (t) { var sp = SHOP.filter(function (x) { return x.id === t.getAttribute("data-sign-open"); })[0]; if (sp) openSign(sp); return; }
    var b = e.target.closest("[data-shop]"); if (b) { var p = SHOP.filter(function (x) { return x.id === b.getAttribute("data-shop"); })[0]; if (p) openModal(p); return; }
    if (e.target.closest("[data-sclose]")) { closeSign(); return; }
    if (e.target.closest("[data-close]")) { closeModal(); return; }
    if (!e.target.closest(".field--place")) hideP();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (signModal && !signModal.hidden) closeSign(); else if (!modal.hidden) closeModal(); } });

  $("mBuy").addEventListener("click", function () {
    if (!current) return;
    var email = (mEmail.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Enter a valid delivery email."); mEmail.focus(); return; }
    var order = { email: email, product: current.title, price: current.price };
    if (current.personalized) {
      var name = (mName.value || "").trim();
      if (name.length < 2) { toast("Add the name for the reading."); mName.focus(); return; }
      var yr = parseInt(mYear.value, 10);
      if (!yr || yr < 1900 || yr > 2030) { toast("Enter your birth year (1900 to 2030)."); mYear.focus(); return; }
      if (!selPlace && mPlace.value.trim().length < 2) { toast("Add your birth city."); mPlace.focus(); return; }
      var t = (mTime.value || "").trim();
      order.name = name;
      order.birth = mYear.value + "-" + mMonth.value + "-" + mDay.value + (t ? " " + t : " (time not provided)");
      order.place = selPlace ? selPlace.label : mPlace.value.trim();
    }

    var id = buttonId(current.price);
    if (id) {
      // save the buyer's details first, then render the real Razorpay button to pay
      postOrder(order);
      renderRzpButton($("mRzp"), id);
      $("mBuy").hidden = true;
      $("mNote").textContent = "Your details are saved. Complete your " + sym() + current.price + " payment with the secure Razorpay button below.";
      return;
    }
    // fallback: hosted payment link (opens in a new tab)
    openRazorpay(current.price, current.title + " · " + sym() + current.price, Object.assign({ type: "order" }, order), function (resp) {
      postOrder(Object.assign({ payment_id: (resp && resp.razorpay_payment_id) || "" }, order));
      closeModal();
      toast("Payment received ✦ A confirmation is on its way to <b>" + email + "</b>.", 6000);
    });
  });

  // ---------- checkout + capture ----------
  function openRazorpay(price, description, notes, onSuccess) {
    // hosted payment-link path (no Razorpay Key ID needed): save details, then open the link
    var link = CFG.paymentLinks && CFG.paymentLinks[price];
    if (link) {
      var o = {}; Object.keys(notes || {}).forEach(function (k) { if (k !== "type") o[k] = notes[k]; });
      postOrder(o);
      closeModal();
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
})();
