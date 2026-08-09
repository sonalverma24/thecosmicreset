# The Cosmic Reset

Personalized sidereal astrology guides, journals and quick reads. Static site (HTML/CSS/JS), no build step.

## Pages
- `index.html`: home: hero, free sidereal chart calculator + guide waitlist, Instagram, reviews
- `shop.html`: the marketplace (guides, journals, quick reads)
- `past.html`: "past lives" coming-soon + waitlist

## Configure (the only file you edit)
`config.js`:
- `paymentButtons`: Razorpay Payment Button ids by amount ($1, $12 live)
- `paymentLinks`: optional hosted payment links by amount (fallback)
- `razorpayKeyId`: optional, for in-page checkout instead of buttons
- `sheetsEndpoint`: Google Apps Script web-app URL (orders + waitlist to your Sheet)
- prices/products in `TCR_SHOP`, `TCR_PRODUCTS`, `TCR_PERSONALIZED`

See `SETUP.md` for the Sheet + payment setup steps.

## Run locally
```bash
python3 -m http.server 4321
```
Then open http://localhost:4321

## Deploy (Vercel)
This folder is the site root (`index.html` at root). Import the repo in Vercel,
Framework Preset = Other, no build command. Then add the custom domain in
Project → Settings → Domains and point DNS at Vercel.
