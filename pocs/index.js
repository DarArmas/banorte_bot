import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_FINANZAS_ID;

async function agregarGasto({ compra, categoria, precio, fecha }) {
  await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      Compra: {
        title: [
          {
            text: {
              content: compra,
            },
          },
        ],
      },
      Categoria: {
        multi_select: [
          { name: categoria },
        { name: 'Banorte Bot - Pendiente' },
        ],
      },
      Precio: {
        number: precio,
      },
      Date: {
        date: {
          start: fecha,
        },
      },
    },
  });

  console.log(`✅ Registro agregado: ${compra} | ${categoria} - $${precio} MXN`);
}

// Ejemplo de uso
agregarGasto({
  compra: 'Tacos de canasta',
  categoria: 'No existo?',
  precio: 250,
  fecha: '2026-04-12',
});