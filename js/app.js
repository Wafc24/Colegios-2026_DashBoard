/* =========================================================
   Dashboard Saber 11° — Grupo Edúcate Colombia
   Lógica principal
   ========================================================= */
(function () {
  'use strict';

  // ---------- Utilidades ----------
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const nf = n => (n == null ? '—' : Number(n).toLocaleString('es-CO'));
  const f3 = v => (v == null ? '—' : v.toFixed(3));
  const mean = arr => { const v = arr.filter(x => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const title = s => String(s || '').toLowerCase().replace(/(^|[\s(.-])([a-záéíóúñü])/g, (m, a, b) => a + b.toUpperCase());
  const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const AREA_FULL = ['Matemática', 'Ciencias Naturales', 'Sociales y Ciudadanas', 'Lectura Crítica', 'Inglés'];
  const { CLAS, CLAS_COLOR, CLAS_ON, AREAS, AREA_COLOR, SERIES, C } = G;
  const clasLabel = c => (c === 'NC' ? 'Sin clasificar' : c);
  const CLAS_DESC = { 'A+': 'Muy superior', A: 'Superior', B: 'Alto', C: 'Medio', D: 'Bajo', NC: 'Sin clasif.' };

  // ---------- Estado ----------
  let DATA = [];          // registros enriquecidos
  let PERIODO = '';
  let EDU = new Set();    // DANE de colegios Edúcate
  const STATS = {};       // promedios y conteos por tipo
  const state = {
    tab: 'panorama',
    activeYear: '2026',
    locked: null,         // DANE en modo "Mi colegio"
    f: { depto: '', mun: '', sector: '', tipo: 'Establecimiento', clas: new Set(CLAS), edu: false },
    q: { text: '', area: 5, min: null, max: null, fuerte: '', debil: '' },
    sort: { key: 'rn', dir: 1 },
    page: 1, pageSize: 25,
    fichaId: null,
    cmp: []
  };

  // ---------- Multi-periodo Oficial (2024, 2025, 2026) ----------
  const DATA_BY_YEAR = {
    '2024': window.DATOS_2024,
    '2025': window.DATOS_2025,
    '2026': window.DATOS_SABER
  };

  function getHistorico(dane, tipo = 'Establecimiento') {
    const hist = {};
    ['2024', '2025', '2026'].forEach(yr => {
      const ds = DATA_BY_YEAR[yr];
      if (ds && ds.colegios) {
        const found = ds.colegios.find(c => c.d === dane && (tipo ? c.t === tipo : true)) ||
                      ds.colegios.find(c => c.d === dane);
        hist[yr] = found || null;
      } else {
        hist[yr] = null;
      }
    });
    return hist;
  }

  function getActiveTrayYears() {
    const cur = parseInt(state.activeYear || '2026', 10);
    return [2024, 2025, 2026].filter(y => y <= cur);
  }

  function switchYear(yr) {
    yr = String(yr);
    if (!DATA_BY_YEAR[yr]) {
      toast('No hay datos disponibles para el periodo ' + yr);
      return;
    }
    state.activeYear = yr;
    $$('#periodoPills .pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.periodo === yr);
    });

    const trayTabBtn = document.querySelector('[data-tab="trayectoria"]');
    if (trayTabBtn) {
      if (yr === '2024') trayTabBtn.innerHTML = `📈 Trayectoria 2024`;
      else if (yr === '2025') trayTabBtn.innerHTML = `📈 Trayectoria 2024 – 2025`;
      else trayTabBtn.innerHTML = `📈 Trayectoria 2024 – 2026 & Mejora`;
    }

    const curSchool = DATA[state.fichaId];
    const curDane = state.locked || (curSchool ? curSchool.d : null);
    const curTipo = curSchool ? curSchool.t : null;

    load(DATA_BY_YEAR[yr]);

    if (curDane) {
      const newIdx = DATA.findIndex(x => x.d === curDane && (!curTipo || x.t === curTipo));
      const fallbackIdx = DATA.findIndex(x => x.d === curDane);
      state.fichaId = newIdx !== -1 ? newIdx : (fallbackIdx !== -1 ? fallbackIdx : null);
      if (state.locked) {
        const sch = DATA[state.fichaId];
        if (sch) updateBanner(sch);
      }
      if (state.tab === 'ficha' && state.fichaId != null) renderFicha();
      if (state.tab === 'trayectoria' && state.fichaId != null) {
        state.trayectoriaSchoolId = state.fichaId;
        renderTrayectoria();
      }
    } else if (state.tab === 'trayectoria') {
      renderTrayectoria();
    }
    toast(`✔ Periodo ${yr} activado en todo el Dashboard.`);
  }

  // ---------- Preparación de datos ----------
  function prepare(raw) {
    PERIODO = raw.periodo || '';
    DATA = raw.colegios.map((r, id) => {
      const areas = r.i.slice(0, 5);
      const valid = areas.every(v => v != null);
      let fuerte = -1, debil = -1;
      if (valid) {
        fuerte = areas.indexOf(Math.max(...areas));
        debil = areas.indexOf(Math.min(...areas));
      }
      return Object.assign({}, r, {
        id, fuerte, debil,
        key: norm(`${r.n} ${r.m} ${r.dp} ${r.d}`)
      });
    });
    computeRanks();
    applyEducate();
  }

  function rankBy(list, field) {
    const sorted = list.filter(x => x.i[5] != null).sort((a, b) => b.i[5] - a.i[5]);
    let prev = null, rank = 0;
    sorted.forEach((x, i) => { if (x.i[5] !== prev) { rank = i + 1; prev = x.i[5]; } x[field] = rank; });
    return sorted.length;
  }

  function groupBy(list, fn) {
    const m = new Map();
    list.forEach(x => { const k = fn(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); });
    return m;
  }

  function avgAreas(list) {
    return [0, 1, 2, 3, 4, 5].map(k => mean(list.map(x => x.i[k])));
  }

  function computeRanks() {
    ['Establecimiento', 'Sede'].forEach(tipo => {
      const L = DATA.filter(x => x.t === tipo);
      const S = STATS[tipo] = { n: rankBy(L, 'rn'), dept: {}, mun: {}, sector: {}, clasMin: {} };
      S.avg = avgAreas(L);
      groupBy(L, x => x.dp).forEach((g, k) => { S.dept[k] = { n: rankBy(g, 'rd'), avg: avgAreas(g) }; });
      groupBy(L, x => x.m + '|' + x.dp).forEach((g, k) => { S.mun[k] = { n: rankBy(g, 'rm'), avg: avgAreas(g) }; });
      groupBy(L, x => x.s).forEach((g, k) => { S.sector[k] = { n: rankBy(g, 'rs'), avg: avgAreas(g) }; });
      groupBy(L, x => x.c).forEach((g, k) => {
        const tots = g.map(x => x.i[5]).filter(v => v != null);
        S.clasMin[k] = tots.length ? Math.min(...tots) : null;
        if (k === 'A+') S.avgAplus = avgAreas(g);
      });
    });
  }

  function applyEducate() {
    let extra = [];
    try { extra = JSON.parse(localStorage.getItem('educate_dane') || '[]'); } catch (e) { /* sin datos */ }
    EDU = new Set([...(window.COLEGIOS_EDUCATE || []), ...extra].map(String));
    DATA.forEach(x => { x.edu = EDU.has(x.d); });
    const n = new Set(DATA.filter(x => x.edu).map(x => x.d)).size;
    $('#educateCount').textContent = EDU.size ? `(${n})` : '(sin lista)';
  }

  // ---------- Filtros ----------
  function baseFiltered() {
    const f = state.f;
    return DATA.filter(x =>
      (!f.tipo || x.t === f.tipo) &&
      (!f.depto || x.dp === f.depto) &&
      (!f.mun || x.m === f.mun) &&
      (!f.sector || x.s === f.sector) &&
      f.clas.has(x.c) &&
      (!f.edu || x.edu)
    );
  }

  function explorerFiltered() {
    const q = state.q;
    const tokens = norm(q.text).split(/\s+/).filter(Boolean);
    return baseFiltered().filter(x => {
      if (tokens.length && !tokens.every(t => x.key.includes(t))) return false;
      const v = x.i[q.area];
      if (q.min != null && (v == null || v < q.min)) return false;
      if (q.max != null && (v == null || v > q.max)) return false;
      if (q.fuerte !== '' && x.fuerte !== +q.fuerte) return false;
      if (q.debil !== '' && x.debil !== +q.debil) return false;
      return true;
    });
  }

  function fillSelect(sel, values, keep) {
    const cur = keep ?? sel.value;
    sel.innerHTML = '<option value="">Todos</option>' + values.map(v => `<option value="${esc(v)}">${esc(title(v))}</option>`).join('');
    sel.value = values.includes(cur) ? cur : '';
  }

  function syncClasTiles() {
    $$('#fClas .clas-tile').forEach(t => {
      t.classList.toggle('on', state.f.clas.has(t.dataset.c));
    });
  }

  function initFilters() {
    const deptos = [...new Set(DATA.map(x => x.dp).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    fillSelect($('#fDepto'), deptos, state.f.depto);
    updateMunicipios();

    $('#fClas').innerHTML = CLAS.map(c => {
      const isOn = state.f.clas.has(c);
      return `<div class="clas-tile ${isOn ? 'on' : ''}" data-c="${c}" style="--c:${CLAS_COLOR[c]};--on:${CLAS_ON[c]};--c-dark:${c === 'A+' ? '#B89F00' : c === 'A' ? '#7A8F17' : CLAS_COLOR[c]}" title="Clic para filtrar individualmente o alternar">
        <span class="L">${c === 'NC' ? 'S/C' : c}</span><small>${CLAS_DESC[c]}</small></div>`;
    }).join('');

    // Botones segmentados (sector / tipo) sincronizados con su <select>
    $$('.seg').forEach(seg => {
      const sel = document.getElementById(seg.dataset.for);
      const sync = () => seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === sel.value));
      seg.onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        sel.value = b.dataset.v; sel.dispatchEvent(new Event('change')); sync();
      };
      sel.syncSeg = sync; sync();
    });

    $('#fDepto').onchange = e => { state.f.depto = e.target.value; state.f.mun = ''; updateMunicipios(); onFilter(); };
    $('#fMun').onchange = e => { state.f.mun = e.target.value; onFilter(); };
    $('#fSector').onchange = e => { state.f.sector = e.target.value; onFilter(); };
    $('#fTipo').onchange = e => { state.f.tipo = e.target.value; onFilter(); };
    $('#fEducate').onchange = e => {
      if (e.target.checked && !EDU.size) {
        e.target.checked = false;
        alert('Aún no se ha cargado la lista de colegios Edúcate. Cárgala desde el botón "⚙ Datos".');
        return;
      }
      state.f.edu = e.target.checked; onFilter();
    };

    const btnAll = $('#btnClasAll');
    if (btnAll) {
      btnAll.onclick = () => {
        CLAS.forEach(c => state.f.clas.add(c));
        syncClasTiles();
        onFilter();
      };
    }

    // Filtrar de manera individual o alternar
    $('#fClas').onclick = e => {
      const chip = e.target.closest('.clas-tile'); if (!chip) return;
      const c = chip.dataset.c;
      if (state.f.clas.size === CLAS.length) {
        // Al estar todas activas, un clic aísla esa categoría individual
        state.f.clas.clear();
        state.f.clas.add(c);
      } else if (state.f.clas.size === 1 && state.f.clas.has(c)) {
        // Al dar clic de nuevo a la única activa, se reestablecen todas
        CLAS.forEach(x => state.f.clas.add(x));
      } else {
        // Alternar
        if (state.f.clas.has(c)) state.f.clas.delete(c);
        else state.f.clas.add(c);
        if (state.f.clas.size === 0) CLAS.forEach(x => state.f.clas.add(x));
      }
      syncClasTiles();
      onFilter();
    };
    $('#btnReset').onclick = resetFilters;
  }

  function updateMunicipios() {
    const src = state.f.depto ? DATA.filter(x => x.dp === state.f.depto) : DATA;
    const muns = [...new Set(src.map(x => x.m).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    fillSelect($('#fMun'), muns, state.f.mun);
  }

  function resetFilters() {
    Object.assign(state.f, { depto: '', mun: '', sector: '', tipo: 'Establecimiento', clas: new Set(CLAS), edu: false });
    $('#fDepto').value = ''; $('#fSector').value = ''; $('#fTipo').value = 'Establecimiento'; $('#fEducate').checked = false;
    updateMunicipios();
    $$('#fClas .clas-tile').forEach(c => c.classList.add('on'));
    $('#fSector').syncSeg && $('#fSector').syncSeg();
    $('#fTipo').syncSeg && $('#fTipo').syncSeg();
    Object.assign(state.q, { text: '', area: 5, min: null, max: null, fuerte: '', debil: '' });
    $('#qSearch').value = ''; $('#qArea').value = '5'; $('#qMin').value = ''; $('#qMax').value = ''; $('#qFuerte').value = ''; $('#qDebil').value = '';
    onFilter();
  }

  function onFilter() { state.page = 1; render(); }

  // ---------- Navegación ----------
  function setTab(tab) {
    state.tab = tab;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + tab));
    $('#filtros').classList.toggle('hidden', !(tab === 'panorama' || tab === 'explorador'));
    $('#btnOpenFilters').classList.toggle('hidden', !(tab === 'panorama' || tab === 'explorador'));
    document.body.classList.remove('filters-open');
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    if (state.tab === 'panorama') renderPanorama();
    else if (state.tab === 'explorador') renderExplorer();
    else if (state.tab === 'ficha') renderFicha();
    else if (state.tab === 'comparador') renderComparador();
    else if (state.tab === 'trayectoria') renderTrayectoria();
  }

  // ---------- PANORAMA ----------
  function renderPanorama() {
    const L = baseFiltered();
    const withTot = L.filter(x => x.i[5] != null);
    const avg = avgAreas(L);
    const clasif = L.filter(x => x.c !== 'NC');
    const top = clasif.filter(x => x.c === 'A+' || x.c === 'A').length;
    const evals = L.reduce((a, x) => a + (x.ev || 0), 0);
    const best = avg.slice(0, 5).reduce((b, v, i) => (v != null && (b < 0 || v > avg[b]) ? i : b), -1);
    const nat = STATS[state.f.tipo || 'Establecimiento'].avg[5];
    const diffNat = avg[5] != null && nat != null ? avg[5] - nat : null;

    const pctTop = clasif.length ? top * 100 / clasif.length : 0;
    const ofi = L.filter(x => x.s === 'OFICIAL').length;
    const pctOfi = L.length ? ofi * 100 / L.length : 0;
    $('#kpis').innerHTML = [
      `<div class="kpi" style="--accent:${C.primary}"><div class="kpi-icon">🏫</div><div><div class="value">${nf(L.length)}</div><div class="label">Colegios <em>totales</em></div><div class="sub">${nf(clasif.length)} clasificados · ${nf(evals)} evaluados</div></div></div>`,
      `<div class="kpi" style="--accent:${C.yellow}"><div class="gauge" style="--p:${pctTop}"><span>${pctTop.toFixed(0)}%</span></div><div><div class="label">Categoría <em style="color:#B89F00">A+ y A</em></div><div class="value">${nf(top)}</div><div class="sub">colegios</div></div></div>`,
      `<div class="kpi" style="--accent:${C.sky}"><div class="gauge" style="--p:${pctOfi}"><span>${pctOfi.toFixed(0)}%</span></div><div><div class="label">Sector <em>oficial</em></div><div class="value">${nf(ofi)}</div><div class="sub">${nf(L.length - ofi)} no oficiales</div></div></div>`,
      `<div class="kpi solid" style="--accent:${C.primary}"><div class="kpi-icon">📈</div><div><div class="label">Índice total promedio</div><div class="value">${f3(avg[5])}</div><div class="sub">${diffNat == null ? '' : Math.abs(diffNat) < 0.0005 ? 'igual al promedio nacional' : `${diffNat >= 0 ? '▲' : '▼'} ${Math.abs(diffNat).toFixed(3)} vs nacional`}</div></div></div>`,
      `<div class="kpi solid" style="--accent:${C.navy}"><div class="kpi-icon">⭐</div><div><div class="label">Área más fuerte</div><div class="value" style="font-size:1.35rem">${best >= 0 ? AREA_FULL[best] : '—'}</div><div class="sub">${best >= 0 ? `promedio ${f3(avg[best])}` : ''}</div></div></div>`
    ].join('');

    // Donut clasificación
    const counts = CLAS.map(c => L.filter(x => x.c === c).length);
    G.donut('chClas', CLAS.map(clasLabel), counts, CLAS.map(c => CLAS_COLOR[c]));

    // Sector x clasificación (porcentaje)
    const sectors = ['OFICIAL', 'NO OFICIAL'];
    const totS = sectors.map(s => L.filter(x => x.s === s).length || 1);
    G.draw('chSector', {
      type: 'bar',
      data: {
        labels: ['Oficial', 'No oficial'],
        datasets: CLAS.map(c => ({
          label: clasLabel(c), backgroundColor: CLAS_COLOR[c], borderRadius: 4,
          data: sectors.map((s, i) => +(L.filter(x => x.s === s && x.c === c).length * 100 / totS[i]).toFixed(1)),
          counts: sectors.map(s => L.filter(x => x.s === s && x.c === c).length)
        }))
      },
      options: {
        indexAxis: 'y',
        scales: { x: { stacked: true, max: 100, ticks: { callback: v => v + '%' } }, y: { stacked: true, grid: { display: false } } },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}% (${nf(ctx.dataset.counts[ctx.dataIndex])})` } }
        }
      }
    });

    // Áreas
    const natAvg = STATS[state.f.tipo || 'Establecimiento'].avg;
    G.bars('chAreas', AREAS, [
      { label: 'Selección actual', data: avg.slice(0, 5).map(v => v && +v.toFixed(4)), backgroundColor: AREA_COLOR, borderRadius: 8 },
      { label: 'Promedio nacional', data: natAvg.slice(0, 5).map(v => v && +v.toFixed(4)), backgroundColor: '#D5DAE5', borderRadius: 8 }
    ], { min: 0.4 });

    // Histograma
    const bins = [], labels = [];
    for (let b = 0.30; b < 1.0; b += 0.025) { labels.push(b.toFixed(3)); bins.push(0); }
    withTot.forEach(x => { const k = Math.min(bins.length - 1, Math.max(0, Math.floor((x.i[5] - 0.30) / 0.025))); bins[k]++; });
    const thr = STATS[state.f.tipo || 'Establecimiento'].clasMin;
    const binColor = labels.map(l => {
      const v = +l + 0.0125;
      return v >= (thr['A+'] ?? 1) ? C.yellow : v >= (thr['A'] ?? 1) ? C.lime : v >= (thr['B'] ?? 1) ? C.sky : v >= (thr['C'] ?? 1) ? C.orange : C.red;
    });
    G.bars('chHist', labels, [{ label: 'Colegios', data: bins, backgroundColor: binColor, borderRadius: 3, barPercentage: 1, categoryPercentage: 0.95 }], {
      extra: { scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }, y: { grid: { display: true } } } }
    });

    // Geográfico
    const byMun = !!state.f.depto;
    $('#rankGeoTitle').textContent = byMun ? `Índice total promedio por municipio · ${title(state.f.depto)}` : 'Índice total promedio por departamento';
    const groups = [...groupBy(withTot, x => (byMun ? x.m : x.dp) || 'Sin dato')]
      .map(([k, g]) => ({ k, v: mean(g.map(x => x.i[5])), n: g.length }))
      .sort((a, b) => b.v - a.v).slice(0, 35);
    G.bars('chGeo', groups.map(g => title(g.k)), [{
      label: 'Índice total', data: groups.map(g => +g.v.toFixed(4)),
      backgroundColor: groups.map((g, i) => (i < 3 ? C.primary : G.alpha(C.sky, 0.75))), borderRadius: 6, n: groups.map(g => g.n)
    }], {
      horizontal: true, min: Math.max(0, Math.floor((Math.min(...groups.map(g => g.v), 1) - 0.03) * 20) / 20),
      onClick: (e, els) => {
        if (!els.length) return;
        const k = groups[els[0].index].k;
        if (!byMun) { state.f.depto = k; $('#fDepto').value = k; updateMunicipios(); }
        else { state.f.mun = k; $('#fMun').value = k; }
        onFilter();
      },
      extra: { plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: ctx => `${ctx.dataset.n[ctx.dataIndex]} colegios · clic para filtrar` } } } }
    });

    // Top 10
    const top10 = withTot.slice().sort((a, b) => b.i[5] - a.i[5]).slice(0, 10);
    $('#top10').innerHTML = top10.length ? top10.map((x, i) => `
      <div class="top-item" data-id="${x.id}">
        <div class="top-pos">${i + 1}</div>
        <div class="top-name">${esc(x.n)}${x.edu ? '<span class="edu-tag">EDÚCATE</span>' : ''}<small>${esc(title(x.m))} · ${esc(title(x.dp))}</small></div>
        ${badge(x.c)}
        <div class="top-val">${f3(x.i[5])}</div>
      </div>`).join('') : '<p class="empty">Sin resultados para los filtros.</p>';
  }

  function badge(c, sm) { return `<span class="badge ${sm ? 'sm' : ''}" style="--c:${CLAS_COLOR[c] || C.gray};--on:${CLAS_ON[c] || '#fff'}" title="Categoría ${clasLabel(c)}">${c === 'NC' ? 'S/C' : c}</span>`; }

  // ---------- EXPLORADOR ----------
  const COLS = [
    { key: 'rn', label: 'Puesto', num: true },
    { key: 'n', label: 'Colegio' },
    { key: 's', label: 'Sector' },
    { key: 'c', label: 'Clasif.' },
    { key: 'ev', label: 'Evaluados', num: true },
    { key: 'i0', label: 'Mat.', num: true },
    { key: 'i1', label: 'C. Nat.', num: true },
    { key: 'i2', label: 'Sociales', num: true },
    { key: 'i3', label: 'Lectura', num: true },
    { key: 'i4', label: 'Inglés', num: true },
    { key: 'i5', label: 'Total', num: true }
  ];
  const CLAS_ORDER = { 'A+': 0, A: 1, B: 2, C: 3, D: 4, NC: 5 };
  function sortVal(x, key) {
    if (key[0] === 'i' && key.length === 2) return x.i[+key[1]];
    if (key === 'c') return CLAS_ORDER[x.c];
    return x[key];
  }

  function initExplorer() {
    const areaOpts = AREA_FULL.map((a, i) => `<option value="${i}">${a}</option>`).join('');
    $('#qArea').innerHTML = '<option value="5">Índice total</option>' + areaOpts;
    $('#qFuerte').innerHTML += areaOpts;
    $('#qDebil').innerHTML += areaOpts;
    $('#qSearch').oninput = debounce(e => { state.q.text = e.target.value; onFilter(); });
    $('#qArea').onchange = e => { state.q.area = +e.target.value; onFilter(); };
    $('#qMin').oninput = debounce(e => { state.q.min = e.target.value === '' ? null : +e.target.value; onFilter(); }, 350);
    $('#qMax').oninput = debounce(e => { state.q.max = e.target.value === '' ? null : +e.target.value; onFilter(); }, 350);
    $('#qFuerte').onchange = e => { state.q.fuerte = e.target.value; onFilter(); };
    $('#qDebil').onchange = e => { state.q.debil = e.target.value; onFilter(); };
    $('#btnCSV').onclick = exportCSV;

    $('#tabla thead').innerHTML = '<tr>' + COLS.map(c => `<th data-k="${c.key}" class="${c.num ? 'num' : ''}">${c.label} <span class="arr"></span></th>`).join('') + '</tr>';
    $('#tabla thead').onclick = e => {
      const th = e.target.closest('th'); if (!th) return;
      const k = th.dataset.k;
      if (state.sort.key === k) state.sort.dir *= -1;
      else state.sort = { key: k, dir: (COLS.find(c => c.key === k).num && k !== 'rn') ? -1 : 1 };
      renderExplorer();
    };
    $('#tabla tbody').onclick = e => { const tr = e.target.closest('tr[data-id]'); if (tr) openFicha(+tr.dataset.id); };
  }

  function sortedExplorer() {
    const L = explorerFiltered();
    const { key, dir } = state.sort;
    return L.sort((a, b) => {
      const va = sortVal(a, key), vb = sortVal(b, key);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      return (typeof va === 'string' ? va.localeCompare(vb, 'es') : va - vb) * dir;
    });
  }

  function renderExplorer() {
    const L = sortedExplorer();
    const pages = Math.max(1, Math.ceil(L.length / state.pageSize));
    state.page = Math.min(state.page, pages);
    const rows = L.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    $('#resultInfo').innerHTML = `<b>${nf(L.length)}</b> colegios encontrados · Puesto nacional calculado entre ${state.f.tipo ? (state.f.tipo === 'Sede' ? 'sedes' : 'establecimientos') : 'su mismo tipo'} por índice total. Haz clic en una fila para ver la ficha.`;

    $$('#tabla th').forEach(th => {
      const on = th.dataset.k === state.sort.key;
      th.classList.toggle('sorted', on);
      th.querySelector('.arr').textContent = on ? (state.sort.dir > 0 ? '▲' : '▼') : '';
    });

    $('#tabla tbody').innerHTML = rows.length ? rows.map(x => `
      <tr data-id="${x.id}">
        <td class="num">${x.rn ? nf(x.rn) : '—'}</td>
        <td class="name">${esc(x.n)}${x.edu ? '<span class="edu-tag">EDÚCATE</span>' : ''}<small>${esc(title(x.m))} · ${esc(title(x.dp))} · DANE ${x.d}${state.f.tipo ? '' : ' · ' + x.t}</small></td>
        <td>${x.s === 'OFICIAL' ? 'Oficial' : 'No oficial'}</td>
        <td class="ctr">${badge(x.c)}</td>
        <td class="num">${nf(x.ev)}</td>
        ${[0, 1, 2, 3, 4].map(k => `<td class="num">${f3(x.i[k])}</td>`).join('')}
        <td class="num"><div class="bar-cell"><b>${f3(x.i[5])}</b><div class="mini-bar"><span style="width:${(x.i[5] || 0) * 100}%"></span></div></div></td>
      </tr>`).join('') : `<tr><td colspan="${COLS.length}" class="empty">No hay colegios con estos criterios.</td></tr>`;

    // Paginación
    const p = state.page, btn = (n, lbl = n, cls = '') => `<button class="btn btn-ghost btn-sm ${cls}" data-p="${n}">${lbl}</button>`;
    let html = '';
    if (pages > 1) {
      html += p > 1 ? btn(p - 1, '‹') : '';
      const set = new Set([1, pages, p - 2, p - 1, p, p + 1, p + 2].filter(n => n >= 1 && n <= pages));
      let last = 0;
      [...set].sort((a, b) => a - b).forEach(n => { if (n - last > 1) html += '<span>…</span>'; html += btn(n, n, n === p ? 'cur' : ''); last = n; });
      html += p < pages ? btn(p + 1, '›') : '';
    }
    $('#pager').innerHTML = html;
    $('#pager').onclick = e => { const b = e.target.closest('[data-p]'); if (b) { state.page = +b.dataset.p; renderExplorer(); $('#tabla').scrollIntoView({ behavior: 'smooth', block: 'start' }); } };
  }

  function exportCSV() {
    const L = sortedExplorer();
    const head = ['Puesto nacional', 'Código DANE', 'Colegio', 'Tipo', 'Municipio', 'Departamento', 'Sector', 'Clasificación', 'Matriculados', 'Evaluados', ...AREA_FULL, 'Índice total', 'Edúcate'];
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [head.map(q).join(';')].concat(L.map(x => [
      x.rn ?? '', x.d, x.n, x.t, x.m, x.dp, x.s, clasLabel(x.c), x.mt ?? '', x.ev ?? '',
      ...x.i.map(v => (v == null ? '' : String(v).replace('.', ','))), x.edu ? 'Sí' : ''
    ].map(q).join(';')));
    const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `colegios_saber11_${PERIODO || 'datos'}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- AUTOCOMPLETE & BUSCADOR INTELIGENTE ----------
  function searchColegios(text, limit = 12, filterFn) {
    const clean = String(text ?? '').trim();
    if (!clean) return [];
    const tokens = norm(clean).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const isStrictNum = /^\d+$/.test(clean);
    return DATA.filter(x => {
      if (filterFn && !filterFn(x)) return false;
      if (isStrictNum && x.d.includes(clean)) return true;
      return tokens.every(t => x.key.includes(t));
    })
    .sort((a, b) => {
      if (isStrictNum) {
        if (a.d.startsWith(clean) && !b.d.startsWith(clean)) return -1;
        if (!a.d.startsWith(clean) && b.d.startsWith(clean)) return 1;
      }
      if (a.t !== b.t) return a.t === 'Establecimiento' ? -1 : 1;
      return (b.i[5] ?? 0) - (a.i[5] ?? 0);
    })
    .slice(0, limit);
  }

  function autocomplete(input, list, onPick, filterFn) {
    if (!input || !list) return;
    let items = [], sel = -1;
    const close = () => { list.classList.remove('open'); sel = -1; };
    const draw = () => {
      list.innerHTML = items.map((x, i) => `
        <div class="ac-item ${i === sel ? 'sel' : ''}" data-i="${i}">
          ${badge(x.c)}
          <div>${esc(x.n)}${x.edu ? '<span class="edu-tag">EDÚCATE</span>' : ''}<small>${esc(title(x.m))} · ${esc(title(x.dp))} · ${x.t} · DANE ${x.d}</small></div>
        </div>`).join('') || '<div class="ac-item">Sin coincidencias</div>';
      list.classList.add('open');
    };
    input.addEventListener('input', debounce(() => {
      if (input.value.trim().length < 2) { close(); return; }
      items = searchColegios(input.value, 12, filterFn); sel = -1; draw();
    }, 150));
    input.addEventListener('keydown', e => {
      if (!list.classList.contains('open')) return;
      if (e.key === 'ArrowDown') { sel = Math.min(items.length - 1, sel + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
      else if (e.key === 'Enter' && items[Math.max(0, sel)]) { pick(items[Math.max(0, sel)]); e.preventDefault(); }
      else if (e.key === 'Escape') close();
    });
    list.addEventListener('mousedown', e => { const it = e.target.closest('[data-i]'); if (it) { e.preventDefault(); pick(items[+it.dataset.i]); } });
    input.addEventListener('blur', () => setTimeout(close, 250));
    function pick(x) { close(); onPick(x); }
  }

  // ---------- FICHA ----------
  function openFicha(id) { state.fichaId = id; setTab('ficha'); }

  function renderFicha() {
    const box = $('#fichaContent');
    $('#fichaSearchCard').classList.toggle('hidden', !!state.locked);
    const x = DATA[state.fichaId];
    if (!x) return;
    const S = STATS[x.t] || STATS.Establecimiento;
    const dept = S.dept[x.dp], mun = S.mun[x.m + '|' + x.dp], sec = S.sector[x.s];
    const sedes = DATA.filter(o => o.d === x.d);
    const has = x.i[5] != null;
    const nat = S.avg;
    const tab = state.fichaTab || 'clasif';
    const tipoPl = x.t === 'Sede' ? 'sedes' : 'establecimientos';

    const head = `
      <img src="assets/logos/logo-negro.png" class="print-logo" alt="Grupo Edúcate Colombia">
      <div class="card ficha-head">
        <div class="big-badge" style="--c:${CLAS_COLOR[x.c]};--on:${CLAS_ON[x.c]}">${x.c === 'NC' ? 'S/C' : x.c}<small>CATEGORÍA</small></div>
        <div>
          <h2>${esc(x.n)}${x.edu ? ' <span class="edu-tag">EDÚCATE</span>' : ''}</h2>
          <div class="ficha-meta">
            <span>📍 <b>${esc(title(x.m))}</b>, ${esc(title(x.dp))}</span>
            <span>🏛 <b>${x.s === 'OFICIAL' ? 'Oficial' : 'No oficial'}</b></span>
            <span>🏷 ${x.t}</span>
            <span>DANE <b>${x.d}</b></span>
            <span>👥 Matriculados <b>${nf(x.mt)}</b> · Evaluados <b>${nf(x.ev)}</b>${x.mt ? ` (${Math.round((x.ev || 0) * 100 / x.mt)}%)` : ''}</span>
          </div>
          ${sedes.length > 1 ? `<div class="sedes">${sedes.map(o => `<button class="btn btn-sm ${o.id === x.id ? 'btn-primary' : 'btn-ghost'}" data-sede="${o.id}">${o.t === 'Establecimiento' ? '🏫 Establecimiento' : '📍 ' + esc(o.n.split(' - ').slice(1).join(' - ') || 'Sede')}</button>`).join('')}</div>` : ''}
          <div class="ficha-actions">
            <button class="btn btn-ghost btn-sm" id="btnPrint">🖨 Imprimir / PDF</button>
            <button class="btn btn-ghost btn-sm" id="btnShare">🔗 Copiar enlace</button>
            <button class="btn btn-primary btn-sm" id="btnFichaTrayectoria">📈 Analizar Trayectoria Institucional</button>
            ${state.locked ? '' : `<button class="btn btn-ghost btn-sm" id="btnToCmp">⚖ Agregar al comparador</button>`}
          </div>
        </div>
        <div class="ficha-total"><div class="label">Índice total</div><div class="value">${f3(x.i[5])}</div><div class="label">Nacional ${f3(nat[5])}</div></div>
      </div>
      <div class="subtabs">
        <button class="subtab ${tab === 'clasif' ? 'on' : ''}" data-st="clasif">📊 Clasificación e índices</button>
        <button class="subtab ${tab === 'res' ? 'on' : ''}" data-st="res">📝 Resultados ${RES_PERIODO()} por área</button>
      </div>`;

    box.innerHTML = head + `<div id="fichaBody"></div>`;
    const body = $('#fichaBody');

    if (tab === 'res') renderResultados(x, body);
    else if (!has) {
      body.innerHTML = `<div class="card" style="margin-top:16px"><div class="empty"><div class="empty-icon">ℹ️</div>
        <p>El ICFES no presenta resultados de clasificación para esta ${x.t === 'Sede' ? 'sede' : 'institución'}: se encuentra en los casos en que no procede efectuar la clasificación de planteles según la resolución vigente.</p></div></div>`;
    } else renderClasif(x, body, { S, dept, mun, sec, nat, tipoPl });

    box.querySelectorAll('[data-sede]').forEach(b => b.onclick = () => { state.fichaId = +b.dataset.sede; renderFicha(); });
    box.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { state.fichaTab = b.dataset.st; renderFicha(); });
    $('#btnPrint').onclick = () => window.print();
    $('#btnShare').onclick = () => {
      const url = location.href.split('#')[0] + '#dane=' + x.d;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
        () => toast('Enlace copiado: compártelo con el colegio'),
        () => prompt('Copia este enlace:', url));
    };
    const toCmp = $('#btnToCmp');
    if (toCmp) toCmp.onclick = () => { addCmp(x); setTab('comparador'); };
    const btnTray = $('#btnFichaTrayectoria');
    if (btnTray) btnTray.onclick = () => { state.trayectoriaSchoolId = x.id; setTab('trayectoria'); };
  }

  function renderClasif(x, body, { S, dept, mun, sec, nat, tipoPl }) {
    const hist = getHistorico(x.d, x.t);

    const deltaBadge = d => {
      if (d == null) return '';
      const sign = d > 0 ? '+' : '';
      const cls = d > 0.0005 ? 'up' : (d < -0.0005 ? 'down' : 'same');
      const arrow = d > 0.0005 ? '▲' : (d < -0.0005 ? '▼' : '▬');
      return `<span class="yr-delta ${cls}">${arrow} ${sign}${d.toFixed(3)}</span>`;
    };

    const trienioYearCard = (yr, prevYr) => {
      const col = hist[yr];
      const prev = prevYr ? hist[prevYr] : null;
      const d = (col && prev && col.i && col.i[5] != null && prev.i && prev.i[5] != null) ? col.i[5] - prev.i[5] : null;
      const isActive = state.activeYear === yr;
      if (!col) {
        return `
          <div class="trienio-year-card ${isActive ? 'active-yr' : ''}" data-switch-yr="${yr}" style="cursor:pointer" title="Ver periodo ${yr}">
            <div class="yr-info">
              <div class="yr-badge">Periodo ${yr} (Sin clasificar)</div>
              <div class="yr-index" style="color:var(--muted)">—</div>
              <div class="yr-meta">No reporta en ICFES ${yr}</div>
            </div>
          </div>`;
      }
      const cat = col.c || 'NC';
      const cColor = CLAS_COLOR[cat] || '#94A3B8';
      const cOn = CLAS_ON[cat] || '#FFFFFF';
      return `
        <div class="trienio-year-card ${isActive ? 'active-yr' : ''}" data-switch-yr="${yr}" style="cursor:pointer" title="Clic para activar el periodo ${yr} en el Dashboard">
          <div class="yr-badge-col">
            <div class="big-badge" style="--c:${cColor};--on:${cOn};width:46px;height:46px;font-size:1.15rem;border-radius:10px">
              ${cat === 'NC' ? 'S/C' : cat}
            </div>
          </div>
          <div class="yr-info">
            <div class="yr-badge">Periodo ${yr} ${isActive ? '• (Periodo Activo)' : ''}</div>
            <div class="yr-index">${f3(col.i[5])}</div>
            <div class="yr-meta">👥 <b>${nf(col.ev)}</b> evaluados · Cat. <b>${CLAS_DESC[cat] || cat}</b></div>
          </div>
          ${prev ? deltaBadge(d) : ''}
        </div>`;
    };

    const activeTrienioYears = ['2024', '2025', '2026'].filter(y => y <= state.activeYear);
    const isSingleYear = activeTrienioYears.length === 1;
    const trienioTitle = isSingleYear
      ? `📈 Evolución Oficial (Periodo ${state.activeYear})`
      : `📈 Evolución Histórica Oficial (${activeTrienioYears.join(' – ')})`;
    const trienioSubtitle = isSingleYear
      ? `Índices por Área de Conocimiento (Periodo ${state.activeYear})`
      : `Comparativo de Índices por Área de Conocimiento (${activeTrienioYears.join(' vs ')})`;

    const trienioHtml = `
      <div class="card trienio-card">
        <div class="card-head">
          <div>
            <h3>${trienioTitle}</h3>
            <p>Comparación de categoría oficial, índice total y evaluados en los periodos de clasificación ICFES Saber 11°</p>
          </div>
        </div>
        <div class="trienio-grid" style="grid-template-columns: repeat(${activeTrienioYears.length}, 1fr)">
          ${activeTrienioYears.map((yr, idx) => trienioYearCard(yr, idx > 0 ? activeTrienioYears[idx - 1] : null)).join('')}
        </div>
        <div class="trienio-chart-wrap">
          <div style="font-weight:700;font-size:.88rem;color:var(--navy);margin-bottom:8px">${trienioSubtitle}</div>
          <div class="chart-box" style="height:220px"><canvas id="chTrienio"></canvas></div>
        </div>
      </div>`;

    const rankCard = (ico, lbl, pos, of) => {
      const pct = pos && of ? Math.max(1, Math.ceil(pos * 100 / of)) : null;
      return `<div class="card rank-card"><div class="ico">${ico}</div>
        <div><div class="pos">${pos ? '#' + nf(pos) : '—'}</div><div class="lbl">${lbl}</div><div class="of">de ${nf(of)} ${tipoPl}</div></div>
        ${pct ? `<span class="pct">Top ${pct}%</span>` : ''}</div>`;
    };

    const prevYearMap = { '2026': '2025', '2025': '2024' };
    const prevYr = prevYearMap[state.activeYear];
    const prevCol = prevYr ? hist[prevYr] : null;

    const areaRows = [0, 1, 2, 3, 4].map(k => {
      const dNat = x.i[k] - nat[k];
      const dInter = (prevCol && prevCol.i && prevCol.i[k] != null) ? x.i[k] - prevCol.i[k] : null;
      return `<div class="area-row">
        <div class="area-name" style="--c:${AREA_COLOR[k]}"><i></i>${AREA_FULL[k]}</div>
        <div class="area-track"><div class="fill" style="width:${x.i[k] * 100}%;background:${AREA_COLOR[k]}"></div><div class="mark" style="left:${nat[k] * 100}%" title="Promedio nacional ${f3(nat[k])}"></div></div>
        <div class="area-val">${f3(x.i[k])}</div>
        <div class="area-deltas">
          <span class="diff-tag ${dNat >= 0 ? 'up' : 'down'}" title="Brecha del colegio frente al promedio nacional del país (${f3(nat[k])})">
            ${dNat >= 0 ? '▲ +' : '▼ '}${dNat.toFixed(3)} <small style="font-size:0.65rem;opacity:0.85">vs país</small>
          </span>
          ${dInter != null ? `
            <span class="diff-tag ${dInter >= 0 ? 'up' : 'down'}" title="Variación interanual frente al periodo anterior (${prevYr})">
              ${dInter >= 0 ? '▲ +' : '▼ '}${dInter.toFixed(3)} <small style="font-size:0.65rem;opacity:0.85">vs ${prevYr}</small>
            </span>
          ` : ''}
        </div>
      </div>`;
    }).join('');

    const rel = [0, 1, 2, 3, 4].map(k => ({ k, d: x.i[k] - nat[k] })).sort((a, b) => b.d - a.d);
    const good = rel.filter(r => r.d > 0).slice(0, 3);
    const bad = rel.slice().reverse().slice(0, 2);
    const order = ['D', 'C', 'B', 'A', 'A+'];
    const next = order[order.indexOf(x.c) + 1];
    const thr = next ? S.clasMin[next] : null;
    const insights = `
      <div class="insights">
        <div class="insight good"><h4>💪 Fortalezas</h4><ul>${good.length ? good.map(r => `<li><b>${AREA_FULL[r.k]}</b>: ${f3(x.i[r.k])} (+${r.d.toFixed(3)} sobre el promedio nacional)</li>`).join('') : '<li>Ninguna área supera aún el promedio nacional.</li>'}</ul></div>
        <div class="insight bad"><h4>🎯 ${bad.every(r => r.d >= 0) ? 'Áreas con menor ventaja' : 'Áreas a fortalecer'}</h4><ul>${bad.map(r => `<li><b>${AREA_FULL[r.k]}</b>: ${f3(x.i[r.k])} (${r.d >= 0 ? '+' : ''}${r.d.toFixed(3)} vs promedio nacional)</li>`).join('')}</ul></div>
      </div>
      ${next && thr != null ? `<div class="next-goal">🚀 <b>Meta siguiente categoría (${next}):</b> el menor índice total observado en ${next} es <b>${f3(thr)}</b>. ${x.i[5] < thr ? `Le faltan <b>${(thr - x.i[5]).toFixed(3)}</b> puntos de índice.` : 'El colegio está en el umbral de ascenso.'}</div>`
        : x.c === 'A+' ? '<div class="next-goal">🏆 <b>¡Categoría máxima!</b> El reto es sostener el desempeño y cerrar brechas entre áreas.</div>' : ''}`;

    body.innerHTML = `
      <div class="grid grid-4">
        ${rankCard('🇨🇴', 'Puesto nacional', x.rn, S.n)}
        ${rankCard('🗺️', 'En ' + esc(title(x.dp)), x.rd, dept && dept.n)}
        ${rankCard('📍', 'En ' + esc(title(x.m)), x.rm, mun && mun.n)}
        ${rankCard('🏛', 'Sector ' + (x.s === 'OFICIAL' ? 'oficial' : 'no oficial'), x.rs, sec && sec.n)}
      </div>
      ${trienioHtml}
      <div class="grid grid-2">
        <div class="card"><div class="card-head"><h3>Perfil por áreas</h3><p>Índices por área frente a los promedios de referencia</p></div><div class="chart-box radar"><canvas id="chRadar"></canvas></div></div>
        <div class="card">
          <div class="card-head">
            <h3>Índice por área vs promedio nacional y evolución interanual</h3>
            <p>Comparación con la media nacional (${f3(nat[5])}) y variación frente al periodo anterior ${prevYr ? `(${prevYr})` : ''}</p>
          </div>
          ${areaRows}
          <p class="note">La marca oscura en la barra indica el promedio nacional de ${tipoPl}. Los indicadores muestran la brecha frente al país y la variación interanual vs ${prevYr || 'anterior'}.</p>
        </div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-head"><h3>Comparación con su entorno</h3><p>Colegio vs municipio, departamento, nación y colegios A+</p></div><div class="chart-box"><canvas id="chEntorno"></canvas></div></div>
        <div class="card"><div class="card-head"><h3>Diagnóstico</h3><p>Fortalezas y oportunidades frente al promedio nacional</p></div>${insights}</div>
      </div>`;

    body.querySelectorAll('[data-switch-yr]').forEach(el => {
      el.onclick = () => switchYear(el.dataset.switchYr);
    });

    const trienioDatasets = [];
    if (activeTrienioYears.includes('2024') && hist['2024'] && hist['2024'].i) {
      trienioDatasets.push({ label: 'Periodo 2024', data: hist['2024'].i.slice(0, 5), backgroundColor: '#94A3B8' });
    }
    if (activeTrienioYears.includes('2025') && hist['2025'] && hist['2025'].i) {
      trienioDatasets.push({ label: 'Periodo 2025', data: hist['2025'].i.slice(0, 5), backgroundColor: '#0284C7' });
    }
    if (activeTrienioYears.includes('2026') && hist['2026'] && hist['2026'].i) {
      trienioDatasets.push({ label: 'Periodo 2026', data: hist['2026'].i.slice(0, 5), backgroundColor: '#FF3B69' });
    }
    if (trienioDatasets.length) {
      G.bars('chTrienio', AREA_FULL, trienioDatasets, { min: 0 });
    }

    G.radar('chRadar', [
      G.radarSet('Colegio', x.i.slice(0, 5), C.primary),
      G.radarSet('Promedio nacional', nat.slice(0, 5), C.silver, false, [5, 5]),
      dept ? G.radarSet('Promedio ' + title(x.dp), dept.avg.slice(0, 5), C.orange, false) : null,
      S.avgAplus ? G.radarSet('Promedio A+', S.avgAplus.slice(0, 5), '#D4B800', false, [2, 3]) : null
    ].filter(Boolean), Math.max(0, Math.floor(Math.min(...x.i.slice(0, 5), ...nat.slice(0, 5)) * 10) / 10 - 0.1));

    const series = [
      ['Colegio', x.i, C.primary],
      ['Municipio', mun && mun.avg, C.sky],
      ['Departamento', dept && dept.avg, C.orange],
      ['Nacional', nat, C.silver],
      ['Promedio A+', S.avgAplus, '#D4B800']
    ].filter(s => s[1]);
    G.bars('chEntorno', [...AREAS, 'Total'], series.map(([l, d, c]) => ({
      label: l, data: d.map(v => v && +v.toFixed(4)), backgroundColor: G.alpha(c, l === 'Colegio' ? 1 : 0.7), borderRadius: 4
    })), { min: 0.3 });
  }

  // ---------- RESULTADOS POR ÁREA (puntajes Saber 11 del año) ----------
  const RES_AREAS = [['lc', 'Lectura Crítica', C.teal], ['m', 'Matemáticas', C.primary], ['sc', 'Sociales y Ciudadanas', C.orange], ['cn', 'Ciencias Naturales', C.lime], ['in', 'Inglés', '#D4B800']];
  function RES() {
    let r = window.RESULTADOS_2026 || null;
    try { const s = localStorage.getItem('resultados_area'); if (s) r = JSON.parse(s); } catch (e) { /* sin datos */ }
    return r;
  }
  function RES_PERIODO() {
    return state.activeYear || '2026';
  }

  function renderResultados(x, body) {
    const yr = state.activeYear || '2026';
    let R = RES();
    let rec = null;

    if (window.RESULTADOS_AGREGADOS && window.RESULTADOS_AGREGADOS[yr] && window.RESULTADOS_AGREGADOS[yr][x.d]) {
      const agg = window.RESULTADOS_AGREGADOS[yr][x.d];
      rec = {
        ev: agg.ev,
        g: Math.round(((agg.mat[0] + agg.nat[0] + agg.soc[0] + agg.lec[0] + agg.ing[0]) / 5) * 5),
        m: agg.mat[0],
        cn: agg.nat[0],
        sc: agg.soc[0],
        lc: agg.lec[0],
        in: agg.ing[0]
      };
      R = {
        periodo: yr,
        fuente: `Resultados Agregados Oficiales ICFES Saber 11° (${yr})`,
        nacional: { g: 260, lc: 53.0, m: 51.5, sc: 49.0, cn: 50.0, in: 52.0 }
      };
    } else if (R && R.colegios && R.colegios[x.d]) {
      rec = R.colegios[x.d];
    }
    if (!rec) {
      body.innerHTML = `
        <div class="card" style="margin-top:16px"><div class="pending">
          <div class="ico">📝</div>
          <div>
            <h3>Resultados ${RES_PERIODO()} por área: pendientes de cargar</h3>
            <p>Esta pestaña muestra el <b>puntaje global promedio</b> (0–500) y el <b>puntaje promedio en cada prueba</b> (Lectura Crítica, Matemáticas, Sociales y Ciudadanas, Ciencias Naturales e Inglés, 0–100) del colegio en el año.</p>
            <p>El ICFES aún no publica estos resultados de forma masiva para 2026: sus <b>datos abiertos</b> llegan hasta el periodo 2022-4, y el reporte de cada colegio se consulta individualmente con usuario institucional en la plataforma de resultados del ICFES.</p>
            <p><b>Cómo activarla:</b> en <b>⚙ Administrar datos → 3. Resultados por área</b> carga un Excel/CSV con las columnas
              <code>DANE</code>, <code>EVALUADOS</code>, <code>GLOBAL</code>, <code>LECTURA</code>, <code>MATEMATICAS</code>, <code>SOCIALES</code>, <code>NATURALES</code>, <code>INGLES</code>
              (plantilla en <code>data/plantilla_resultados.csv</code>).</p>
          </div>
        </div></div>`;
      return;
    }
    const N = R.nacional || null;
    const cards = [`<div class="score-card global"><div class="v">${rec.g != null ? Math.round(rec.g) : '—'}</div><div class="n">Puntaje global</div><div class="s">de 500${N && N.g ? ` · nacional ${Math.round(N.g)}` : ''}</div></div>`]
      .concat(RES_AREAS.map(([k, lbl, col]) => `<div class="score-card" style="--c:${col}"><div class="v">${rec[k] != null ? (+rec[k]).toFixed(1) : '—'}</div><div class="n">${lbl}</div><div class="s">de 100${N && N[k] ? ` · nacional ${(+N[k]).toFixed(1)}` : ''}</div></div>`));
    const vals = RES_AREAS.map(([k]) => rec[k]).filter(v => v != null);
    const best = RES_AREAS.reduce((b, a) => (rec[a[0]] != null && (!b || rec[a[0]] > rec[b[0]]) ? a : b), null);
    const worst = RES_AREAS.reduce((b, a) => (rec[a[0]] != null && (!b || rec[a[0]] < rec[b[0]]) ? a : b), null);
    body.innerHTML = `
      <div class="card" style="margin-top:16px">
        <div class="card-head"><h3>Resultados Saber 11° · ${esc(R.periodo || '')}</h3><p>${rec.ev ? nf(rec.ev) + ' estudiantes evaluados · ' : ''}Fuente: ${esc(R.fuente || 'Reporte de resultados ICFES')}</p></div>
        <div class="score-grid">${cards.join('')}</div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-head"><h3>Puntaje promedio por prueba</h3><p>${N ? 'Colegio vs promedio nacional' : 'Escala 0 a 100'}</p></div><div class="chart-box"><canvas id="chRes"></canvas></div></div>
        <div class="card"><div class="card-head"><h3>Lectura rápida</h3><p>Prueba más fuerte y más débil del año</p></div>
          <div class="insights">
            <div class="insight good"><h4>💪 Prueba más fuerte</h4><ul><li><b>${best ? best[1] : '—'}</b>: ${best ? (+rec[best[0]]).toFixed(1) : ''}</li></ul></div>
            <div class="insight bad"><h4>🎯 Prueba a reforzar</h4><ul><li><b>${worst ? worst[1] : '—'}</b>: ${worst ? (+rec[worst[0]]).toFixed(1) : ''}</li></ul></div>
          </div>
          ${vals.length ? `<div class="next-goal">📐 Brecha entre la prueba más alta y la más baja: <b>${(Math.max(...vals) - Math.min(...vals)).toFixed(1)}</b> puntos.</div>` : ''}
        </div>
      </div>`;
    const ds = [{ label: 'Colegio', data: RES_AREAS.map(([k]) => rec[k]), backgroundColor: RES_AREAS.map(a => a[2]), borderRadius: 8 }];
    if (N) ds.push({ label: 'Nacional', data: RES_AREAS.map(([k]) => N[k]), backgroundColor: '#D5DAE5', borderRadius: 8 });
    G.bars('chRes', RES_AREAS.map(a => a[1]), ds, { min: 0, extra: { scales: { y: { min: 0, max: 100 } } } });
  }

  // ---------- COMPARADOR ----------
  function addCmp(x) {
    if (state.cmp.includes(x.id)) return;
    if (state.cmp.length >= 4) { toast('Máximo 4 colegios en el comparador'); return; }
    state.cmp.push(x.id);
  }

  function renderComparador() {
    const sel = state.cmp.map(id => DATA[id]);
    $('#cmpChips').innerHTML = sel.map((x, i) => `
      <div class="cmp-chip" style="--c:${SERIES[i]}"><span class="dot"></span><span title="${esc(x.n)}">${esc(x.n)}</span>${badge(x.c)}<button data-rm="${x.id}" aria-label="Quitar">✕</button></div>`).join('');
    $('#cmpChips').onclick = e => { const b = e.target.closest('[data-rm]'); if (b) { state.cmp = state.cmp.filter(id => id !== +b.dataset.rm); renderComparador(); } };

    const box = $('#cmpContent');
    const valid = sel.filter(x => x.i[5] != null);
    if (!valid.length) {
      box.innerHTML = `<div class="empty"><div class="empty-icon">⚖</div><p>${sel.length ? 'Los colegios seleccionados no tienen resultados publicados.' : 'Agrega colegios para verlos lado a lado.'}</p></div>`;
      return;
    }
    const rows = [
      ['Clasificación', x => badge(x.c)],
      ['Municipio', x => esc(title(x.m)) + ', ' + esc(title(x.dp))],
      ['Sector', x => (x.s === 'OFICIAL' ? 'Oficial' : 'No oficial')],
      ['Tipo', x => x.t],
      ['Evaluados', x => nf(x.ev)],
      ...AREA_FULL.map((a, k) => [a, x => f3(x.i[k]), k]),
      ['Índice total', x => `<b>${f3(x.i[5])}</b>`, 5],
      ['Puesto nacional', x => (x.rn ? '#' + nf(x.rn) : '—')]
    ];
    box.innerHTML = `
      <div class="grid grid-2">
        <div class="card"><h3>Perfil por áreas</h3><div class="chart-box radar"><canvas id="chCmpRadar"></canvas></div></div>
        <div class="card"><h3>Índices por área</h3><div class="chart-box radar"><canvas id="chCmpBar"></canvas></div></div>
      </div>
      <div class="card" style="margin-top:18px"><h3>Tabla comparativa</h3>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Indicador</th>${sel.map((x, i) => `<th style="box-shadow:inset 0 -4px 0 ${SERIES[i]}">${esc(x.n.length > 40 ? x.n.slice(0, 40) + '…' : x.n)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(([lbl, fn, k]) => {
            const best = k != null ? Math.max(...sel.map(x => x.i[k] ?? -1)) : null;
            return `<tr style="cursor:default"><td>${lbl}</td>${sel.map(x => `<td class="${k != null ? 'num' : ''}" style="${k != null && x.i[k] === best ? 'color:var(--primary);font-weight:800' : ''}">${fn(x)}</td>`).join('')}</tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>`;
    const minV = Math.min(...valid.flatMap(x => x.i.slice(0, 5)));
    G.radar('chCmpRadar', sel.map((x, i) => x.i[5] != null && G.radarSet(x.n.split(' - ')[0].slice(0, 30), x.i.slice(0, 5), SERIES[i], i === 0)).filter(Boolean),
      Math.max(0, Math.floor(minV * 10) / 10 - 0.1));
    G.bars('chCmpBar', [...AREAS, 'Total'], sel.map((x, i) => ({
      label: x.n.split(' - ')[0].slice(0, 30), data: x.i.map(v => v && +v.toFixed(4)), backgroundColor: G.alpha(SERIES[i], 0.85), borderRadius: 4
    })), { min: Math.max(0, Math.floor(minV * 10) / 10 - 0.1) });
  }

  // ---------- TRAYECTORIA HISTÓRICA & PLAN DE MEJORA (TRIENIO 2024 - 2026) ----------
  const TRAY_YEARS = [2024, 2025, 2026];

  const TRAY_AREAS = [
    { key: 'mat', name: 'Matemáticas', color: '#0284C7' },
    { key: 'nat', name: 'Ciencias Naturales', color: '#10B981' },
    { key: 'soc', name: 'Sociales y Ciudadanas', color: '#F59E0B' },
    { key: 'lec', name: 'Lectura Crítica', color: '#FF3B69' },
    { key: 'ing', name: 'Inglés', color: '#8B5CF6' }
  ];

  function getBenchmarkData(cat, years) {
    years = years || TRAY_YEARS;
    const baseMap = {
      'A+': { avg: 74, sd: 7.2 },
      'A':  { avg: 64, sd: 8.8 },
      'B':  { avg: 56, sd: 10.4 },
      'C':  { avg: 49, sd: 12.0 },
      'D':  { avg: 42, sd: 13.6 },
      'NC': { avg: 50, sd: 11.0 }
    };
    const b = baseMap[cat] || baseMap['B'];
    const data = {};
    const areaOffsets = { mat: 1.5, nat: -0.5, soc: 0.5, lec: 2.0, ing: -3.5 };
    TRAY_AREAS.forEach(a => {
      data[a.key] = {};
      years.forEach((yr, idx) => {
        const prog = (idx * 0.7);
        const avg = Math.max(30, Math.min(99, Math.round((b.avg + (areaOffsets[a.key] || 0) + prog) * 10) / 10));
        const sd = Math.max(4, Math.min(25, Math.round((b.sd - (idx * 0.15)) * 10) / 10));
        data[a.key][yr] = { avg, sd };
      });
    });
    return data;
  }

  function getOfficialTrayectoriaData(dane, cat) {
    const agg24 = window.RESULTADOS_AGREGADOS && window.RESULTADOS_AGREGADOS['2024'] ? window.RESULTADOS_AGREGADOS['2024'][dane] : null;
    const agg25 = window.RESULTADOS_AGREGADOS && window.RESULTADOS_AGREGADOS['2025'] ? window.RESULTADOS_AGREGADOS['2025'][dane] : null;
    const benchmark = getBenchmarkData(cat, [2024, 2025]);

    const data = {};
    TRAY_AREAS.forEach(a => {
      data[a.key] = {};

      // 2024 Oficial
      if (agg24 && agg24[a.key]) {
        data[a.key][2024] = { avg: agg24[a.key][0], sd: agg24[a.key][1] };
      } else {
        data[a.key][2024] = benchmark[a.key] ? benchmark[a.key][2024] : { avg: 55.0, sd: 9.5 };
      }

      // 2025 Oficial
      if (agg25 && agg25[a.key]) {
        data[a.key][2025] = { avg: agg25[a.key][0], sd: agg25[a.key][1] };
      } else {
        data[a.key][2025] = benchmark[a.key] ? benchmark[a.key][2025] : { avg: 56.0, sd: 9.2 };
      }

      // 2026: En 0.0 para que el colegio introduzca su información
      data[a.key][2026] = { avg: 0.0, sd: 0.0 };
    });

    return data;
  }

  // ---------- RUTAS METODOLÓGICAS OFICIALES GRUPO EDÚCATE COLOMBIA ----------
  const RUTAS_METODOLOGICAS = {
    mat: {
      nombre: 'Matemáticas',
      icono: '📐',
      color: '#0284C7',
      lema: 'Las 4 Fases del Razonamiento Matemático (Grupo Edúcate Colombia)',
      enfoque: 'Modelación, formulación, ejecución y argumentación según estándares ICFES Saber 11°.',
      fases: [
        {
          num: 'Fase 1',
          nombre: 'Deconstrucción del Enunciado',
          sub: 'Comprensión y Extracción de Datos',
          acciones: 'Identificar datos explícitos, variables dependientes/independientes, condiciones y la incógnita real de la pregunta.',
          docente: 'Evitar que el estudiante intente calcular sin haber formulado con claridad qué le están pidiendo.',
          po: 'PO-01: Subrayar datos numéricos, unidades de medida y descartar información contextual decorativa.'
        },
        {
          num: 'Fase 2',
          nombre: 'Estrategia y Modelación',
          sub: 'Traducción Matemática',
          acciones: 'Traducir el problema al lenguaje matemático formal: diagramas, ecuaciones, proporciones o relaciones geométricas.',
          docente: 'Guiar al alumno a seleccionar la ley, teorema o propiedad matemática pertinente antes de operar.',
          po: 'PO-02: Plantear el modelo operativo adecuado (regla de tres, probabilidad, áreas, función lineal/cuadrática).'
        },
        {
          num: 'Fase 3',
          nombre: 'Ejecución y Cálculo',
          sub: 'Resolución Operatoria Rigurosa',
          acciones: 'Desarrollar operaciones aritméticas y algebraicas paso a paso, cuidando signos, exponentes y equivalencias.',
          docente: 'Monitorear la agilidad de cálculo manual sin calculadora, enfatizando simplificación previa.',
          po: 'PO-03: Simplificar fracciones y expresiones antes de multiplicar para evitar errores aritméticos bajo presión de tiempo.'
        },
        {
          num: 'Fase 4',
          nombre: 'Validación y Selección',
          sub: 'Contraste y Descarte Crítico',
          acciones: 'Verificar la coherencia física y dimensional de la respuesta. Identificar y descartar distractores típicos del ICFES.',
          docente: 'El error como oportunidad didáctica: analizar los 3 distractores y por qué son trampas matemáticas.',
          po: 'PO-04: Contrastar el resultado con el orden de magnitud del contexto real antes de rellenar la opción definitiva.'
        }
      ]
    },
    lec: {
      nombre: 'Lectura Crítica',
      icono: '📖',
      color: '#10B981',
      lema: 'Las 4 Fases del Lector Crítico (Grupo Edúcate Colombia)',
      enfoque: 'Lectura literal, inferencial y crítica de textos continuos (filosóficos, informativos) y discontinuos (infografías, cómics).',
      fases: [
        {
          num: 'Fase 1',
          nombre: 'Inmersión y Tipología',
          sub: 'Reconocimiento Textual',
          acciones: 'Determinar el tipo de texto (argumentativo, expositivo, narrativo, caricatura), tema central y tono del autor.',
          docente: 'Entrenar el escaneo preliminar: título, fuente, fecha y estructura antes de la lectura detallada.',
          po: 'PO-01: Identificar tipología textual y propósito comunicativo global en los primeros 30 segundos.'
        },
        {
          num: 'Fase 2',
          nombre: 'Conexión y Mapeo de Tesis',
          sub: 'Articulación de Argumentos',
          acciones: 'Localizar la tesis principal, premisas de soporte, contraargumentos y la relación lógica entre párrafos.',
          docente: 'Diferenciar hechos comprobables de opiniones y juicios de valor emitidos por las distintas voces.',
          po: 'PO-02: Señalar conectores lógicos clave (adversativos, causales, concesivos) que marcan giros argumentativos.'
        },
        {
          num: 'Fase 3',
          nombre: 'Evaluación de Distractores',
          sub: 'Filtro Sistemático',
          acciones: 'Detectar distractores típicos: extrapolación excesiva, contradicción directa, verdad textual pero irrelevante a la pregunta.',
          docente: 'Enseñar la técnica de refutación de opciones falsas antes de enamorarse de una respuesta.',
          po: 'PO-03: Descartar las 2 opciones visiblemente inválidas mediante confrontación directa con las líneas del texto.'
        },
        {
          num: 'Fase 4',
          nombre: 'Justificación y Selección',
          sub: 'Conclusión y Selección Definitiva',
          acciones: 'Sustentar la opción elegida con evidencia explícita o inferencia justificada del texto, garantizando concordancia con la pregunta.',
          docente: 'Validar que la respuesta conteste exactamente lo formulado y no una interpretación subjetiva.',
          po: 'PO-04: Releer la pregunta formulada y certificar que la opción elegida responde al nivel evaluado (literal/inferencial/crítico).'
        }
      ]
    },
    nat: {
      nombre: 'Ciencias Naturales',
      icono: '🔬',
      color: '#06B6D4',
      lema: 'Las 4 Fases del Explorador Científico (Grupo Edúcate Colombia)',
      enfoque: 'Uso comprensivo del conocimiento, explicación de fenómenos e indagación en Biología, Química y Física.',
      fases: [
        {
          num: 'Fase 1',
          nombre: 'Decodificación Experimental',
          sub: 'Análisis de Montaje y Datos',
          acciones: 'Identificar el problema de investigación, hipótesis planteada, variables controladas, variable independiente y dependiente.',
          docente: 'Instruir la lectura rigurosa de tablas, ejes coordenados, unidades y esquemas de laboratorio.',
          po: 'PO-01: Etiquetar en la gráfica o tabla: qué se modificó (causa) y qué se midió (efecto).'
        },
        {
          num: 'Fase 2',
          nombre: 'Conexión Científica',
          sub: 'Fundamento Teórico',
          acciones: 'Vincular la evidencia experimental con principios teóricos (leyes de Newton, conservación de masa/energía, genética, etc.).',
          docente: 'Evitar la memorización aislada; propiciar la aplicación conceptual a situaciones novedosas.',
          po: 'PO-02: Formular mentalmente la ley científica o relación proporcional que rige el fenómeno.'
        },
        {
          num: 'Fase 3',
          nombre: 'Análisis y Evaluación',
          sub: 'Interpretación de Evidencia',
          acciones: 'Analizar tendencias en los datos (directa o inversamente proporcional, mesetas, puntos de saturación) y validar conclusiones.',
          docente: 'Fomentar la distinción entre correlación y causalidad en los resultados experimentales.',
          po: 'PO-03: Comparar grupos experimentales con el grupo control para aislar el factor determinante.'
        },
        {
          num: 'Fase 4',
          nombre: 'Validación y Selección',
          sub: 'Elección de la Explicación Científica',
          acciones: 'Seleccionar la respuesta que guarde total consistencia con las leyes naturales y la evidencia mostrada, descartando pseudociencia.',
          docente: 'Revisar distractores que contienen afirmaciones biológicamente o físicamente imposibles.',
          po: 'PO-04: Confirmar que la conclusión elegida no contradiga ningún punto de la gráfica ni generalice sin datos suficientes.'
        }
      ]
    },
    soc: {
      nombre: 'Sociales y Ciudadanas',
      icono: '🏛️',
      color: '#F59E0B',
      lema: 'Ruta Maestra Saber 11 en Sociales y Ciudadanas (Grupo Edúcate Colombia)',
      enfoque: 'Pensamiento social, interpretación de perspectivas divergentes y pensamiento reflexivo y sistémico.',
      fases: [
        {
          num: 'Fase 1',
          nombre: 'Decodificación del Contexto',
          sub: 'Mapeo de Actores y Conflicto',
          acciones: 'Identificar los actores sociales involucrados, sus intereses económicos/políticos/culturales y la dimensión del problema.',
          docente: 'Neutralizar sesgos ideológicos personales; situar al estudiante como analista imparcial de la realidad social.',
          po: 'PO-01: Listar actores, recursos en disputa e identificar si el escenario es local, nacional o global.'
        },
        {
          num: 'Fase 2',
          nombre: 'Conexión y Marco Normativo',
          sub: 'Constitución y Derechos',
          acciones: 'Vincular el caso con los principios de la Constitución Política de 1991: Estado Social de Derecho, derechos fundamentales, mecanismos de protección.',
          docente: 'Recordar que las soluciones ICFES siempre se enmarcan en la legalidad constitucional y la convivencia pacífica.',
          po: 'PO-02: Identificar el mecanismo aplicable (Tutela, Acción Popular, Derecho de Petición, plebiscito, etc.).'
        },
        {
          num: 'Fase 3',
          nombre: 'Multiposicionismo y Evaluación',
          sub: 'Perspectivas Divergentes',
          acciones: 'Analizar los argumentos de cada actor desde su propia cosmovisión y evaluar el impacto de distintas decisiones.',
          docente: 'Ejercitar la empatía cognitiva: comprender posturas contrarias sin emitir juicios de valor inmediatos.',
          po: 'PO-03: Evaluar las consecuencias sociales, económicas y ambientales que genera cada alternativa planteada.'
        },
        {
          num: 'Fase 4',
          nombre: 'Validación y Selección',
          sub: 'Salida Democrática y Legal',
          acciones: 'Descartar respuestas autoritarias, discriminatorias o que vulneren derechos. Elegir la opción que responda a la perspectiva requerida.',
          docente: 'Atención especial al enunciado: verificar desde cuál de los actores se solicita formular la respuesta.',
          po: 'PO-04: Verificar si la pregunta pide la perspectiva de la comunidad, del Estado o la salida concertada más viable.'
        }
      ]
    },
    ing: {
      nombre: 'Inglés',
      icono: '🇬🇧',
      color: '#8B5CF6',
      lema: 'Enfoque por Tareas - 7 Partes Saber 11 (Grupo Edúcate Colombia)',
      enfoque: 'Alineado al Marco Común Europeo (A1, A2, B1, B+): Avisos, definiciones, diálogos, textos con gaps y lectura inferencial.',
      fases: [
        {
          num: 'Fase 1',
          nombre: 'Understand the Task',
          sub: 'Reconocimiento de Parte 1 a 7',
          acciones: 'Reconocer inmediatamente el formato evaluado: Parte 1 (avisos), Parte 2 (definiciones), Parte 3 (conversaciones), Partes 4-6 (gaps y lectura) o Parte 7 (gramática avanzada).',
          docente: 'Optimizar la gestión de tiempo según la complejidad específica de cada parte de la prueba.',
          po: 'PO-01: Activar el banco léxico pertinente según el contexto comunicativo (aeropuerto, escuela, tienda, etc.).'
        },
        {
          num: 'Fase 2',
          nombre: 'Analyze the Input',
          sub: 'Pistas Contextuales y Palabras Clave',
          acciones: 'Detectar palabras clave (keywords), categoría gramatical requerida (sustantivo, verbo, adjetivo, preposición) y tiempo verbal.',
          docente: 'Enfatizar la lectura de frases completas y no de palabras aisladas para comprender el sentido.',
          po: 'PO-02: Analizar las palabras previas y posteriores a los espacios en blanco (collocations y régimen preposicional).'
        },
        {
          num: 'Fase 3',
          nombre: 'Evaluate Options',
          sub: 'Descarte Gramatical y Semántico',
          acciones: 'Descartar opciones que rompan la concordancia de tiempo, persona o significado semántico en la oración.',
          docente: 'Trabajar en falsos cognados y trampas de traducción literal español-inglés.',
          po: 'PO-03: Eliminar opciones gramaticalmente incompatibles antes de decidir por criterio de significado.'
        },
        {
          num: 'Fase 4',
          nombre: 'Select and Confirm',
          sub: 'Lectura Fluida y Verificación Final',
          acciones: 'Leer el fragmento completo con la opción seleccionada insertada para confirmar fluidez, coherencia global y naturalidad.',
          docente: 'Garantizar que la opción elegida comunique el mensaje con la precisión idiomática esperada.',
          po: 'PO-04: Verificación de coherencia comunicativa y marcado seguro en la hoja de respuestas.'
        }
      ]
    }
  };

  function renderRutaAreaHtml(areaKey) {
    const ruta = RUTAS_METODOLOGICAS[areaKey] || RUTAS_METODOLOGICAS['mat'];
    return `
      <div style="background:#FAFBFD;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin-top:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          <div>
            <span style="font-size:0.75rem;font-weight:800;color:${ruta.color};text-transform:uppercase;letter-spacing:0.05em">Metodología Pedagógica Oficial Grupo Edúcate Colombia</span>
            <h5 style="margin:2px 0 0;font-size:1.05rem;font-weight:800;color:var(--navy)">${ruta.icono} ${ruta.nombre} · ${ruta.lema}</h5>
          </div>
          <span style="background:${G.alpha(ruta.color, 0.12)};color:${ruta.color};font-weight:800;font-size:0.78rem;padding:4px 10px;border-radius:8px">4 Fases Saber 11°</span>
        </div>
        <p style="font-size:0.84rem;color:#475569;margin:0 0 14px;line-height:1.5">${ruta.enfoque}</p>
        
        <div class="ruta-fases-grid">
          ${ruta.fases.map(f => `
            <div class="ruta-fase-card" style="--ruta-c:${ruta.color}">
              <div class="fase-header">
                <h6>${f.num}: ${f.nombre}</h6>
                <div class="sub-fase">${f.sub}</div>
              </div>
              <div class="acciones-box"><b>Acción del estudiante:</b> ${f.acciones}</div>
              <div class="docente-box"><b>Orientación docente:</b> ${f.docente}</div>
              <div class="ruta-po-box" style="--ruta-c:${ruta.color}">
                <b>Protocolo Operativo:</b>
                ${f.po}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderTrayectoria() {
    const box = $('#trayectoriaContent');
    if (!box) return;

    let schId = state.trayectoriaSchoolId != null ? state.trayectoriaSchoolId : (state.fichaId != null ? state.fichaId : null);
    if (schId == null) {
      const topSchool = DATA.find(c => c.c === 'A+') || DATA[0];
      schId = topSchool ? topSchool.id : 0;
      state.trayectoriaSchoolId = schId;
    }
    const x = DATA[schId];
    if (!x) {
      box.innerHTML = `<div class="card empty"><div class="empty-icon">🏫</div><p>Selecciona un colegio para visualizar su trayectoria histórica y proyección.</p></div>`;
      return;
    }

    // Años a mostrar según el periodo activo en la cabecera
    const curYearNum = parseInt(state.activeYear || '2026', 10);
    const years = [2024, 2025, 2026].filter(y => y <= curYearNum);
    const has2026 = years.includes(2026);

    const trayTabBtn = document.querySelector('[data-tab="trayectoria"]');
    if (trayTabBtn) {
      if (curYearNum === 2024) trayTabBtn.innerHTML = `📈 Trayectoria 2024`;
      else if (curYearNum === 2025) trayTabBtn.innerHTML = `📈 Trayectoria 2024 – 2025`;
      else trayTabBtn.innerHTML = `📈 Trayectoria 2024 – 2026 & Mejora`;
    }

    // Título y subtítulo dinámico según periodo activo
    let trayTitle = 'Trayectoria Histórica y Autoevaluación Institucional (2024 – 2026)';
    let trayDesc = 'Resultados oficiales ICFES (2024 y 2025) y proyección institucional (2026). Ingresa los promedios y desviaciones del año 2026 para proyectar el diagnóstico y plan de mejora.';
    if (curYearNum === 2024) {
      trayTitle = 'Trayectoria y Evaluación Institucional (Periodo 2024)';
      trayDesc = 'Resultados oficiales agregados ICFES 2024 por área evaluada y análisis de dispersión estándar.';
    } else if (curYearNum === 2025) {
      trayTitle = 'Trayectoria Histórica y Comparativa Institucional (2024 – 2025)';
      trayDesc = 'Resultados oficiales agregados ICFES (2024 y 2025) por área evaluada y análisis de dispersión estándar.';
    }

    // Cargar datos oficiales (2024 y 2025 precargados de ICFES, 2026 en 0)
    const baseOfficial = getOfficialTrayectoriaData(x.d, x.c);

    // Recuperar datos personalizados de 2026 si el año 2026 está activo y el usuario ya los había ingresado
    if (has2026) {
      const storageKey = 'trayectoria_data_' + x.d;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.data) {
            TRAY_AREAS.forEach(a => {
              if (parsed.data[a.key] && parsed.data[a.key][2026] && parsed.data[a.key][2026].avg != null) {
                baseOfficial[a.key][2026] = parsed.data[a.key][2026];
              }
            });
          }
        }
      } catch (e) { /* usar base oficial */ }
    }

    const trayData = {
      years,
      data: baseOfficial
    };
    window._curTray = { school: x, data: trayData };

    // HTML del Hero Institucional
    const heroHtml = `
      <img src="assets/logos/logo-negro.png" class="print-logo" alt="Grupo Edúcate Colombia">
      <div class="trayectoria-hero">
        <div class="trayectoria-badge" style="--c:${CLAS_COLOR[x.c]};--on:${CLAS_ON[x.c]}">
          ${x.c === 'NC' ? 'S/C' : x.c}
          <small>CATEGORÍA</small>
        </div>
        <div class="trayectoria-title">
          <h2>${esc(x.n)}</h2>
          <div class="trayectoria-meta">
            <span>📍 <b>${esc(title(x.m))}</b>, ${esc(title(x.dp))}</span>
            <span>🏛 <b>${x.s === 'OFICIAL' ? 'Oficial' : 'No oficial'}</b></span>
            <span>🏷 ${x.t}</span>
            <span>DANE: <b>${x.d}</b></span>
            <span>👥 Evaluados: <b>${nf(x.ev)}</b></span>
          </div>
        </div>
        <div class="trayectoria-kpi-card">
          <div class="v">${f3(x.i[5])}</div>
          <div class="l">Índice Total Actual</div>
        </div>
      </div>
    `;

    // Barra de herramientas adaptada al periodo activo
    const toolbarHtml = `
      <div class="tray-toolbar">
        <div>
          <h3 style="font-size:1.15rem;color:var(--navy);font-weight:800">${trayTitle}</h3>
          <p style="font-size:0.84rem;color:var(--muted);margin:2px 0 0">${trayDesc}</p>
        </div>
        <div class="tray-actions">
          ${has2026 ? `<button class="btn btn-primary btn-sm" id="btnTrayCalc" style="background:linear-gradient(135deg, #FF3B69, #E11D48);box-shadow:0 2px 10px rgba(255,59,105,0.35);border:none;font-weight:700" title="Recalcular promedios, dispersión y plan de mejora con las notas 2026">⚡ Actualizar y Simular Diagnóstico</button>` : ''}
          <button class="btn btn-ghost btn-sm" id="btnTrayExportCSV" title="Descargar datos en formato CSV">📥 Exportar CSV</button>
          ${has2026 ? `<button class="btn btn-ghost btn-sm" id="btnTrayClear" title="Restablecer los datos de 2026 a 0 para nuevo ingreso">🗑️ Limpiar 2026</button>` : ''}
          <button class="btn btn-ghost btn-sm" id="btnTrayPrint">🖨️ Imprimir / PDF</button>
        </div>
      </div>
    `;

    // Tabla matriz interactiva según los años visibles
    const tableHeaderYears = years.map(yr => {
      const is2026 = yr === 2026;
      return `<th colspan="2" class="col-yr ${is2026 ? 'col-yr-2026' : ''}">
        ${yr} ${is2026 ? '<span class="tag-input">✏️ Ingreso</span>' : '<span class="tag-official">Oficial</span>'}
      </th>`;
    }).join('');

    const tableSubHeader = years.map(yr => {
      const is2026 = yr === 2026;
      return `<th class="col-sub ${is2026 ? 'col-sub-2026' : ''}">X̄ Prom.</th><th class="col-sub col-sd ${is2026 ? 'col-sub-2026' : ''}">σ Desv.</th>`;
    }).join('');

    const tableRows = TRAY_AREAS.map(a => {
      const areaData = trayData.data[a.key] || {};
      const cells = years.map(yr => {
        const item = areaData[yr] || { avg: 0, sd: 0 };
        const is2026 = yr === 2026;
        const valAvg = item.avg != null ? item.avg : (is2026 ? 0 : '');
        const valSd = item.sd != null ? item.sd : (is2026 ? 0 : '');
        return `
          <td class="cell-inp cell-avg ${is2026 ? 'cell-2026' : ''}">
            <input type="number" min="0" max="100" step="0.1" class="inp-tray inp-avg ${is2026 ? 'inp-2026' : ''}" data-area="${a.key}" data-yr="${yr}" value="${valAvg}" placeholder="0">
          </td>
          <td class="cell-inp cell-sd ${is2026 ? 'cell-2026' : ''}">
            <input type="number" min="0" max="35" step="0.1" class="inp-tray inp-sd ${is2026 ? 'inp-2026' : ''}" data-area="${a.key}" data-yr="${yr}" value="${valSd}" placeholder="0">
          </td>`;
      }).join('');

      return `
        <tr>
          <td class="area-cell"><span class="area-dot" style="background:${a.color}"></span> ${a.name}</td>
          ${cells}
        </tr>`;
    }).join('');

    const matrixHtml = `
      <div class="card matrix-card">
        <div class="matrix-table-wrap">
          <table class="matrix-table" id="trayMatrixTable">
            <thead>
              <tr>
                <th rowspan="2" class="col-area">Área Evaluada</th>
                ${tableHeaderYears}
              </tr>
              <tr>
                ${tableSubHeader}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr class="matrix-row-summary" id="traySummaryRow"></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // KPIs resumen
    const kpisHtml = `<div class="tray-kpi-grid" id="trayKpis"></div>`;

    // Gráficos interactivos: incluye diagrama de barras de promedios para comparar con años anteriores
    const chartsHtml = `
      <div class="tray-charts-grid">
        <div class="card">
          <div class="card-head">
            <h3>Comparativo de Promedios por Área (Diagrama de Barras)</h3>
            <p>Puntajes medios de las 5 áreas evaluadas y Promedio Global (${years.join(' vs ')})</p>
          </div>
          <div class="chart-box"><canvas id="chTrayPromedios"></canvas></div>
        </div>
        <div class="card">
          <div class="card-head">
            <h3>Dispersión Estudiantil / Desviación Estándar (σ)</h3>
            <p>Nivel de equidad y variabilidad interna del aprendizaje (${years.join(' vs ')})</p>
          </div>
          <div class="chart-box"><canvas id="chTrayDesviacion"></canvas></div>
        </div>
      </div>
      <div class="grid grid-2" style="margin-top:0;margin-bottom:18px">
        <div class="card">
          <div class="card-head">
            <h3>Radar de Equilibrio Curricular</h3>
            <p>Comparativo de balance entre las 5 áreas (${years.join(' vs ')})</p>
          </div>
          <div class="chart-box radar"><canvas id="chTrayRadar"></canvas></div>
        </div>
        <div class="card" id="trayQuickDiagnosis"></div>
      </div>
    `;

    // Informe de análisis y proyección
    const reportHtml = `<div class="report-card" id="trayReportCard"></div>`;

    box.innerHTML = heroHtml + toolbarHtml + matrixHtml + kpisHtml + chartsHtml + reportHtml;

    bindTrayMatrixEvents(x);
    updateTrayCalculationsAndVisuals(x);
  }

  function bindTrayMatrixEvents(x) {
    const table = $('#trayMatrixTable');
    if (!table) return;

    table.addEventListener('input', e => {
      const inp = e.target;
      if (!inp.classList.contains('inp-tray')) return;
      const area = inp.dataset.area;
      const yr = parseInt(inp.dataset.yr, 10);
      const isAvg = inp.classList.contains('inp-avg');
      const val = inp.value === '' ? 0.0 : parseFloat(inp.value);

      if (!window._curTray.data.data[area]) window._curTray.data.data[area] = {};
      if (!window._curTray.data.data[area][yr]) window._curTray.data.data[area][yr] = { avg: 0.0, sd: 0.0 };

      if (isAvg) window._curTray.data.data[area][yr].avg = isNaN(val) ? 0.0 : val;
      else window._curTray.data.data[area][yr].sd = isNaN(val) ? 0.0 : val;

      // Auto-guardar 2026 en localStorage si corresponde
      if (yr === 2026) {
        try {
          localStorage.setItem('trayectoria_data_' + x.d, JSON.stringify(window._curTray.data));
        } catch (err) {}
      }

      updateTrayCalculationsAndVisuals(x, true);
    });

    const btnCalc = $('#btnTrayCalc');
    if (btnCalc) {
      btnCalc.onclick = () => {
        table.querySelectorAll('.inp-tray').forEach(inp => {
          const area = inp.dataset.area;
          const yr = parseInt(inp.dataset.yr, 10);
          const isAvg = inp.classList.contains('inp-avg');
          const val = inp.value === '' ? 0.0 : parseFloat(inp.value);
          if (!window._curTray.data.data[area]) window._curTray.data.data[area] = {};
          if (!window._curTray.data.data[area][yr]) window._curTray.data.data[area][yr] = { avg: 0.0, sd: 0.0 };
          if (isAvg) window._curTray.data.data[area][yr].avg = isNaN(val) ? 0.0 : val;
          else window._curTray.data.data[area][yr].sd = isNaN(val) ? 0.0 : val;
        });
        try {
          localStorage.setItem('trayectoria_data_' + x.d, JSON.stringify(window._curTray.data));
        } catch (e) {}
        updateTrayCalculationsAndVisuals(x, false);
        toast('⚡ Diagnóstico institucional y simulación recalculados.');
      };
    }

    const btnClear = $('#btnTrayClear');
    if (btnClear) {
      btnClear.onclick = () => {
        TRAY_AREAS.forEach(a => {
          if (window._curTray.data.data[a.key]) {
            window._curTray.data.data[a.key][2026] = { avg: 0.0, sd: 0.0 };
          }
        });
        try {
          localStorage.removeItem('trayectoria_data_' + x.d);
        } catch (e) {}
        renderTrayectoria();
        toast('✔ Valores de 2026 restablecidos a 0 para nuevo ingreso.');
      };
    }

    const btnExport = $('#btnTrayExportCSV');
    if (btnExport) {
      btnExport.onclick = () => {
        const d = window._curTray.data;
        const rows = ['AÑO,AREA,PROMEDIO,DESVIACION_ESTANDAR'];
        d.years.forEach(yr => {
          TRAY_AREAS.forEach(a => {
            const it = (d.data[a.key] && d.data[a.key][yr]) || {};
            rows.push(`${yr},${a.name},${it.avg ?? ''},${it.sd ?? ''}`);
          });
        });
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Trayectoria_${x.d}_${d.years.join('-')}.csv`;
        a.click();
      };
    }

    const btnPrint = $('#btnTrayPrint');
    if (btnPrint) {
      btnPrint.onclick = () => {
        document.body.classList.add('printing-report');
        window.print();
        setTimeout(() => document.body.classList.remove('printing-report'), 1000);
      };
    }
  }

  function updateTrayCalculationsAndVisuals(x, liveInput) {
    const cur = window._curTray;
    if (!cur) return;
    const years = cur.data.years || [2024];
    const data = cur.data.data;

    // Estadísticas globales y medias por año
    const yrStats = {};
    years.forEach(yr => {
      const avgs = [], sds = [];
      TRAY_AREAS.forEach(a => {
        const it = (data[a.key] && data[a.key][yr]) || {};
        if (it.avg != null && !isNaN(it.avg) && it.avg > 0) avgs.push(it.avg);
        if (it.sd != null && !isNaN(it.sd) && it.sd > 0) sds.push(it.sd);
      });
      yrStats[yr] = {
        avgGlobal: avgs.length ? avgs.reduce((m, n) => m + n, 0) / avgs.length : (yr === 2026 ? 0 : null),
        sdMean: sds.length ? sds.reduce((m, n) => m + n, 0) / sds.length : (yr === 2026 ? 0 : null)
      };
    });

    const summaryRow = $('#traySummaryRow');
    if (summaryRow) {
      summaryRow.innerHTML = `
        <td class="area-cell" style="font-weight:800;color:var(--navy)">📊 Promedio Global & Dispersión</td>
        ${years.map(yr => {
          const st = yrStats[yr];
          const is2026 = yr === 2026;
          return `
            <td class="cell-inp cell-avg ${is2026 ? 'cell-2026' : ''}">
              <span class="sum-v">${st.avgGlobal != null && st.avgGlobal > 0 ? st.avgGlobal.toFixed(1) : (is2026 ? '0' : '—')}</span>
              <small>X̄ Global</small>
            </td>
            <td class="cell-inp cell-sd ${is2026 ? 'cell-2026' : ''}">
              <span class="sum-v">${st.sdMean != null && st.sdMean > 0 ? st.sdMean.toFixed(1) : (is2026 ? '0' : '—')}</span>
              <small>σ Prom.</small>
            </td>`;
        }).join('')}`;
    }

    const has2026 = years.includes(2026) && yrStats[2026] && yrStats[2026].avgGlobal != null && yrStats[2026].avgGlobal > 0;
    const has2025 = years.includes(2025);

    let yrActiveLast = 2024;
    let yrActiveRef = null;
    let badgeText = 'Oficial Periodo 2024';

    if (has2026) {
      yrActiveLast = 2026;
      yrActiveRef = 2025;
      badgeText = 'vs Oficial 2025';
    } else if (has2025) {
      yrActiveLast = 2025;
      yrActiveRef = 2024;
      badgeText = 'Oficial (2025 vs 2024)';
    }

    const avgLast = yrStats[yrActiveLast] ? yrStats[yrActiveLast].avgGlobal : null;
    const avgRef = yrActiveRef && yrStats[yrActiveRef] ? yrStats[yrActiveRef].avgGlobal : null;
    const delta = (avgLast != null && avgRef != null) ? avgLast - avgRef : 0;

    let bestArea = null, worstArea = null, maxDeltaArea = null;
    let maxAvg = -Infinity, minAvg = Infinity, maxDelta = -Infinity;

    TRAY_AREAS.forEach(a => {
      const lastVal = (data[a.key] && data[a.key][yrActiveLast]) ? data[a.key][yrActiveLast].avg : null;
      const refVal = (yrActiveRef && data[a.key] && data[a.key][yrActiveRef]) ? data[a.key][yrActiveRef].avg : null;
      if (lastVal != null && lastVal > 0) {
        if (lastVal > maxAvg) { maxAvg = lastVal; bestArea = a; }
        if (lastVal < minAvg) { minAvg = lastVal; worstArea = a; }
      }
      if (lastVal != null && lastVal > 0 && refVal != null && refVal > 0) {
        const d = lastVal - refVal;
        if (d > maxDelta) { maxDelta = d; maxDeltaArea = a; }
      }
    });

    const sdActive = (yrStats[yrActiveLast] && yrStats[yrActiveLast].sdMean > 0)
      ? yrStats[yrActiveLast].sdMean
      : (yrStats[2025] && yrStats[2025].sdMean > 0 ? yrStats[2025].sdMean : (yrStats[2024] ? yrStats[2024].sdMean : null));

    let semClass = 'green', semLabel = 'Alta Homogeneidad', semDesc = 'Excelente equidad de aprendizaje entre los estudiantes';
    if (sdActive != null) {
      if (sdActive < 8.5) {
        semClass = 'green';
        semLabel = 'Alta Homogeneidad (Equitativo)';
        semDesc = 'El aprendizaje es uniforme; la brecha entre los estudiantes es reducida.';
      } else if (sdActive <= 11.5) {
        semClass = 'yellow';
        semLabel = 'Dispersión Moderada (Estándar)';
        semDesc = 'Comportamiento típico nacional con variabilidad media entre los estudiantes.';
      } else {
        semClass = 'red';
        semLabel = 'Alta Dispersión (Brecha Crítica)';
        semDesc = 'Amplia distancia entre alumnos de alto rendimiento y rezagados.';
      }
    }

    const kpiBox = $('#trayKpis');
    if (kpiBox) {
      kpiBox.innerHTML = `
        <div class="tray-kpi" style="--kpi-c:#0284C7">
          <div class="label">Promedio Global (${yrActiveLast}${yrActiveLast === 2026 ? ' Registrado' : ' Oficial'})</div>
          <div class="value">${avgLast != null ? avgLast.toFixed(1) : '—'} <span style="font-size:0.9rem;font-weight:600;color:var(--muted)">pts</span></div>
          <div class="sub">
            <b style="color:${delta >= 0 ? '#047857' : '#BE123C'}">${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pts</b> ${badgeText}
          </div>
        </div>
        <div class="tray-kpi" style="--kpi-c:${semClass === 'green' ? '#10B981' : semClass === 'yellow' ? '#F59E0B' : '#FF3B69'}">
          <div class="label">Desviación Estándar (σ ${yrActiveLast})</div>
          <div class="value">${sdActive != null ? sdActive.toFixed(1) : '—'} <span style="font-size:0.9rem;font-weight:600;color:var(--muted)">pts</span></div>
          <div class="sub">
            <span class="semaphore ${semClass}">${semLabel}</span>
          </div>
        </div>
        <div class="tray-kpi" style="--kpi-c:#10B981">
          <div class="label">Área Fortaleza (${yrActiveLast})</div>
          <div class="value" style="font-size:1.35rem">${bestArea ? bestArea.name : '—'}</div>
          <div class="sub">Puntaje líder: <b>${maxAvg > -Infinity ? maxAvg.toFixed(1) : '—'} pts</b></div>
        </div>
        <div class="tray-kpi" style="--kpi-c:#FF3B69">
          <div class="label">Área de Oportunidad (${yrActiveLast})</div>
          <div class="value" style="font-size:1.35rem">${worstArea ? worstArea.name : '—'}</div>
          <div class="sub">Prioridad pedagógica: <b>${minAvg < Infinity ? minAvg.toFixed(1) : '—'} pts</b></div>
        </div>
      `;
    }

    // Gráfico 1: DIAGRAMA DE BARRAS DE PROMEDIOS POR ÁREA (Comparativo entre años)
    const areaLabels = [...TRAY_AREAS.map(a => a.name), 'Promedio Global'];
    const barColors = {
      2024: '#94A3B8',
      2025: '#0284C7',
      2026: '#FF3B69'
    };
    const barLabels = {
      2024: '2024 (Oficial)',
      2025: '2025 (Oficial)',
      2026: '2026 (✏️ Notas Registradas)'
    };

    const datasetsProm = years.map(yr => {
      const vals = TRAY_AREAS.map(a => {
        const item = data[a.key] && data[a.key][yr];
        return item && item.avg != null ? item.avg : 0;
      });
      vals.push(yrStats[yr].avgGlobal != null ? +yrStats[yr].avgGlobal.toFixed(1) : 0);
      return {
        label: barLabels[yr] || String(yr),
        data: vals,
        backgroundColor: barColors[yr] || '#182334',
        borderRadius: 5,
        borderWidth: 0
      };
    });

    G.bars('chTrayPromedios', areaLabels, datasetsProm, {
      min: 0,
      extra: {
        scales: {
          y: { min: 0, max: 100, ticks: { stepSize: 20 } }
        }
      }
    });

    // Gráfico 2: DIAGRAMA DE BARRAS DE DESVIACIÓN ESTÁNDAR (σ)
    const sdAreaLabels = [...TRAY_AREAS.map(a => a.name), 'σ Promedio'];
    const datasetsSd = years.map(yr => {
      const vals = TRAY_AREAS.map(a => {
        const item = data[a.key] && data[a.key][yr];
        return item && item.sd != null ? item.sd : 0;
      });
      vals.push(yrStats[yr].sdMean != null ? +yrStats[yr].sdMean.toFixed(1) : 0);
      return {
        label: (barLabels[yr] || String(yr)) + ' (σ)',
        data: vals,
        backgroundColor: G.alpha(barColors[yr] || '#182334', 0.8),
        borderRadius: 5,
        borderWidth: 0
      };
    });

    G.bars('chTrayDesviacion', sdAreaLabels, datasetsSd, {
      min: 0,
      extra: {
        scales: {
          y: { min: 0, max: 25, ticks: { stepSize: 5 } }
        }
      }
    });

    // Gráfico 3: RADAR DE EQUILIBRIO CURRICULAR
    const radarLabels = TRAY_AREAS.map(a => a.name);
    const radarDatasets = [];

    if (years.includes(2024)) {
      radarDatasets.push({
        label: '2024 Oficial',
        data: TRAY_AREAS.map(a => (data[a.key] && data[a.key][2024] && data[a.key][2024].avg > 0) ? data[a.key][2024].avg : 50),
        borderColor: '#94A3B8',
        backgroundColor: G.alpha('#94A3B8', 0.12),
        borderDash: [4, 4],
        pointBackgroundColor: '#94A3B8',
        borderWidth: 2
      });
    }

    if (years.includes(2025)) {
      radarDatasets.push({
        label: '2025 Oficial',
        data: TRAY_AREAS.map(a => (data[a.key] && data[a.key][2025] && data[a.key][2025].avg > 0) ? data[a.key][2025].avg : 50),
        borderColor: '#0284C7',
        backgroundColor: G.alpha('#0284C7', 0.18),
        pointBackgroundColor: '#0284C7',
        borderWidth: 2.2
      });
    }

    if (years.includes(2026)) {
      const hasVal2026 = TRAY_AREAS.some(a => data[a.key] && data[a.key][2026] && data[a.key][2026].avg > 0);
      if (hasVal2026) {
        radarDatasets.push({
          label: '2026 Registrado',
          data: TRAY_AREAS.map(a => (data[a.key] && data[a.key][2026] && data[a.key][2026].avg > 0) ? data[a.key][2026].avg : 50),
          borderColor: '#FF3B69',
          backgroundColor: G.alpha('#FF3B69', 0.22),
          pointBackgroundColor: '#FF3B69',
          borderWidth: 2.5
        });
      }
    }

    G.draw('chTrayRadar', {
      type: 'radar',
      data: { labels: radarLabels, datasets: radarDatasets },
      options: {
        scales: {
          r: {
            min: 30, max: 90,
            angleLines: { color: 'rgba(24,35,52,0.08)' },
            grid: { color: 'rgba(24,35,52,0.06)' },
            pointLabels: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 700 }, color: '#182334' },
            ticks: { stepSize: 15, backdropColor: 'transparent', font: { size: 10 } }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { weight: 600 } } }
        }
      }
    });

    const quickDiag = $('#trayQuickDiagnosis');
    if (quickDiag) {
      let diagProgText = '';
      if (years.length === 1) {
        diagProgText = `La institución registra una media global oficial de <b>${(yrStats[2024]?.avgGlobal ?? 0).toFixed(1)} puntos</b> en el periodo 2024.`;
      } else if (years.length === 2) {
        diagProgText = `La institución transitó de <b>${(yrStats[2024]?.avgGlobal ?? 0).toFixed(1)} pts</b> en 2024 a <b>${(yrStats[2025]?.avgGlobal ?? 0).toFixed(1)} pts</b> en 2025 (variación neta de <b>${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pts</b>).`;
      } else {
        diagProgText = `La institución registró <b>${(yrStats[2024]?.avgGlobal ?? 0).toFixed(1)} pts</b> en 2024 y <b>${(yrStats[2025]?.avgGlobal ?? 0).toFixed(1)} pts</b> en 2025${has2026 ? `, alcanzando en 2026 una media registrada de <b>${(yrStats[2026]?.avgGlobal ?? 0).toFixed(1)} pts</b> (variación de <b>${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pts</b> vs 2025)` : '. Ingresa tus notas de 2026 en la tabla superior y pulsa "⚡ Actualizar y Simular Diagnóstico" para calcular el diagnóstico en tiempo real'}.`;
      }

      quickDiag.innerHTML = `
        <div class="card-head">
          <h3>Lectura Dinámica de Balance</h3>
          <p>Síntesis del comportamiento institucional (${years.join(' – ')}${has2026 ? ' (Evaluación Actual)' : ''})</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
          <div class="diagnostic-box highlight">
            <h5>📈 Progresión Global</h5>
            <p>${diagProgText}</p>
          </div>
          <div class="diagnostic-box ${semClass === 'red' ? 'warning' : ''}">
            <h5>⚖️ Diagnóstico de Equidad Formativa</h5>
            <p>${semDesc}</p>
          </div>
          <div class="diagnostic-box">
            <h5>🎯 Área de Mayor Crecimiento</h5>
            <p>${maxDeltaArea ? `El área con mejor evolución relativa fue <b>${maxDeltaArea.name}</b> con una variación de <b>${maxDelta >= 0 ? '+' : ''}${maxDelta.toFixed(1)} puntos</b>.` : 'Registra datos para calcular la evolución de las áreas.'}</p>
          </div>
        </div>
      `;
    }

    renderTrayReport(x, {
      years,
      yrFirst: years[0],
      yrLast: yrActiveLast,
      has2026,
      avgFirst: yrStats[years[0]] ? yrStats[years[0]].avgGlobal : null,
      avgLast,
      deltaGlobal: delta,
      sdLast: sdActive,
      semClass, semLabel, semDesc,
      bestArea, worstArea, maxDeltaArea, maxDelta, yrStats, data
    });
  }

  function renderTrayReport(x, info) {
    const reportBox = $('#trayReportCard');
    if (!reportBox) return;

    const targetMap = {
      'D':  { next: 'C',  targetScore: '48 - 52', priority: 'Nivelación en comprensión lectora básica y operaciones matemáticas esenciales.' },
      'C':  { next: 'B',  targetScore: '55 - 60', priority: 'Fortalecer el paso de lectura literal a inferencial y razonamiento cuantitativo contextualizado.' },
      'B':  { next: 'A',  targetScore: '63 - 68', priority: 'Argumentación crítica, modelación matemática y análisis científico experimental.' },
      'A':  { next: 'A+', targetScore: '73 - 78', priority: 'Consolidación de competencias de nivel superior y cierre de la dispersión bajo 8 puntos.' },
      'A+': { next: 'A+ (Consolidación Top 1%)', targetScore: '78+', priority: 'Sostenibilidad de la excelencia académica, bilingüismo avanzado y formación integral.' },
      'NC': { next: 'Clasificación Oficial', targetScore: '55+', priority: 'Asegurar participación completa de la cohorte y estandarizar pruebas internas.' }
    };
    const nextGoal = targetMap[x.c] || targetMap['B'];

    const prevYr = info.yrLast === 2026 ? 2025 : (info.yrLast === 2025 ? 2024 : null);
    const baseYr = info.yrFirst;

    reportBox.innerHTML = `
      <div class="report-header">
        <div>
          <h3>Informe Analítico de Diagnóstico & Plan de Mejora Institucional (${info.yrFirst} – ${info.yrLast})</h3>
          <p>Institución: <b>${esc(x.n)}</b> · Código DANE: <b>${x.d}</b> · Categoría Actual: <b style="color:${CLAS_COLOR[x.c]}">${x.c}</b> · Base: <b>${info.has2026 ? 'Oficial ICFES (2024–2025) + Notas Registradas 2026' : 'Oficial ICFES 2024–2025'}</b></p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="document.body.classList.add('printing-report');window.print();setTimeout(()=>document.body.classList.remove('printing-report'),1000);">
          🖨️ Imprimir / Guardar Informe PDF
        </button>
      </div>

      <!-- SECCIÓN 1: LECTURA DE TENDENCIAS -->
      <div class="report-section">
        <h4>1. Diagnóstico Cuantitativo y Tendencias (${info.yrFirst} – ${info.yrLast})</h4>
        <div class="report-grid-2">
          <div class="diagnostic-box">
            <h5>📊 Balance de Rendimiento Académico</h5>
            <ul>
              <li><b>Rendimiento Inicial vs ${info.has2026 ? 'Notas Actuales' : 'Cierre'}:</b> En ${info.yrFirst}, la institución registró una media de <b>${info.avgFirst != null ? info.avgFirst.toFixed(1) : '—'} pts</b>, situándose en ${info.yrLast} en <b>${info.avgLast != null ? info.avgLast.toFixed(1) : '—'} pts</b> (variación neta de <b>${info.deltaGlobal >= 0 ? '+' : ''}${info.deltaGlobal.toFixed(1)} pts</b>).</li>
              <li><b>Fortaleza Institucional (${info.yrLast}):</b> El área con puntaje más alto es <b>${info.bestArea ? info.bestArea.name : '—'}</b> (${(info.data[info.bestArea?.key]?.[info.yrLast]?.avg ?? 0).toFixed(1)} pts), sirviendo como motor pedagógico para transferir buenas prácticas a otras áreas.</li>
              <li><b>Área Prioritaria de Refuerzo (${info.yrLast}):</b> El área con menor desempeño relativo corresponde a <b>${info.worstArea ? info.worstArea.name : '—'}</b> (${(info.data[info.worstArea?.key]?.[info.yrLast]?.avg ?? 0).toFixed(1)} pts), la cual representa la mayor palanca de crecimiento para elevar el índice global.</li>
            </ul>
          </div>
          <div class="diagnostic-box">
            <h5>🎯 Dinámica Interanual por Área</h5>
            <ul>
              ${TRAY_AREAS.map(a => {
                const l = info.data[a.key]?.[info.yrLast]?.avg;
                const pVal = prevYr ? info.data[a.key]?.[prevYr]?.avg : null;
                const dPrev = (pVal != null && l != null && pVal > 0 && l > 0) ? l - pVal : null;
                const bVal = (baseYr && baseYr !== prevYr) ? info.data[a.key]?.[baseYr]?.avg : null;
                const dBase = (bVal != null && l != null && bVal > 0 && l > 0) ? l - bVal : null;

                let cmpText = '';
                if (dPrev != null) {
                  cmpText = ` (${dPrev >= 0 ? '+' : ''}${dPrev.toFixed(1)} pts vs ${prevYr}`;
                  if (dBase != null && prevYr !== baseYr) {
                    cmpText += ` · ${dBase >= 0 ? '+' : ''}${dBase.toFixed(1)} pts acumulado vs ${baseYr}`;
                  }
                  cmpText += ')';
                } else if (info.yrLast === 2024) {
                  cmpText = ` (Línea base oficial 2024)`;
                }
                return `<li><b>${a.name}:</b> ${l != null && l > 0 ? l.toFixed(1) + ' pts' : '—'}${cmpText}.</li>`;
              }).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: LECTURA DE LA DESVIACIÓN ESTÁNDAR -->
      <div class="report-section">
        <h4>2. Análisis de Dispersión y Equidad Académica (Lectura de la Desviación Estándar)</h4>
        <div class="diagnostic-box ${info.semClass === 'red' ? 'warning' : 'highlight'}">
          <h5>⚖️ ¿Por qué la Desviación Estándar (σ) es Vital en la Clasificación ICFES?</h5>
          <p>
            En la metodología oficial del ICFES para clasificar colegios (A+, A, B, C, D), <b>el promedio por sí solo no garantiza la categoría</b>. El algoritmo penaliza fuertemente a los planteles con alta dispersión interna:
          </p>
          <ul style="margin-top:8px">
            <li><b>Estado actual de la institución (${info.yrLast}):</b> La desviación estándar promedio se sitúa en <b>${info.sdLast != null ? info.sdLast.toFixed(1) : '—'} puntos</b> (<span class="semaphore ${info.semClass}">${info.semLabel}</span>).</li>
            <li><b>Implicación formativa:</b> ${info.semClass === 'green' ? 'Existe una excelente consistencia curricular: el grueso del estudiantado asimila los aprendizajes de manera articulada, lo que eleva el percentil institucional en el cálculo del ICFES.' : info.semClass === 'yellow' ? 'Se evidencia una variabilidad normal en el grupo, pero reducir la desviación por debajo de 9 puntos otorgaría un impulso matemático directo para ascender de clasificación.' : 'Existe una brecha crítica: mientras un grupo selecto de estudiantes logra puntajes altos, otro grupo significativo queda rezagado en niveles 1 y 2 de desempeño. Esta disparidad impide a la institución alcanzar categorías superiores independientemente del puntaje de los mejores alumnos.'}</li>
          </ul>
        </div>
      </div>

      <!-- SECCIÓN 3: PLAN DE ACCIÓN Y METODOLOGÍAS PEDAGÓGICAS OFICIALES -->
      <div class="report-section">
        <h4>3. Plan Estratégico de Acción & Plan de Mejora Institucional (Grupo Edúcate Colombia)</h4>
        <div style="background:#F1F5F9;border-radius:12px;padding:14px 18px;margin-bottom:14px;border-left:4px solid var(--primary)">
          <div style="font-size:0.88rem;color:var(--navy);font-weight:700">🎯 Meta Estratégica Proyectada: Subir a Categoría <span style="color:var(--accent-rose)">${nextGoal.next}</span> (Puntaje Objetivo: ${nextGoal.targetScore} puntos)</div>
          <div style="font-size:0.83rem;color:var(--muted);margin-top:3px">${nextGoal.priority}</div>
        </div>

        <!-- RUTA METODOLÓGICA EXCLUSIVA PARA EL ÁREA MÁS BAJA -->
        <div class="rutas-container">
          <div class="rutas-header">
            <h5>🎯 Plan de Refuerzo en el Área con Menor Desempeño: <span style="color:var(--accent-rose)">${info.worstArea ? info.worstArea.name : 'Matemáticas'}</span></h5>
            <span style="font-size:0.80rem;color:var(--muted)">Ruta metodológica en 4 fases establecida por Grupo Edúcate Colombia</span>
          </div>
          ${renderRutaAreaHtml(info.worstArea?.key || 'mat')}
        </div>

        <!-- PLAN DE EQUIDAD Y CIERRE DE DISPERSIÓN -->
        <div class="action-cards" style="margin-top:16px">
          <div class="action-card" style="grid-column: 1 / -1; background:#FFF1F2; border-color:#FECDD3">
            <span class="badge-mini" style="background:#FF3B69">Plan de Equidad Institucional (Reducir Desviación Estándar σ)</span>
            <h5>Focalización en Estudiantes de Niveles 1 y 2</h5>
            <p>
              El algoritmo del ICFES penaliza a colegios con alta dispersión interna aunque tengan estudiantes destacados. La clave para escalar de categoría (B ➔ A ➔ A+) consiste en reducir σ por debajo de 8.5 puntos mediante:
            </p>
            <ul>
              <li><b>Tutorías de Nivelación Temprana:</b> Identificar a los estudiantes con desempeños inferiores en simulacros diagnósticos para nivelar los Procesos Operativos (PO-01 y PO-02).</li>
              <li><b>Análisis Sistemático del Error:</b> Utilizar las preguntas erradas no como sanción cuantitativa sino como objeto de modelación reflexiva en el aula.</li>
              <li><b>Evaluación Formativa por Fases:</b> Calificar la aplicación del método (deconstrucción, modelación, cálculo y validación) y no únicamente la respuesta final marcada.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- MODO "MI COLEGIO" (DANE O NOMBRE) ----------
  function enterSchool(x, silent) {
    if (!x) return false;
    state.locked = x.d;
    state.fichaId = x.id;
    state.trayectoriaSchoolId = x.id;
    document.body.classList.add('locked');
    $('#modeBanner').classList.remove('hidden');
    const nom = x.n.split(' - ')[0];
    $('#modeColegioNombre').textContent = nom;
    $('#modeDane').textContent = x.d;
    $('#daneInput').value = nom;
    if (location.hash !== '#dane=' + x.d) history.replaceState(null, '', '#dane=' + x.d);
    if (state.tab === 'trayectoria') renderTrayectoria();
    else setTab('ficha');
    return true;
  }

  function enterLocked(query, silent) {
    query = String(query ?? '').trim();
    if (!query) return false;
    const cleanNum = query.replace(/\D/g, '');
    let main = null;
    if (cleanNum.length >= 8) {
      main = DATA.find(x => x.d === cleanNum && x.t === 'Establecimiento') || DATA.find(x => x.d === cleanNum);
    }
    if (!main) {
      const results = searchColegios(query, 5);
      if (results.length) main = results[0];
    }
    if (!main) {
      if (!silent) alert(`No se encontró ningún colegio con "${query}".\nPuedes buscar por el nombre de la institución o por su código DANE (12 dígitos).`);
      return false;
    }
    return enterSchool(main, silent);
  }

  function exitLocked() {
    state.locked = null;
    document.body.classList.remove('locked');
    $('#modeBanner').classList.add('hidden');
    $('#daneInput').value = '';
    history.replaceState(null, '', location.pathname + location.search);
    setTab('panorama');
  }

  // ---------- DATOS (modal) ----------
  function initModal() {
    const modal = $('#modalDatos'), status = $('#modalStatus');
    $('#btnDatos').onclick = () => { status.textContent = ''; modal.classList.remove('hidden'); };
    $('#modalClose').onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };

    $('#fileICFES').onchange = async e => {
      const file = e.target.files[0]; if (!file) return;
      status.textContent = 'Procesando archivo…';
      try {
        const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const raw = SaberParser.parseWorkbook(XLSX, wb);
        if (!raw.colegios.length) throw new Error('El archivo no contiene colegios.');
        try { localStorage.setItem('icfes_data', JSON.stringify(raw)); } catch (err) { status.textContent = 'Aviso: los datos se usarán solo en esta sesión (muy grandes para guardar).'; }
        load(raw);
        status.textContent = `✔ ${nf(raw.colegios.length)} colegios cargados (periodo ${raw.periodo || 'desconocido'}).`;
      } catch (err) { status.textContent = '✖ Error: ' + err.message; }
      e.target.value = '';
    };

    $('#fileEducate').onchange = async e => {
      const file = e.target.files[0]; if (!file) return;
      try {
        let text = '';
        if (/\.(xlsx?|xls)$/i.test(file.name)) {
          const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
          wb.SheetNames.forEach(n => { text += XLSX.utils.sheet_to_csv(wb.Sheets[n]) + '\n'; });
        } else text = await file.text();
        const codes = [...new Set((text.match(/\b\d{12}\b/g) || []))];
        if (!codes.length) throw new Error('No se encontraron códigos DANE de 12 dígitos.');
        localStorage.setItem('educate_dane', JSON.stringify(codes));
        applyEducate(); render();
        const found = new Set(DATA.filter(x => x.edu).map(x => x.d)).size;
        status.textContent = `✔ ${nf(codes.length)} códigos cargados · ${nf(found)} encontrados en la clasificación.`;
      } catch (err) { status.textContent = '✖ ' + err.message; }
      e.target.value = '';
    };

    $('#fileResultados').onchange = async e => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: true, defval: null });
        const res = SaberParser.parseResultados(rows, '2026', file.name);
        const n = Object.keys(res.colegios).length;
        if (!n) throw new Error('No se encontraron filas con código DANE.');
        localStorage.setItem('resultados_area', JSON.stringify(res));
        render();
        status.textContent = `✔ Resultados por área cargados para ${nf(n)} colegios${res.nacional ? ' (con promedio nacional)' : ''}.`;
      } catch (err) { status.textContent = '✖ ' + err.message; }
      e.target.value = '';
    };

    $('#btnRestablecer').onclick = () => {
      localStorage.removeItem('icfes_data');
      localStorage.removeItem('educate_dane');
      localStorage.removeItem('resultados_area');
      load(window.DATOS_SABER);
      status.textContent = '✔ Datos originales restablecidos.';
    };
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, { position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 300, padding: '12px 22px', borderRadius: '12px', background: 'linear-gradient(135deg,#182334,#0284C7)', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-text)', boxShadow: '0 10px 30px rgba(15,23,42,.35)', border: '1px solid rgba(255,255,255,0.15)' });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ---------- Carga ----------
  function load(raw) {
    prepare(raw);
    state.cmp = []; state.fichaId = null;
    const pl = $('#headerSub') || $('#periodoLabel');
    if (pl) pl.textContent = `Grado 11 · ${nf(DATA.length)} planteles clasificados`;
    $('#footInfo').textContent = `Periodo ${PERIODO}. Datos procesados el ${raw.generado || ''}. "S/C": sin clasificación por resolución ICFES.`;
    initFilters();
    render();
  }

  function init() {
    let raw = window.DATOS_SABER;
    try { const saved = localStorage.getItem('icfes_data'); if (saved) raw = JSON.parse(saved); } catch (e) { /* usar originales */ }
    if (!raw) { $('#loader p').textContent = 'No se encontraron datos (data/datos.js).'; return; }

    initExplorer();
    initModal();
    load(raw);

    $$('.tab').forEach(t => t.onclick = () => setTab(t.dataset.tab));
    const pPills = $('#periodoPills');
    if (pPills) {
      pPills.onclick = e => {
        const btn = e.target.closest('.pill-btn');
        if (btn && btn.dataset.periodo) switchYear(btn.dataset.periodo);
      };
    }
    $$('[data-go]').forEach(a => a.onclick = e => { e.preventDefault(); if (!state.locked) setTab(a.dataset.go); });
    $('#top10').onclick = e => { const it = e.target.closest('[data-id]'); if (it) openFicha(+it.dataset.id); };
    $('#daneForm').onsubmit = e => { e.preventDefault(); const v = $('#daneInput').value.trim(); if (v) enterLocked(v); };
    const btnTopSearch = $('#btnTopSearch');
    if (btnTopSearch) btnTopSearch.onclick = () => { const v = $('#daneInput').value.trim(); if (v) enterLocked(v); };
    autocomplete($('#daneInput'), $('#topSearchAC'), x => { enterSchool(x); });
    autocomplete($('#trayectoriaSearch'), $('#trayectoriaAC'), x => { state.trayectoriaSchoolId = x.id; state.fichaId = x.id; renderTrayectoria(); });
    const btnBannerTray = $('#btnBannerTrayectoria');
    if (btnBannerTray) btnBannerTray.onclick = () => { state.trayectoriaSchoolId = state.fichaId; setTab('trayectoria'); };
    $('#btnSalir').onclick = exitLocked;
    $('#btnOpenFilters').onclick = () => document.body.classList.add('filters-open');
    $('#btnCloseFilters').onclick = () => document.body.classList.remove('filters-open');
    $('#backdrop').onclick = () => document.body.classList.remove('filters-open');
    autocomplete($('#fichaSearch'), $('#fichaAC'), x => { state.fichaId = x.id; renderFicha(); });
    autocomplete($('#cmpSearch'), $('#cmpAC'), x => { addCmp(x); renderComparador(); });

    const m = location.hash.match(/dane=(\d+)/);
    if (m) enterLocked(m[1], false);
    window.addEventListener('hashchange', () => {
      const h = location.hash.match(/dane=(\d+)/);
      if (h && h[1] !== state.locked) enterLocked(h[1]);
    });

    $('#loader').classList.add('done');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
