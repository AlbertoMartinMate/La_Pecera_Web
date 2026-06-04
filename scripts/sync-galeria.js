#!/usr/bin/env node
/**
 * sync-galeria.js
 * Sincroniza galeria.json con las carpetas de ganadores en Cloudinary.
 *
 * Uso:
 *   node scripts/sync-galeria.js
 *
 * Estructura esperada en Cloudinary:
 *   ganadores/
 *     Mayo-2026/
 *     Junio-2026/
 *     ...
 */

import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLOUD_NAME = 'deymoyy1z';
const API_KEY    = '293289644662512';
const API_SECRET = 'hY2sz7Tu3ks4RauvbDmuzSmWpQc';
const BASE_AUTH  = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
const GALERIA_PATH = join(__dirname, '../src/data/galeria.json');

// Mapeo de nombre de carpeta (en Cloudinary) → nombre legible en la web
// Formato carpeta: "Mayo-2026" → nombre: "Mayo 2026", slug: "mayo-2026"
function folderToMeta(folderName) {
  return {
    nombre: folderName.replace('-', ' '),
    slug: folderName.toLowerCase(),
  };
}

async function cloudinaryFetch(path, body = null) {
  const opts = {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Basic ${BASE_AUTH}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}${path}`, opts);
  return res.json();
}

async function getSubfolders(parentFolder) {
  const data = await cloudinaryFetch(`/folders/${parentFolder}`);
  return (data.folders || []).map(f => f.name);
}

async function getImagesInFolder(assetFolder) {
  let all = [];
  let nextCursor = null;

  do {
    const body = {
      expression: `asset_folder="${assetFolder}"`,
      max_results: 500,
      sort_by: [{ created_at: 'asc' }],
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    };
    const data = await cloudinaryFetch('/resources/search', body);
    all = all.concat(data.resources || []);
    nextCursor = data.next_cursor || null;
  } while (nextCursor);

  return all.map(r =>
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${r.public_id}`
  );
}

async function main() {
  console.log('Obteniendo subcarpetas de ganadores...');
  const subcarpetas = await getSubfolders('ganadores');

  if (!subcarpetas.length) {
    console.error('No se encontraron subcarpetas en ganadores/');
    process.exit(1);
  }

  console.log(`Subcarpetas encontradas: ${subcarpetas.join(', ')}`);

  const meses = [];

  for (const carpeta of subcarpetas) {
    const assetFolder = `ganadores/${carpeta}`;
    console.log(`Obteniendo fotos de ${assetFolder}...`);
    const fotos = await getImagesInFolder(assetFolder);
    const { nombre, slug } = folderToMeta(carpeta);
    console.log(`  → ${fotos.length} fotos`);
    meses.push({ nombre, slug, fotos });
  }

  // Ordenar meses cronológicamente por slug (ej: "enero-2026" < "mayo-2026")
  const MESES_ORDEN = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  meses.sort((a, b) => {
    const [mA, yA] = a.slug.split('-');
    const [mB, yB] = b.slug.split('-');
    if (yA !== yB) return parseInt(yA) - parseInt(yB);
    return MESES_ORDEN.indexOf(mA) - MESES_ORDEN.indexOf(mB);
  });

  const galeria = { meses };
  writeFileSync(GALERIA_PATH, JSON.stringify(galeria, null, 2) + '\n');
  console.log(`\ngaleria.json actualizado con ${meses.length} mes(es) y ${meses.reduce((t, m) => t + m.fotos.length, 0)} fotos en total.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
