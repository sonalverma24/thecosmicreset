/* ============================================================
   THE COSMIC RESET · STORE CONFIG
   This is the ONLY file you edit to go live. No other code changes.
   ============================================================ */

window.TCR_CONFIG = {
  /* 1) RAZORPAY: PUBLIC key id only (starts with rzp_live_ or rzp_test_).
        The public Key ID is safe in the browser and powers in-page checkout for
        every price. NEVER put the KEY SECRET here or anywhere in this site: a
        secret in client code lets anyone charge/refund your account. */
  razorpayKeyId: "rzp_live_TNw6WIacfrASYT",

  /* Currency for charges. Your Razorpay account must have this currency enabled.
     Prices below are in whole units of this currency ($15, $12, $5).
     USD needs International Payments switched on in Razorpay.
     India-only account? Set this to "INR" and change the prices to rupees. */
  currency: "USD",

  /* 2) GOOGLE SHEET: paste the Web App URL from your Apps Script deployment.
        Leave blank to keep subscribe as an on-screen confirmation only. */
  sheetsEndpoint: "https://script.google.com/macros/s/AKfycbxEIqVWY7-jDlDuScq4BdJTLfTnb2hMS-HsR243CM5DmndFJaTiq5vTFHnrNhdLGDKP/exec",

  /* 2b) HOSTED PAYMENT BUTTONS (no Key ID needed).
        Create a fixed-amount payment link for each price (Razorpay Payment Link/
        Payment Page, Stripe Payment Link, PayPal, Gumroad, Ko-fi, etc.) and paste
        the URL next to the matching amount. When a link is set, the Buy button
        opens it in a new tab, and we save the buyer's details to your Sheet first.
        This is the simplest way to take real payments without the Razorpay API key. */
  paymentLinks: {
    1: "",   // quick reads
    12: "",  // journals
    19: "",  // personalized single-focus guides
    29: "",  // full chart reading + journal trio
  },

  /* 2c) RAZORPAY PAYMENT BUTTONS by amount (the "pl_..." id from the button snippet).
        When set, the Buy flow saves the buyer's email/details to your Sheet, then
        renders the real Razorpay button for them to pay. Amounts with no button and
        no link show as "Coming soon". */
  /* Now using in-page checkout via razorpayKeyId above (works for every price),
     so hosted buttons are off. Old button ids kept here in case you want to
     switch back: 1 pl_TNjjy7SEWYvDWf · 12 pl_TNjl6N1pTg37o1 ·
     19 pl_TNlQdBwpJCni8E · 29 pl_TNlT79W9PTeuAR */
  paymentButtons: {},

  /* 3) OPTIONAL: external astrology API for certified-exact charts.
        Leave blank to use the accurate built-in engine (recommended, keyless).
        If set, it must be a URL that accepts POST {date, place} and returns
        JSON { sun, moon, ascendant, mc } as ecliptic longitudes in degrees. */
  astroEndpoint: "",

  /* OPTIONAL: Google Sign-In so people can save their full birth chart.
     Create an OAuth Client ID (type: Web) in Google Cloud Console, add your
     domain to Authorized JavaScript origins, and paste the Client ID here.
     Leave blank to use the email "Save my chart" field instead. */
  googleClientId: "",

  /* Branding shown inside the Razorpay checkout modal. */
  brandName: "The Cosmic Reset",
  themeColor: "#2C0A71",
};

/* Personalized made-to-order guides (Sun + Moon + Rising), delivered by email
   within 24h. Price depends on the chosen focus. Edit freely. */
window.TCR_PERSONALIZED = {
  deliveryHours: 24,
  focuses: [
    { key: "career", label: "Career & Money",       price: 19 },
    { key: "love",   label: "Love & Relationships",  price: 19 },
    { key: "health", label: "Health & Wellness",     price: 19 },
    { key: "purpose",label: "Purpose & Direction",   price: 19 },
    { key: "full",   label: "Full Chart (all areas)", price: 29 },
  ],
};

/* ============================================================
   SHOP: three depth tiers (left vertical tabs). 1 < 2 < 3.
   personalized:true  -> asks for birth details before checkout.
   sign:"aries" -> shows the sign graphic on the card (per-sign products).
   image:"..."  -> shows that graphic (personalised products).
   ============================================================ */
