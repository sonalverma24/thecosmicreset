/**
 * THE COSMIC RESET · capture orders + subscribers, and AUTO-DELIVER the PDF
 * -----------------------------------------------------------------------
 * What this does:
 *   • Logs every order / subscriber / chart to your Google Sheet (as before).
 *   • On a paid order, finds the PDF whose file name matches the product
 *     (e.g. product "The Aries Pocket Guide" -> file "The Aries Pocket Guide.pdf")
 *     in your Drive folder and emails it to the buyer as an attachment.
 *   • Made-to-order guides (Full Chart Reading, Love & Relationships Guide, …)
 *     have no matching PDF, so they are never auto-sent — you still make + send
 *     those by hand within 24h, exactly as today.
 *
 * ONE-TIME SETUP (about 5 minutes):
 *   1. Put the 12 Pocket Guide PDFs in a Google Drive folder. The file names
 *      MUST match the product titles exactly, plus ".pdf". They already do:
 *        "The Aries Pocket Guide.pdf", "The Taurus Pocket Guide.pdf", …
 *   2. Open that folder in Drive and copy its ID from the URL:
 *        https://drive.google.com/drive/folders/<THIS_IS_THE_ID>
 *      Paste it into GUIDES_FOLDER_ID below.
 *   3. Open your sheet → Extensions → Apps Script. Replace everything with this
 *      whole file. Save.
 *   4. (Recommended) Turn on payment verification so only real, paid orders get
 *      the file. In Apps Script: Project Settings (gear) → Script properties →
 *      Add:  RAZORPAY_KEY_ID = rzp_live_…   and   RAZORPAY_KEY_SECRET = <secret>
 *      Get the secret from Razorpay Dashboard → Settings → API Keys. If you skip
 *      this, the file is still delivered, just without the extra fraud check.
 *   5. Deploy → Manage deployments → edit → New version → Deploy (this reuses
 *      your existing /exec URL, so config.js needs no change). Authorise when
 *      asked — it will now request Gmail + Drive access to send the file.
 */

var SHEET_ID = '13IT4rehR_E7JIEu5C9cf8FZwfruLfwcHwvrt1ckS3P8';

/* Google Drive folder that holds the deliverable PDFs. Paste the folder ID. */
var GUIDES_FOLDER_ID = '';

/* Shown as the sender name on the delivery email. */
var FROM_NAME = 'The Cosmic Reset';

function getSS() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  try {
    var ss = getSS();
    var p = (e && e.parameter) ? e.parameter : {};

    if (p.type === 'chart') {
      var cs = ss.getSheetByName('Charts') || ss.insertSheet('Charts');
      if (cs.getLastRow() === 0) cs.appendRow(['Timestamp', 'Email', 'Name', 'Birth', 'Place', 'Chart']);
      cs.appendRow([p.ts || new Date().toISOString(), p.email || '', p.name || '', p.birth || '', p.place || '', p.chart || '']);
    } else if (p.type === 'order') {
      var delivery = deliverGuide(p);                 // <- auto-deliver the PDF
      var os = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
      if (os.getLastRow() === 0) {
        os.appendRow(['Timestamp', 'Email', 'Product', 'Sun', 'Moon', 'Rising', 'Career', 'Focus', 'Price', 'Birth', 'Place', 'Payment ID', 'Delivered', 'Name']);
      }
      os.appendRow([
        p.ts || new Date().toISOString(), p.email || '', p.product || '',
        p.sun || '', p.moon || '', p.rising || '', p.career || '', p.focus || '',
        p.price || '', p.birth || '', p.place || '', p.payment_id || '',
        delivery.sent ? 'Sent' : ('No — ' + delivery.reason), p.name || ''
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

/**
 * Emails the matching PDF to the buyer. Returns { sent, reason }.
 * Delivers only when a PDF named exactly "<product>.pdf" exists in the folder,
 * so made-to-order guides (no such file) are safely skipped.
 */
function deliverGuide(p) {
  var product = (p.product || '').trim();
  var email = (p.email || '').trim();
  if (!product) return { sent: false, reason: 'no product' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { sent: false, reason: 'bad email' };
  if (!GUIDES_FOLDER_ID) return { sent: false, reason: 'folder not configured' };

  // Only real, paid orders get the file (when verification is configured).
  var check = verifyPayment(p);
  if (check.checked && !check.ok) return { sent: false, reason: 'payment unverified (' + check.reason + ')' };

  var folder, files;
  try { folder = DriveApp.getFolderById(GUIDES_FOLDER_ID); }
  catch (err) { return { sent: false, reason: 'folder not found' }; }
  files = folder.getFilesByName(product + '.pdf');
  if (!files.hasNext()) return { sent: false, reason: 'no matching PDF (made-to-order?)' };

  var file = files.next();
  var name = (p.name || '').trim();
  var hello = name ? 'Hi ' + name + ',' : 'Hi there,';
  var subject = 'Your ' + product + ' ✦ The Cosmic Reset';
  var htmlBody =
    '<div style="font-family:Georgia,serif;max-width:520px;margin:auto;color:#2C0A71">' +
      '<p style="font-size:18px">Your guide has arrived ✦</p>' +
      '<p>' + esc(hello) + '</p>' +
      '<p>Thank you for your order. <strong>' + esc(product) + '</strong> is attached to this email as a PDF — ' +
      'save it anywhere and read it whenever you need a reset.</p>' +
      '<p>With warmth,<br>The Cosmic Reset</p>' +
    '</div>';
  var plainBody = hello + '\n\nYour guide has arrived. Thank you for your order. ' + product +
    ' is attached to this email as a PDF.\n\nWith warmth,\nThe Cosmic Reset';

  GmailApp.sendEmail(email, subject, plainBody, {
    name: FROM_NAME,
    htmlBody: htmlBody,
    attachments: [file.getAs('application/pdf')]
  });
  return { sent: true, reason: 'ok' };
}

/**
 * Confirms a payment is genuine with Razorpay before we release the file.
 * Returns { checked:false } when not configured (delivery proceeds without the
 * check), or { checked:true, ok:boolean, reason } when it ran.
 */
function verifyPayment(p) {
  var props = PropertiesService.getScriptProperties();
  var keyId = props.getProperty('RAZORPAY_KEY_ID');
  var secret = props.getProperty('RAZORPAY_KEY_SECRET');
  if (!keyId || !secret) return { checked: false, reason: 'not configured' };

  var pid = (p.payment_id || '').trim();
  if (!pid) return { checked: true, ok: false, reason: 'no payment id' };

  try {
    var resp = UrlFetchApp.fetch('https://api.razorpay.com/v1/payments/' + encodeURIComponent(pid), {
      method: 'get',
      headers: { Authorization: 'Basic ' + Utilities.base64Encode(keyId + ':' + secret) },
      muteHttpExceptions: true
    });
    var data = JSON.parse(resp.getContentText() || '{}');
    if (data.status === 'captured' || data.status === 'authorized') return { checked: true, ok: true, reason: data.status };
    return { checked: true, ok: false, reason: 'status ' + (data.status || 'unknown') };
  } catch (err) {
    return { checked: true, ok: false, reason: String(err) };
  }
}

// Escapes user-supplied text before it goes into the HTML email body.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Lets you confirm the deployment works by opening the /exec URL in a browser.
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, service: 'The Cosmic Reset capture' })).setMimeType(ContentService.MimeType.JSON);
}
