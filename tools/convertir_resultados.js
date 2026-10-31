/**
 * Convierte un Excel/CSV de resultados por área (puntajes promedio Saber 11) a data/resultados2026.js
 * Uso:  node tools/convertir_resultados.js "ruta/resultados.xlsx" [periodo] [fuente]
 * Columnas: DANE, EVALUADOS, GLOBAL, LECTURA, MATEMATICAS, SOCIALES, NATURALES, INGLES
 * (opcional: una fila con DANE = NACIONAL para el promedio nacional de referencia)
 */
const path = require('path');
const fs = require('fs');
const XLSX = require('../js/vendor/xlsx.full.min.js');
const { parseResultados } = require('../js/parser.js');

const input = process.argv[2];
if (!input) { console.error('Indique el archivo de resultados.'); process.exit(1); }
const wb = XLSX.read(fs.readFileSync(input), { type: 'buffer' });
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: true, defval: null });
const res = parseResultados(rows, process.argv[3] || '2026', process.argv[4]);
const out = 'window.RESULTADOS_2026 = ' + JSON.stringify(res) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'data', 'resultados2026.js'), out, 'utf8');
console.log(`Colegios con resultados: ${Object.keys(res.colegios).length} | Nacional: ${res.nacional ? 'sí' : 'no'}`);
