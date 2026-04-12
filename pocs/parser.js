// parser.js
import fs from 'fs';
import * as cheerio from 'cheerio';

export function parsearCorreoBanorte(contenido) {
  // Extraer el bloque HTML del .eml
  const htmlMatch = contenido.match(/<html[\s\S]*<\/html>/i);
  if (!htmlMatch) throw new Error('No se encontró HTML en el archivo');

  const $ = cheerio.load(htmlMatch[0]);

  // Extraer los datos de las filas de la tabla
  let compra = null;
  let precio = null;
  let fecha = null;

  $('tr').each((_, row) => {
    const celdas = $(row).find('td');
    const label = celdas.eq(0).text().trim().toLowerCase();
    const valor = celdas.eq(1).text().trim();

    if (label === 'operacion:') {
      compra = valor.trim();
    }

    if (label.includes('importe')) {
      // Limpiar "$ 984.50 MN" → 984.50
      precio = parseFloat(valor.replace(/[^0-9.]/g, ''));
    }

    if (label.includes('fecha y hora de la operacion')) {
      // Convertir "11/Abr 20:06:52 hrs." → "2026-04-11"
      fecha = parsearFecha(valor);
    }
  });

  if (!compra || !precio || !fecha) {
    throw new Error(`Datos incompletos: compra=${compra}, precio=${precio}, fecha=${fecha}`);
  }

  return { compra, precio, fecha };
}

const MESES = {
  ene: '01', feb: '02', mar: '03', abr: '04',
  may: '05', jun: '06', jul: '07', ago: '08',
  sep: '09', oct: '10', nov: '11', dic: '12',
};

function parsearFecha(texto) {
  // "11/Abr 20:06:52 hrs." → "2026-04-11"
  const match = texto.match(/(\d{1,2})\/([A-Za-z]{3})/);
  if (!match) throw new Error(`Fecha no reconocida: ${texto}`);

  const dia = match[1].padStart(2, '0');
  const mes = MESES[match[2].toLowerCase()];
  const anio = new Date().getFullYear(); // Asume año actual

  return `${anio}-${mes}-${dia}`;
}

// --- Prueba local ---
const contenido = fs.readFileSync('./ejemplo.eml', 'utf-8');
const resultado = parsearCorreoBanorte(contenido);
console.log('✅ Datos extraídos:', resultado);