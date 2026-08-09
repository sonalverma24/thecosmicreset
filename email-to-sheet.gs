/**
 * THE COSMIC RESET · capture orders + subscribers into your Google Sheet
 * ---------------------------------------------------------------
 * Your sheet is already wired in below (SHEET_ID). Setup (about 3 minutes):
 *   1. Open your sheet:
 *      https://docs.google.com/spreadsheets/d/13IT4rehR_E7JIEu5C9cf8FZwfruLfwcHwvrt1ckS3P8/edit
 *   2. Extensions > Apps Script. Delete anything there.
 *   3. Paste this whole file. Click Save (disk icon).
 *   4. Deploy > New deployment.
 *        Select type:      Web app
 *        Execute as:       Me
 *        Who has access:   Anyone
 *      Click Deploy, and authorise when asked (choose your account, Allow).
 *   5. Copy the "Web app URL" (it ends in /exec).
 *   6. Paste that URL into config.js  ->  sheetsEndpoint: "PASTE_HERE"
 *      (or send it to me and I'll wire + test it).
 * Two tabs are created automatically: "Orders" and "Subscribers".
 */
var SHEET_ID = '13IT4rehR_E7JIEu5C9cf8FZwfruLfwcHwvrt1ckS3P8';

function getSS() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  try {
    var ss = getSS();
    var p = (e && e.parameter) ? e.parameter : {};

    if (p.type === 'order') {
      var os = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
      if (os.getLastRow() === 0) {
        os.appendRow(['Timestamp', 'Email', 'Product', 'Sun', 'Moon', 'Rising', 'Career', 'Focus', 'Price', 'Birth', 'Place', 'Payment ID']);
      }
      os.appendRow([
        p.ts || new Date().toISOString(), p.email || '', p.product || '',
        p.sun || '', p.moon || '', p.rising || '', p.career || '', p.focus || '',
        p.price || '', p.birth || '', p.place || '', p.payment_id || ''
      ]);
    } else {
      var sub = ss.getSheetByName('Subscribers') || ss.insertSheet('Subscribers');
      if (sub.getLastRow() === 0) sub.appendRow(['Timestamp', 'Email', 'Source']);
      sub.appendRow([p.ts || new Date().toISOString(), p.email || '', p.source || 'website']);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you confirm the deployment works by opening the /exec URL in a browser.
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, service: 'The Cosmic Reset capture' })).setMimeType(ContentService.MimeType.JSON);
}
