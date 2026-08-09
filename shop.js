/* The Cosmic Reset · shop (marketplace grid + birth-details modal + checkout) */
(function () {
  "use strict";
  var CFG = window.TCR_CONFIG || {};
  var SHOP = window.TCR_SHOP || [];
  var $ = function (id) { return document.getElementById(id); };

  var yEl = $("year"); if (yEl) yEl.textContent = new Date().getFullYear();

  function sym() { return ({ USD: "$", INR: "₹", GBP: "£", EUR: "€", AUD: "A$", CAD: "C$" })[CFG.currency || "USD"] || ""; }
  function buttonId(price) { return CFG.paymentButtons && CFG.paymentButtons[price]; }
  function hasPay(price) { return !!buttonId(price) || !!(CFG.paymentLinks && CFG.paymentLinks[price]); }
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

  // ---------- render ----------
  var pgrid = $("pgrid"), tabsEl = $("tabs");
  var cats = ["All"]; SHOP.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
  var active = "All";

  cats.forEach(function (c) {
    var b = document.createElement("button"); b.className = "tab" + (c === active ? " is-active" : ""); b.textContent = c; b.dataset.cat = c;
    b.addEventListener("click", function () { active = c; Array.prototype.forEach.call(tabsEl.children, function (t) { t.classList.toggle("is-active", t.dataset.cat === c); }); render(); });
    tabsEl.appendChild(b);
  });

  function render() {
    var list = active === "All" ? SHOP : SHOP.filter(function (p) { return p.cat === active; });
    pgrid.innerHTML = list.map(function (p) {
      var art = p.image
        ? '<div class="pcard__art pcard__art--photo" style="background-image:url(\'' + p.image + '\')"><span class="pcard__art-overlay"></span>' + (p.tag ? '<span class="pcard__tag">' + p.tag + '</span>' : "") + '</div>'
        : '<div class="pcard__art">' + (p.tag ? '<span class="pcard__tag">' + p.tag + '</span>' : "") + motif(p.motif) + '</div>';
      return '<article class="pcard">' + art +
        '<div class="pcard__body">' +
          '<span class="pcard__cat">' + p.cat + '</span>' +
          '<h3 class="pcard__title">' + p.title + '</h3>' +
          '<p class="pcard__desc">' + p.desc + '</p>' +
          '<div class="pcard__stars" aria-hidden="true">★★★★★</div>' +
          '<div class="pcard__foot"><span class="pcard__price">' + sym() + p.price + '</span>' +
          (hasPay(p.price)
            ? '<button class="btn btn--yellow btn--sm" data-shop="' + p.id + '">' + (p.personalized ? "Get mine" : "Buy") + '</button>'
            : '<span class="pcard__soon">Coming soon</span>') +
          '</div>' +
        '</div></article>';
    }).join("");
  }
  render();

  // ---------- modal ----------
  var modal = $("buyModal"), mBirth = $("mBirth"), current = null;
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS_IN = [31,29,31,30,31,30,31,31,30,31,30,31];
  var mMonth = $("mMonth"), mDay = $("mDay"), mYear = $("mYear"), mTime = $("mTime"), mPlace = $("mPlace"), mPlaceResults = $("mPlaceResults"), mEmail = $("mEmail");

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
    mBuy.hidden = false; mBuy.textContent = "Continue to payment";
    $("mRzp").innerHTML = "";
    modal.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-shop]"); if (b) { var p = SHOP.filter(function (x) { return x.id === b.getAttribute("data-shop"); })[0]; if (p) openModal(p); return; }
    if (e.target.closest("[data-close]")) { closeModal(); return; }
    if (!e.target.closest(".field--place")) hideP();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  $("mBuy").addEventListener("click", function () {
    if (!current) return;
    var email = (mEmail.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Enter a valid delivery email."); mEmail.focus(); return; }
    var order = { email: email, product: current.title, price: current.price };
    if (current.personalized) {
      var yr = parseInt(mYear.value, 10);
      if (!yr || yr < 1900 || yr > 2030) { toast("Enter your birth year (1900 to 2030)."); mYear.focus(); return; }
      if (!selPlace && mPlace.value.trim().length < 2) { toast("Add your birth city."); mPlace.focus(); return; }
      order.birth = mYear.value + "-" + mMonth.value + "-" + mDay.value + " " + (mTime.value || "12:00");
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