window.TCR_SECTIONS = [
  { key: "pocket",   num: "01", title: "Pocket Guides",       price: "$1",       tag: "A quick, sharp read on your sign.", depth: 1 },
  { key: "playbook", num: "02", title: "Astro Playbooks",     price: "$5",       tag: "The full deep dive into your sign.", depth: 2 },
  { key: "personal", num: "03", title: "Personalised Guides", price: "from $10", tag: "Written from your exact birth chart.", depth: 3 },
];

window.TCR_SHOP = (function () {
  var SIGNS12 = [
    ["aries", "Aries", "Courage, drive and the fire that leads."],
    ["taurus", "Taurus", "Steadiness, sensuality and building slowly."],
    ["gemini", "Gemini", "Curiosity, wit and the restless mind."],
    ["cancer", "Cancer", "Feeling, memory and the protective heart."],
    ["leo", "Leo", "Warmth, pride and the need to be seen."],
    ["virgo", "Virgo", "Precision, service and the quiet fixer."],
    ["libra", "Libra", "Balance, charm and the art of harmony."],
    ["scorpio", "Scorpio", "Depth, intensity and hard-won trust."],
    ["sagittarius", "Sagittarius", "Freedom, meaning and aiming higher."],
    ["capricorn", "Capricorn", "Ambition, discipline and the long climb."],
    ["aquarius", "Aquarius", "Vision, detachment and the outsider's logic."],
    ["pisces", "Pisces", "Empathy, imagination and soft boundaries."]
  ];
  /* which products are actually published (buyable). The rest show Coming soon. */
  var LIVE = {
    "pk-aries": 1, "pk-taurus": 1, "pk-gemini": 1, "pk-cancer": 1, "pk-leo": 1,
    "pk-virgo": 1, "pk-libra": 1, "pk-scorpio": 1, "pk-sagittarius": 1,
    "pk-capricorn": 1, "pk-aquarius": 1, "pk-pisces": 1,
    "pb-sagittarius": 1
  };
  var list = [];
  SIGNS12.forEach(function (s) { list.push({ id: "pk-" + s[0], section: "pocket", cat: "Pocket Guides", title: "The " + s[1] + " Pocket Guide", price: 1, personalized: false, sign: s[0], desc: s[2], available: !!LIVE["pk-" + s[0]] }); });
  SIGNS12.forEach(function (s) { list.push({ id: "pb-" + s[0], section: "playbook", cat: "Astro Playbooks", title: "The " + s[1] + " Playbook", price: 5, personalized: false, sign: s[0], desc: s[2], available: !!LIVE["pb-" + s[0]] }); });
  /* Personalised guides are made to order, so they are always available. */
  list.push(
    { id: "ps-full",    section: "personal", cat: "Personalised Guides", title: "Full Chart Reading",         price: 15, personalized: true, tag: "Full guide", image: "assets/graphics/g01.jpg", desc: "Your entire birth chart, read end to end.", available: true },
    { id: "ps-love",    section: "personal", cat: "Personalised Guides", title: "Love & Relationships Guide", price: 10, personalized: true, image: "assets/graphics/g03.jpg", desc: "How you attach, clash and repair.", available: true, bestseller: true },
    { id: "ps-career",  section: "personal", cat: "Personalised Guides", title: "Career & Money Guide",       price: 10, personalized: true, image: "assets/graphics/g02.jpg", desc: "Your 10th house, work style and money patterns.", available: true, bestseller: true },
    { id: "ps-health",  section: "personal", cat: "Personalised Guides", title: "Health & Wellness Guide",    price: 10, personalized: true, image: "assets/graphics/g04.jpg", desc: "Energy, stress and the body's patterns.", available: true },
    { id: "ps-purpose", section: "personal", cat: "Personalised Guides", title: "Purpose & Direction Guide",  price: 10, personalized: true, image: "assets/graphics/g05.jpg", desc: "Your nodes and 9th/10th houses: where you're headed.", available: true },
    { id: "ps-year",    section: "personal", cat: "Personalised Guides", title: "Year Ahead Guide",           price: 10, personalized: true, image: "assets/graphics/g06.jpg", desc: "The transits shaping your next twelve months.", available: true }
  );
  return list;
})();

