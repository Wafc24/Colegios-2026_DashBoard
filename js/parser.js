/**
 * Parser compartido (navegador y Node) para el Excel de Clasificación de Planteles del ICFES.
 * Devuelve { periodo, generado, colegios: [ {d, n, t, m, dp, s, c, mt, ev, i:[mat,cn,soc,lc,ing,tot]} ] }
 */
(function (global) {
  function norm(s) {
    return String(s == null ? '' : s)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9 +]/g, '').replace(/\s+/g, ' ').trim();
  }

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'number') return v;
    const n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  function parseWorkbook(XLSX, wb) {
    const sheetName = wb.SheetNames.find(n => norm(n).includes('clasific')) || wb.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: true, defval: null });

    // Periodo desde el título
    let periodo = '';
    for (let r = 0; r < Math.min(rows.length, 15); r++) {
      const txt = (rows[r] || []).filter(Boolean).join(' ');
      const m = txt.match(/(20\d{2}\s*-\s*\d)/);
      if (m) { periodo = m[1].replace(/\s/g, ''); break; }
    }

    // Fila de encabezados
    let h = -1;
    for (let r = 0; r < Math.min(rows.length, 40); r++) {
      if ((rows[r] || []).some(c => norm(c).includes('codigo dane'))) { h = r; break; }
    }
    if (h < 0) throw new Error('No se encontró la fila de encabezados ("Código Dane").');

    const head = rows[h].map(norm);
    const col = (...keys) => head.findIndex(x => x && keys.every(k => x.includes(k)));
    const C = {
      dane: col('codigo dane'), nombre: col('nombre'), tipo: col('tipo'), mun: col('municipio'),
      sector: col('sector'), clas: head.findIndex(x => x === 'clasificacion'),
      mat: col('matriculados'), ev: col('evaluados'),
      im: col('indice', 'matem'), icn: col('indice', 'naturales'), isoc: col('indice', 'sociales'),
      ilc: col('indice', 'lectura'), iing: col('indice', 'ingl'), itot: col('indice', 'total')
    };
    if (C.clas < 0) C.clas = col('clasificacion');

    const colegios = [];
    for (let r = h + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row[C.dane] == null || row[C.dane] === '') continue;
      const dane = String(row[C.dane]).trim().replace(/\.0$/, '');
      if (!/^\d{6,}$/.test(dane)) continue;
      const munRaw = String(row[C.mun] || '').trim();
      const mm = munRaw.match(/^(.*)\((.*)\)\s*$/);
      const municipio = (mm ? mm[1] : munRaw).trim();
      const depto = (mm ? mm[2] : '').trim();
      let nombre = String(row[C.nombre] || '').replace(/\s{2,}/g, ' ').trim();
      let clas = String(row[C.clas] || '').trim().toUpperCase();
      const cut = nombre.search(/\s*-\s*No es posible presentar/i);
      if (cut >= 0) { nombre = nombre.slice(0, cut).trim(); }
      if (!clas) clas = 'NC'; // No clasificado según resolución ICFES
      colegios.push({
        d: dane,
        n: nombre,
        t: String(row[C.tipo] || '').trim(),
        m: municipio,
        dp: depto,
        s: String(row[C.sector] || '').trim().toUpperCase(),
        c: clas,
        mt: num(row[C.mat]),
        ev: num(row[C.ev]),
        i: [num(row[C.im]), num(row[C.icn]), num(row[C.isoc]), num(row[C.ilc]), num(row[C.iing]), num(row[C.itot])]
      });
    }

    // Completar municipio/departamento/sector de los no clasificados usando el código DANE
    // (dígitos 2-6 = departamento + municipio; el primer dígito indica zona/sector).
    const loc = {}, byDane = {};
    colegios.forEach(x => {
      if (x.m) loc[x.d.slice(1, 6)] = [x.m, x.dp];
      if (x.s) byDane[x.d] = x.s;
    });
    colegios.forEach(x => {
      if (!x.m && loc[x.d.slice(1, 6)]) { x.m = loc[x.d.slice(1, 6)][0]; x.dp = loc[x.d.slice(1, 6)][1]; }
      if (!x.s) x.s = byDane[x.d] || (x.d[0] === '3' || x.d[0] === '4' ? 'NO OFICIAL' : 'OFICIAL');
    });
    return { periodo, generado: new Date().toISOString().slice(0, 10), colegios };
  }

  /**
   * Resultados por área (puntajes promedio Saber 11 del año) desde una hoja con encabezados:
   * DANE, EVALUADOS, GLOBAL, LECTURA, MATEMATICAS, SOCIALES, NATURALES, INGLES (orden libre).
   * Una fila con DANE = "NACIONAL" se usa como promedio de referencia.
   */
  function parseResultados(rows, periodo, fuente) {
    let h = rows.findIndex(r => (r || []).some(c => norm(c).includes('dane')));
    if (h < 0) throw new Error('No se encontró la columna DANE.');
    const head = rows[h].map(norm);
    const find = (...ks) => head.findIndex(x => x && ks.some(k => x.includes(k)));
    const C = { d: find('dane'), ev: find('evaluad', 'estudiantes'), g: find('global'), lc: find('lectura'), m: find('matem'), sc: find('social'), cn: find('natural', 'ciencias'), in: find('ingl') };
    const out = { periodo: periodo || '2026', fuente: fuente || 'Reporte de resultados ICFES', generado: new Date().toISOString().slice(0, 10), nacional: null, colegios: {} };
    for (let r = h + 1; r < rows.length; r++) {
      const row = rows[r]; if (!row) continue;
      const key = String(row[C.d] ?? '').trim().replace(/\.0$/, '');
      if (!key) continue;
      const rec = {};
      ['ev', 'g', 'lc', 'm', 'sc', 'cn', 'in'].forEach(k => { if (C[k] >= 0) rec[k] = num(row[C[k]]); });
      if (/^nacional$/i.test(key)) out.nacional = rec;
      else if (/^\d{6,}$/.test(key)) out.colegios[key] = rec;
    }
    return out;
  }

  const api = { parseWorkbook, parseResultados };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.SaberParser = api;
})(typeof window !== 'undefined' ? window : globalThis);
