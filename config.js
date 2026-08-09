/* ============================================================
   THE COSMIC RESET · STORE CONFIG
   This is the ONLY file you edit to go live. No other code changes.
   ============================================================ */

window.TCR_CONFIG = {
  /* 1) RAZORPAY: paste your PUBLIC key id (starts with rzp_live_ or rzp_test_).
        Dashboard > Settings > API Keys. The public Key ID is safe in the browser.
        Leave blank to keep the store in "preview" mode (buttons show a notice). */
  razorpayKeyId: "",

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
  paymentButtons: {
    1: "pl_TNjjy7SEWYvDWf",   // $1 quick reads
    12: "pl_TNjl6N1pTg37o1",  // $12 journals
    // 19 and 29 launch later
  },

  /* 3) OPTIONAL: external astrology API for certified-exact charts.
        Leave blank to use the accurate built-in engine (recommended, keyless).
        If set, it must be a URL that accepts POST {date, place} and returns
        JSON { sun, moon, ascendant, mc } as ecliptic longitudes in degrees. */
  astroEndpoint: "",

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
   SHOP CATALOG (the marketplace page).
   personalized:true  -> asks for birth details, delivered in 24h.
   personalized:false -> instant digital download.
   tag: optional badge. motif: which built-in graphic to show on the card.
   ============================================================ */
window.TCR_SHOP = [
  { id: "sh-full",    cat: "Personalized guides", title: "Full Chart Reading",        price: 29, personalized: true,  tag: "Bestseller", motif: "sun",   desc: "Your entire Sidereal chart, read end to end: Sun, Moon, Rising, all twelve houses." },
  { id: "sh-career",  cat: "Personalized guides", title: "Career & Money Guide",      price: 19, personalized: true,  tag: "",           motif: "saturn",desc: "Your 10th house, work style, and money patterns, decoded for the real you." },
  { id: "sh-love",    cat: "Personalized guides", title: "Love & Relationships Guide",price: 19, personalized: true,  tag: "",           motif: "venus", desc: "How you attach, clash and repair, read from your Venus, Moon and 7th house." },
  { id: "sh-health",  cat: "Personalized guides", title: "Health & Wellness Guide",   price: 19, personalized: true,  tag: "",           motif: "moon",  desc: "Energy, stress and the body's patterns, mapped to your chart." },
  { id: "sh-purpose", cat: "Personalized guides", title: "Purpose & Direction Guide", price: 19, personalized: true,  tag: "",           motif: "star",  desc: "Your nodes, 9th and 10th houses: where you're actually headed." },
  { id: "sh-year",    cat: "Personalized guides", title: "Year Ahead Guide",          price: 19, personalized: true,  tag: "New",        motif: "orbit", desc: "The transits shaping your next twelve months, personalised to your chart." },

  { id: "jr-reset",   cat: "Journals", title: "The Sun-Sign Reset Journal", price: 12, personalized: false, tag: "",     image: "assets/journals/reset.jpg",  desc: "Ninety days of prompts tuned to your patterns. Printable, reusable." },
  { id: "jr-moon",    cat: "Journals", title: "The Moon Cycle Journal",     price: 12, personalized: false, tag: "",     image: "assets/journals/moon.jpg",   desc: "Plan and reflect with the lunar month, new moon to full." },
  { id: "jr-shadow",  cat: "Journals", title: "The Shadow Work Journal",    price: 12, personalized: false, tag: "",     image: "assets/journals/shadow.jpg", desc: "Deep prompts for honest, quiet reflection." },

  { id: "qg-wdylyt",  cat: "Quick reads", title: "Why Do You Love Like That", price: 1, personalized: false, tag: "", motif: "venus", desc: "Your relationship pattern on one page. Instant read." },
  { id: "qg-decoder", cat: "Quick reads", title: "The Situationship Decoder", price: 1, personalized: false, tag: "", motif: "venus", desc: "His Venus sign vs. whether he'll ever commit." },
];

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
