/**
 * THE COSMIC RESET · subscriber capture into Google Sheet
 * ---------------------------------------------------------------
 * SETUP (5 minutes):
 *   1. Open the Google Sheet you want emails to land in.
 *   2. Extensions → Apps Script.  Delete anything there.
 *   3. Paste this whole file. Click Save (disk icon).
 *   4. Click Deploy → New deployment.
 *        • Select type:  Web app
 *        • Execute as:   Me
 *        • Who has access: Anyone
 *      Click Deploy, authorise when asked.
 *   5. Copy the "Web app URL" it gives you.
 *   6. Paste that URL into  config.js  →  sheetsEndpoint: "PASTE_HERE"
 * Done. New subscribers append to a tab called "Subscribers".
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var p = (e && e.parameter) ? e.parameter : {};

    if (p.type === 'order') {
      // Personalized guide orders to fulfil within 24h
      var os = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
      if (os.getLastRow() === 0) os.appendRow(['Timestamp', 'Email', 'Sun', 'Moon', 'Rising', 'Focus', 'Price', 'Payment ID']);
      os.appendRow([p.ts || new Date().toISOString(), p.email || '', p.sun || '', p.moon || '', p.rising || '', p.focus || '', p.price || '', p.payment_id || '']);
    } else {
      // Newsletter subscribers and "notify me" pre-launch signups
      var sub = ss.getSheetByName('Subscribers') || ss.insertSheet('Subscribers');
      if (sub.getLastRow() === 0) sub.appendRow(['Timestamp', 'Email', 'Source']);
      sub.appendRow([p.ts || new Date().toISOString(), p.email || '', p.source || 'website']);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
