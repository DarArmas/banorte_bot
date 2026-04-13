const MONTHS = {
  ene: '01', feb: '02', mar: '03', abr: '04',
  may: '05', jun: '06', jul: '07', ago: '08',
  sep: '09', oct: '10', nov: '11', dic: '12',
};

function parseDate(text) {
  const match = text.match(/(\d{1,2})\/([A-Za-z]{3})/);
  if (!match) throw new Error('Date not recognized: ' + text);

  const day = match[1].padStart(2, '0');
  const month = MONTHS[match[2].toLowerCase()];
  const year = new Date().getFullYear();

  return year + '-' + month + '-' + day;
}

function extractTdText(html) {
  const matches = [...html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
  return matches.map(m => m[1].replace(/<[^>]+>/g, '').trim());
}

function parsePurchaseEmail(bodyHtml) {
  const tds = extractTdText(bodyHtml);

  let purchase = null;
  let amount = null;
  let date = null;

  for (let i = 0; i < tds.length - 1; i++) {
    const label = tds[i].toLowerCase();
    const value = tds[i + 1];

    if (label === 'operacion:') {
      purchase = value.trim();
    }

    if (label.includes('importe')) {
      amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    }

    if (label.includes('fecha y hora de la operacion')) {
      date = parseDate(value);
    }
  }

  if (!purchase || !amount || !date) {
    throw new Error('Incomplete data: purchase=' + purchase + ', amount=' + amount + ', date=' + date);
  }

  return { purchase, amount, date };
}

function parseTransferEmail(bodyHtml) {
  const tds = extractTdText(bodyHtml);

  let purchase = null;
  let amount = null;
  let date = null;

  for (let i = 0; i < tds.length - 1; i++) {
    const label = tds[i].toLowerCase();
    const value = tds[i + 1];

    if (label === 'operacion:') {
      purchase = value.trim();
    }

    if (label.includes('importe')) {
      amount = parseFloat(value.replace(/[^0-9.]/g, ''));
    }

    if (label.includes('fecha de operacion')) {
      date = parseTransferDate(value);
    }
  }

  if (!purchase || !amount || !date) {
    throw new Error('Incomplete data: purchase=' + purchase + ', amount=' + amount + ', date=' + date);
  }

  return { purchase, amount, date };
}

function parseTransferDate(text) {
  // "12/Abr/2026" → "2026-04-12"
  const match = text.match(/(\d{1,2})\/([A-Za-z]{3})\/(\d{4})/);
  if (!match) throw new Error('Transfer date not recognized: ' + text);

  const day = match[1].padStart(2, '0');
  const month = MONTHS[match[2].toLowerCase()];
  const year = match[3];

  return year + '-' + month + '-' + day;
}