/* ============================================================
   PRODUCTS: only buyable items need an entry here.
   'download' = a link delivered after successful payment (optional for now).
   Prices are easy to change. Journals default to $12 (edit freely).
   ============================================================ */
window.TCR_PRODUCTS = {
  // ---- Sun-Sign Guides ($15) ----
  "pb-aries":       { name: "The Aries Playbook",       price: 15, download: "" },
  "pb-taurus":      { name: "The Taurus Playbook",      price: 15, download: "" },
  "pb-sagittarius": { name: "The Sagittarius Playbook", price: 15, download: "" },

  // ---- Quick Guides ($5) ----
  "qg-wdylyt":      { name: "Why Do You Love Like That (Sagittarius)", price: 1, download: "" },
  "qg-decoder":     { name: "The Situationship Decoder",              price: 1, download: "" },

  // ---- Journals ($12, digital / printable) ----
  "jr-reset":       { name: "The Sun-Sign Reset Journal", price: 12, download: "" },
  "jr-moon":        { name: "The Moon Cycle Journal",     price: 12, download: "" },
  "jr-shadow":      { name: "The Shadow Work Journal",    price: 12, download: "" },

  // ---- Bundle (best value) ----
  "bn-journals":    { name: "The Journal Trio (all 3 journals)", price: 29, download: "" },
};

/* ============================================================
   SIGNS: the whole site is segmented by these 12.
   'available: true' means the Complete Playbook is live for that sign
   (its buyable product is "pb-<id>" above). Others show as Coming soon.
   ============================================================ */
window.TCR_SIGNS = [
  { id: "aries",       name: "Aries",       glyph: "♈", element: "Fire",  dates: "Mar 21 to Apr 19", available: true  },
  { id: "taurus",      name: "Taurus",      glyph: "♉", element: "Earth", dates: "Apr 20 to May 20", available: true  },
  { id: "gemini",      name: "Gemini",      glyph: "♊", element: "Air",   dates: "May 21 to Jun 20", available: false },
  { id: "cancer",      name: "Cancer",      glyph: "♋", element: "Water", dates: "Jun 21 to Jul 22", available: false },
  { id: "leo",         name: "Leo",         glyph: "♌", element: "Fire",  dates: "Jul 23 to Aug 22", available: false },
  { id: "virgo",       name: "Virgo",       glyph: "♍", element: "Earth", dates: "Aug 23 to Sep 22", available: false },
  { id: "libra",       name: "Libra",       glyph: "♎", element: "Air",   dates: "Sep 23 to Oct 22", available: false },
  { id: "scorpio",     name: "Scorpio",     glyph: "♏", element: "Water", dates: "Oct 23 to Nov 21", available: false },
  { id: "sagittarius", name: "Sagittarius", glyph: "♐", element: "Fire",  dates: "Nov 22 to Dec 21", available: true  },
  { id: "capricorn",   name: "Capricorn",   glyph: "♑", element: "Earth", dates: "Dec 22 to Jan 19", available: false },
  { id: "aquarius",    name: "Aquarius",    glyph: "♒", element: "Air",   dates: "Jan 20 to Feb 18", available: false },
  { id: "pisces",      name: "Pisces",      glyph: "♓", element: "Water", dates: "Feb 19 to Mar 20", available: false },
];

/* Guide categories that live inside every sign. These launch later, so they
   render as "Coming soon" with a Notify button that grows your pre-launch list.
   Add a real product later by dropping "<catKey>-<signId>" into TCR_PRODUCTS. */
window.TCR_GUIDE_CATEGORIES = [
  { key: "career",  label: "Career Guide",              desc: "Ambition, work style, and money moves." },
  { key: "health",  label: "Health & Wellness Guide",   desc: "Energy, stress, and the body's patterns." },
  { key: "love",    label: "Love & Relationships Guide", desc: "How you attach, clash, and repair." },
  { key: "money",   label: "Money Guide",               desc: "Earning, spending, and security." },
  { key: "purpose", label: "Purpose Guide",             desc: "Direction, meaning, and the bigger arc." },
];
