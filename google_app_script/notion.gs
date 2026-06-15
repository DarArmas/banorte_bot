const NOTION_TOKEN = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
const NOTION_DATABASE_FINANZAS_ID = PropertiesService.getScriptProperties().getProperty('NOTION_DATABASE_FINANZAS_ID');

function expenseExists(purchase, amount) {
  const payload = {
    filter: {
      and: [
        {
          property: 'Compra',
          title: { equals: purchase },
        },
        {
          property: 'Precio',
          number: { equals: amount },
        },
        {
          property: 'Categoria',
          multi_select: { contains: 'Banorte Bot - Pendiente' },
        },
      ],
    },
  };

  const response = UrlFetchApp.fetch(
    'https://api.notion.com/v1/databases/' + NOTION_DATABASE_FINANZAS_ID + '/query',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + NOTION_TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      payload: JSON.stringify(payload),
    }
  );

  const data = JSON.parse(response.getContentText());
  return data.results.length > 0;
}

function addExpense({ purchase, amount, date }) {
    if (expenseExists(purchase, amount)) {
    Logger.log('⏭️ Skipped duplicate: ' + purchase + ' - $' + amount + ' MXN');
    return;
  }

  const payload = {
    parent: { database_id: NOTION_DATABASE_FINANZAS_ID },
    properties: {
      Compra: {
        title: [{ text: { content: purchase } }],
      },
      Categoria: {
        multi_select: [
          { name: 'Banorte Bot - Pendiente' },
        ],
      },
      Precio: { number: amount },
      Date: { date: { start: date } },
    },
  };

  UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + NOTION_TOKEN,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    payload: JSON.stringify(payload),
  });

  Logger.log('✅ Record added: ' + purchase + ' - $' + amount + ' MXN');
}

