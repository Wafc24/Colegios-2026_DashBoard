/**
 * Convierte el Excel de Clasificación de Planteles Saber 11 (ICFES) a data/datos.js
 * Uso:  node tools/convertir.js "ruta/al/archivo.xls"
 * Si no se indica ruta, usa data/Clasificacion_Planteles_Saber11_2026-1.xls
 */
const path = require('path');
const fs = require('fs');
const XLSX = require('../js/vendor/xlsx.full.min.js');
const { parseWorkbook } = require('../js/parser.js');

const root = path.join(__dirname, '..');
const input = process.argv[2] || path.join(root, 'data', 'Clasificacion_Planteles_Saber11_2026-1.xls');
const wb = XLSX.read(fs.readFileSync(input), { type: 'buffer' });
const result = parseWorkbook(XLSX, wb);

const out = 'window.DATOS_SABER = ' + JSON.stringify(result) + ';\n';
fs.writeFileSync(path.join(root, 'data', 'datos.js'), out, 'utf8');
console.log(`Periodo: ${result.periodo} | Colegios: ${result.colegios.length} | Tamaño: ${(out.length / 1024).toFixed(0)} KB`);
console.log('Ejemplo:', JSON.stringify(result.colegios[0]));
