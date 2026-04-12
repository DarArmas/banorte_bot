const NOTION_TOKEN = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
const NOTION_DATABASE_FINANZAS_ID = PropertiesService.getScriptProperties().getProperty('NOTION_DATABASE_FINANZAS_ID');

function addExpense({ purchase, amount, date }) {
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