# The Cosmic Reset: going live

Everything you edit lives in **one file: `config.js`**. No other code changes needed.

---

## 1. Take live payments (Razorpay)

The store uses Razorpay's **in-page checkout**. The payment window opens over your site,
so the buyer never leaves.

1. Log in to your Razorpay Dashboard → **Settings → API Keys**.
2. Copy your **Key ID** (starts with `rzp_live_…` for real money, or `rzp_test_…` to test).
   *Only the Key ID goes in the site. Never paste the Key Secret anywhere public.*
3. Open `config.js` and set:
   ```js
   razorpayKeyId: "rzp_live_xxxxxxxxxxxxx",
   ```
4. Save, refresh the site. The **Buy** buttons now open real checkout.

**Currency note:** prices are set in **USD** (`$15`, `$5`). To charge in dollars your
Razorpay account needs **International Payments** enabled (Dashboard → Settings).
If your account is India-only, set `currency: "INR"` in `config.js` and change the
prices in the `TCR_PRODUCTS` list to rupees.

### Delivering the PDF after payment (automatic)
On a successful payment the buyer is emailed the matching PDF automatically. This runs
inside the same Apps Script that logs orders — no new service.

**How it works:** each order sends the product title (e.g. *The Aries Pocket Guide*).
The script looks in a Google Drive folder for a file named exactly `<product>.pdf`
(`The Aries Pocket Guide.pdf`) and emails it as an attachment. Made-to-order guides
(Full Chart Reading, Love & Relationships, …) have no matching PDF, so they are never
auto-sent — you still create and email those by hand within 24h.

**Set it up (one time):**
1. Put the Pocket Guide PDFs in a Drive folder. File names must match product titles
   exactly + `.pdf` (they already do).
2. Copy the folder ID from its URL (`…/folders/<ID>`) and paste it into
   `GUIDES_FOLDER_ID` at the top of `email-to-sheet.gs`.
3. **Recommended — verify payments before delivery:** in Apps Script →
   Project Settings → Script properties, add `RAZORPAY_KEY_ID` and
   `RAZORPAY_KEY_SECRET` (secret from Razorpay → Settings → API Keys). Then the file
   is released only when Razorpay confirms the payment is real and captured. Skip this
   and files still send, just without the fraud check.
4. Redeploy the script (Manage deployments → edit → New version → Deploy). The `/exec`
   URL stays the same, so `config.js` needs no change. Authorise the new Gmail + Drive
   permissions when prompted.

A **Delivered** column in the Orders tab shows `Sent` or the reason it wasn't
(e.g. *made-to-order*, *payment unverified*).

---

## 2. Collect emails into your Google Sheet

1. Open the Google Sheet you want to use.
2. **Extensions → Apps Script**, paste the contents of **`email-to-sheet.gs`**, Save.
3. **Deploy → New deployment → Web app**, *Execute as: Me*, *Who has access: Anyone*, Deploy.
4. Copy the **Web app URL** it gives you.
5. In `config.js` set:
   ```js
   sheetsEndpoint: "https://script.google.com/macros/s/……/exec",
   ```
Subscribers now append to a **Subscribers** tab (Timestamp · Email · Source).

---

## 3. The birth-chart calculator

Works out of the box, no setup. It computes Sun, Moon, Rising and your career-house
sign in the browser: city lookup via Open-Meteo (free, keyless) and astronomy computed
locally, with correct historical daylight-saving via the browser's timezone database.
Validated against known charts (e.g. Einstein: Sun Pisces, Moon Sagittarius, Rising Cancer).

Optional: for certified-exact charts you can plug an external astrology API. Set
`astroEndpoint` in `config.js` to a URL that accepts POST `{date, place}` and returns
`{ sun, moon, ascendant, mc }` as ecliptic longitudes in degrees. Leave blank to use the
built-in engine.

## 4. Personalized guide orders (24h delivery)

The builder logs each paid order to an **Orders** tab in your Sheet (Timestamp, Email,
Sun, Moon, Rising, Focus, Price, Payment ID) via the same Apps Script. You create the
guide and email it within 24 hours. Newsletter and "Notify me" signups go to the
**Subscribers** tab. Edit prices/focuses in `config.js` under `TCR_PERSONALIZED`.

## 5. Run it locally

```bash
cd "path/to/The Cosmic Reset/site" && python3 -m http.server 4321
```
Then open http://localhost:4321

## Files
- `index.html`: the page
- `styles.css`: all styling
- `app.js`: checkout + subscribe logic (no need to touch)
- `config.js`: **your keys, prices, products** (the only file you edit)
- `email-to-sheet.gs`: paste into Google Apps Script
