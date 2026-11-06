const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
global.window = global;
require(path.join(projectRoot, 'data/evidenciasDCE.js'));
const dce = global.EVIDENCIAS_DCE['308758002793'];

const htmlPath = path.join(projectRoot, 'presentacion_sagrada_sabiduria.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// =========================================================================
// 1. UPDATE SLIDE 2: Triennial Benchmark Table & Cohesion
// =========================================================================
const slide2OldTableStart = '<div class="card" style="margin-top: 18px;">';
const slide2End = '</section>\n\n    <!-- ==========================================\n         DIAPOSITIVA 3: DESEMPEÑO POR ÁREAS';

const slide2NewContent = `
      <!-- Tabla Comparativa Trienal Oficial (Fase 1: Benchmark Institucional) -->
      <div class="card" style="margin-top: 18px;">
        <div class="card-head">
          <div>
            <h3>Tabla Oficial de Resultados Trienales ICFES Saber 11° (Fase 1: Benchmark Institucional)</h3>
            <p>Evolución frente al Grupo de Comparación (GC 3), ETC Soledad y Promedio Colombia</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Periodo ICFES</th>
                <th style="text-align:center">Evaluados</th>
                <th style="text-align:center">Global Colegio</th>
                <th style="text-align:center">Dispersión (&sigma;)</th>
                <th style="text-align:center">Grupo Comp. (GC 3)</th>
                <th style="text-align:center">ETC Soledad</th>
                <th style="text-align:center">Colombia</th>
                <th style="text-align:center">Brecha vs GC 3</th>
                <th style="text-align:center">Brecha vs Soledad</th>
                <th style="text-align:center">Brecha vs Colombia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>2024-3</strong></td>
                <td style="text-align:center">43 alumnos</td>
                <td style="text-align:center"><strong style="color: var(--primary);">307 pts</strong></td>
                <td style="text-align:center">&sigma; = 49 pts</td>
                <td style="text-align:center">268 pts</td>
                <td style="text-align:center">257 pts</td>
                <td style="text-align:center">260 pts</td>
                <td style="text-align:center;font-weight:800;color:#0284C7">+39 pts</td>
                <td style="text-align:center;font-weight:800;color:#10B981">+50 pts</td>
                <td style="text-align:center;font-weight:800;color:#059669">+47 pts</td>
              </tr>
              <tr>
                <td><strong>2025-3</strong></td>
                <td style="text-align:center">41 alumnos</td>
                <td style="text-align:center"><strong style="color: var(--yellow);">303 pts</strong></td>
                <td style="text-align:center">&sigma; = 43 pts</td>
                <td style="text-align:center">265 pts</td>
                <td style="text-align:center">257 pts</td>
                <td style="text-align:center">261 pts</td>
                <td style="text-align:center;font-weight:800;color:#0284C7">+38 pts</td>
                <td style="text-align:center;font-weight:800;color:#10B981">+46 pts</td>
                <td style="text-align:center;font-weight:800;color:#059669">+42 pts</td>
              </tr>
              <tr class="row-highlight">
                <td><strong>2026-3 (Actual)</strong> <span style="background:var(--accent-rose);color:#fff;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:800;margin-left:4px">RÉCORD</span></td>
                <td style="text-align:center;font-weight:700">23 alumnos</td>
                <td style="text-align:center"><strong style="color: var(--emerald); font-size: 1.05rem;">309 pts</strong></td>
                <td style="text-align:center"><span style="background:#D1FAE5;color:#047857;padding:3px 8px;border-radius:6px;font-weight:800">&sigma; = 41 pts</span></td>
                <td style="text-align:center;font-weight:700">266 pts</td>
                <td style="text-align:center">254 pts</td>
                <td style="text-align:center">258 pts</td>
                <td style="text-align:center;font-weight:800;color:#0284C7;font-size:0.95rem">+43 pts</td>
                <td style="text-align:center;font-weight:800;color:#10B981;font-size:0.95rem">+55 pts</td>
                <td style="text-align:center;font-weight:800;color:#059669;font-size:0.95rem">+51 pts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tarjetas de Diagnóstico Macro Fase 1 -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:14px; margin-top:16px;">
          <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:12px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px;">
            <span style="font-size:1.6rem;">🛡️</span>
            <div>
              <strong style="color:#1E3A8A; font-size:0.9rem;">Ventaja Competitiva Territorial en Expansión</strong>
              <p style="font-size:0.83rem; color:#1E3A8A; line-height:1.45; margin-top:3px;">
                La brecha frente a Soledad creció de <strong>+50 pts en 2024</strong> a <strong>+55 pts en 2026</strong>. Frente a su grupo de comparación socioeconómico (GC 3), el colegio saca una ventaja de <strong>+43 pts</strong>, confirmando su liderazgo académico en la región.
              </p>
            </div>
          </div>
          <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px;">
            <span style="font-size:1.6rem;">📈</span>
            <div>
              <strong style="color:#065F46; font-size:0.9rem;">Consolidación de la Cohesión Escolar (&sigma;)</strong>
              <p style="font-size:0.83rem; color:#065F46; line-height:1.45; margin-top:3px;">
                La desviación estándar se redujo en 8 puntos (<strong>&sigma; = 49 &rarr; 43 &rarr; 41 pts</strong>). Esto certifica que la cohorte avanzó en bloque compacto, reduciendo al mínimo la desigualdad interna de aprendizajes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

const idxTable = html.indexOf(slide2OldTableStart);
const idxSlide2End = html.indexOf(slide2End);
if (idxTable !== -1 && idxSlide2End !== -1) {
  html = html.slice(0, idxTable) + slide2NewContent + html.slice(idxSlide2End + '</section>'.length);
  console.log('Slide 2 updated successfully');
} else {
  console.error('Slide 2 markers not found');
}

// =========================================================================
// 2. UPDATE SLIDE 4: Clarification Banner & English Bar
// =========================================================================
const slide4Start = '<section class="slide-page" id="slide-4">';
const slide4GridStart = '<div class="grid-2">';

const bannerHTML = `
      <!-- Aclaración Pedagógica Oficial: Escala 4 Niveles vs MCER Inglés -->
      <div class="mcer-clarification-banner">
        <div class="clarification-badge">💡 Aclaración Pedagógica Oficial ICFES</div>
        <h4>¿Por qué Inglés registra un 4% en el nivel inferior (A-)?</h4>
        <p>
          <strong>1. Las 4 Áreas Académicas Fundamentales (Matemáticas, Lectura, Ciencias y Sociales)</strong> se miden en la escala oficial de 4 Niveles (Nivel 1 al 4). En estas 4 pruebas, el Colegio Sagrada Sabiduría logró <strong>0.0% de Rezago (Cero alumnos en Nivel 1)</strong>: ¡El 100% de la promoción superó el nivel insuficiente, mientras en Colombia hasta el 19% queda rezagado!
        </p>
        <p>
          <strong>2. La Prueba de Inglés</strong> se rige internacionalmente por el <strong>Marco Común Europeo (MCER)</strong> en 5 niveles (A-, A1, A2, B1, B+). El <strong>4% en A- corresponde a un único (1) estudiante</strong> de 23 evaluados en nivel principiante. En contraste, <strong>el 61% de la promoción (14 de 23 estudiantes) egresó con nivel Bilingüe Independiente (B1 y B+)</strong>, superando por +17 puntos el promedio nacional.
        </p>
      </div>
`;

if (!html.includes('mcer-clarification-banner')) {
  const posGrid = html.indexOf(slide4GridStart, html.indexOf(slide4Start));
  if (posGrid !== -1) {
    html = html.slice(0, posGrid) + bannerHTML + '\n      ' + html.slice(posGrid);
    console.log('Slide 4 clarification banner added');
  }
}

// Update English bar segment in Slide 4 to softer badge
html = html.replace(
  '<div class="bar-seg bg-aminus" style="width: 4%;" title="A- (Pre-A1): Solo 1 estudiante de 23">4% A-</div>',
  '<div class="bar-seg" style="width: 4%; background:#94A3B8;" title="A- (Principiante): Solo 1 estudiante de 23">4% A-</div>'
);

// =========================================================================
// 3. UPDATE SLIDE 5: Full FASE 2 DCE Interactive View
// =========================================================================
const slide5OldStart = '<section class="slide-page" id="slide-5">';
const slide5OldEnd = '</section>\n\n    <!-- ==========================================\n         DIAPOSITIVA 6: ESTRATEGIA Y RETO 2027';

const slide5NewHTML = `    <section class="slide-page" id="slide-5">
      <div class="card" style="margin-bottom:18px;">
        <div class="card-head">
          <div>
            <h2>🔬 FASE 2: Radiografía por Áreas DCE y Tareas de Aula para Grado 10°</h2>
            <p>Diseño Centrado en Evidencias oficial del ICFES: Afirmaciones, Evidencias evaluadas, Semáforo de Error y Tareas Concretas para 10° (Meta 2027)</p>
          </div>
        </div>
        <p style="font-size: 0.88rem; color: var(--muted); margin-bottom: 4px;">
          Selecciona una de las <strong>5 áreas evaluadas</strong> para auditar sus Afirmaciones oficiales, el porcentaje de respuestas incorrectas frente a Soledad y Colombia, y la <strong>Tarea Pedagógica de Aula inmediata para Grado 10°</strong> (clave para consolidar la meta institucional hacia 2027 sin sobrecargar a los docentes).
        </p>
      </div>

      <!-- Pestañas de Selección de Área DCE (Las 5 Áreas Oficiales) -->
      <div class="dce-pills-bar" id="dcePillsBar">
        <button class="dce-area-btn active" data-dce="mat">📐 Matemáticas <span class="dce-btn-score">59 pts</span></button>
        <button class="dce-area-btn" data-dce="lec">📖 Lectura Crítica <span class="dce-btn-score">64 pts</span></button>
        <button class="dce-area-btn" data-dce="nat">🔬 Ciencias Naturales <span class="dce-btn-score">62 pts</span></button>
        <button class="dce-area-btn" data-dce="soc">🏛️ Sociales y Ciudadanas <span class="dce-btn-score">60 pts</span></button>
        <button class="dce-area-btn" data-dce="ing">🇬🇧 Inglés (MCER) <span class="dce-btn-score">69 pts</span></button>
      </div>

      <!-- Ficha Resumen Dinámica del Área DCE -->
      <div class="dce-summary-box" id="dceSummaryBox">
        <div class="dce-summary-left">
          <h3 id="dceSummaryTitle">📐 Matemáticas · Desempeño y Oportunidad 2027</h3>
          <p id="dceSummaryDiag">
            Área de máxima oportunidad de crecimiento institucional hacia 2027. Aunque supera al promedio nacional (52) y a la ETC Soledad (51), la concentración de respuestas en alerta naranja ofrece la palanca perfecta para ganar entre 8 y 12 puntos globales adicionales.
          </p>
        </div>
        <div class="dce-summary-metrics">
          <div class="dce-stat-card">
            <div class="lbl">Promedio 2026</div>
            <div class="val" id="dceStatScore" style="color:#0284C7;">59 pts</div>
          </div>
          <div class="dce-stat-card">
            <div class="lbl">Dispersión</div>
            <div class="val" id="dceStatSigma">&sigma; = 11</div>
          </div>
          <div class="dce-stat-card">
            <div class="lbl">vs Colombia</div>
            <div class="val" id="dceStatCol" style="color:#10B981;">+7 pts</div>
          </div>
          <div class="dce-stat-card">
            <div class="lbl">vs Soledad</div>
            <div class="val" id="dceStatSol" style="color:#10B981;">+8 pts</div>
          </div>
        </div>
      </div>

      <!-- Convenciones del Semáforo -->
      <div class="dce-legend-bar">
        <span style="color:var(--navy); font-weight:800;">Semáforo Oficial de Error ICFES:</span>
        <span>🟢 Fortaleza (&le; 25% error)</span>
        <span>🟡 En Consolidación (26% – 40% error)</span>
        <span>🟠 Alerta Prioritaria (&gt; 40% error)</span>
      </div>

      <!-- Contenedor Dinámico de Evidencias y Tareas de Aula -->
      <div class="dce-cards-grid" id="dceCardsGrid">
        <!-- Renderizado por JavaScript -->
      </div>
    </section>
`;

const idxS5Start = html.indexOf(slide5OldStart);
const idxS5End = html.indexOf(slide5OldEnd);
if (idxS5Start !== -1 && idxS5End !== -1) {
  html = html.slice(0, idxS5Start) + slide5NewHTML + html.slice(idxS5End + '</section>'.length);
  console.log('Slide 5 replaced with Fase 2 DCE');
} else {
  console.error('Slide 5 markers not found');
}

// =========================================================================
// 4. UPDATE JAVASCRIPT: DCE Logic, Interactive Area Filters, Smooth Navigation
// =========================================================================
const oldScriptStart = '// ===== RENDERIZADO DE GRÁFICOS CHART.JS =====';
const newScriptPart = `
    // ===== BASE DE DATOS DCE Y TAREAS DE AULA GRADO 10° =====
    const DCE_SAGRADA = ${JSON.stringify(dce.fase2, null, 2)};

    let currentDceArea = 'mat';

    function renderDCE(areaKey) {
      currentDceArea = areaKey;
      const data = DCE_SAGRADA[areaKey] || DCE_SAGRADA['mat'];

      // Botones activos
      document.querySelectorAll('.dce-area-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.dce === areaKey);
      });

      // Actualizar Ficha Resumen
      const titleEl = document.getElementById('dceSummaryTitle');
      const diagEl = document.getElementById('dceSummaryDiag');
      const scoreEl = document.getElementById('dceStatScore');
      const sigmaEl = document.getElementById('dceStatSigma');
      const colEl = document.getElementById('dceStatCol');
      const solEl = document.getElementById('dceStatSol');

      if (titleEl) titleEl.innerHTML = \`\${data.icono} \${data.nombre} (\${data.promedio2026} pts)\`;
      if (diagEl) diagEl.textContent = data.diagnosticoArea;
      if (scoreEl) {
        scoreEl.textContent = \`\${data.promedio2026} pts\`;
        scoreEl.style.color = data.color;
      }
      if (sigmaEl) sigmaEl.innerHTML = \`&sigma; = \${data.desv2026} pts\`;
      if (colEl) {
        const diffCol = data.promedio2026 - data.comparativo.col;
        colEl.textContent = (diffCol >= 0 ? '+' : '') + diffCol + ' pts';
      }
      if (solEl) {
        const diffSol = data.promedio2026 - data.comparativo.etc;
        solEl.textContent = (diffSol >= 0 ? '+' : '') + diffSol + ' pts';
      }

      // Renderizar Evidencias y Tareas
      const grid = document.getElementById('dceCardsGrid');
      if (!grid) return;

      grid.innerHTML = data.evidencias.map((ev, idx) => {
        const semClass = ev.color; // verde, amarillo, naranja
        const semLabel = semClass === 'verde' ? '🟢 Fortaleza' : (semClass === 'amarillo' ? '🟡 En Consolidación' : '🟠 Alerta Prioritaria');
        
        return \`
          <div class="dce-item-card \${semClass}">
            <div class="dce-card-head">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="dce-badge-pill \${semClass}">\${semLabel}</span>
                <span style="font-size:0.78rem; font-weight:800; color:var(--muted);">Evidencia #\${idx + 1}</span>
                <span style="font-size:0.78rem; background:#F1F5F9; color:var(--navy); padding:2px 8px; border-radius:6px; font-weight:700;">\${escHTML(ev.competencia)}</span>
              </div>
              <div class="dce-err-tags">
                <span class="dce-err-tag ee" title="% de respuestas incorrectas en Sagrada Sabiduría">
                  Error Colegio: <b>\${ev.ee_error}%</b>
                </span>
                <span class="dce-err-tag comp" title="% de error en Soledad">
                  Soledad: \${ev.etc_error}%
                </span>
                <span class="dce-err-tag comp" title="% de error en Colombia">
                  Colombia: \${ev.col_error}%
                </span>
              </div>
            </div>

            <div class="dce-afirmacion-row">
              <b>Afirmación / Aprendizaje evaluado:</b> \${escHTML(ev.aprendizaje)}
            </div>

            <div class="dce-evidencia-row">
              <b>Operación mental evaluada:</b> \${escHTML(ev.tareaCognitiva)}
            </div>

            <div class="dce-task-box">
              <b>Acción Pedagógica en Grado 10° (Meta 2027):</b> \${escHTML(ev.accionAula10)}
            </div>
          </div>
        \`;
      }).join('');
    }

    function escHTML(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Navegar y seleccionar área DCE desde cualquier botón
    function selectDceArea(areaKey) {
      goToSlide(5);
      renderDCE(areaKey);
    }

    // ===== RENDERIZADO DE GRÁFICOS CHART.JS =====
`;

if (!html.includes('const DCE_SAGRADA')) {
  html = html.replace(oldScriptStart, newScriptPart);
  console.log('DCE script logic inserted');
}

// Add event listeners for DCE buttons in DOMContentLoaded
const dceDomHook = `
      // Inicializar DCE en Slide 5
      renderDCE('mat');
      document.querySelectorAll('.dce-area-btn').forEach(btn => {
        btn.addEventListener('click', () => renderDCE(btn.dataset.dce));
      });
`;

if (!html.includes("renderDCE('mat');")) {
  html = html.replace("const ctxREZ = document.getElementById('chartComparativaRezago');",
    dceDomHook + "\n      const ctxREZ = document.getElementById('chartComparativaRezago');");
  if (!html.includes("renderDCE('mat');")) {
    html = html.replace("const ctxRezago = document.getElementById('chartComparativaRezago');",
      dceDomHook + "\n      const ctxRezago = document.getElementById('chartComparativaRezago');");
  }
  console.log('DCE DOMContentLoaded hook added');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('presentacion_sagrada_sabiduria.html fully updated with Fase 1 & Fase 2 DCE.');
