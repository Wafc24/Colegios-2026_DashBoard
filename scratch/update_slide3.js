const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'presentacion_sagrada_sabiduria.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update areaDetailBox in HTML to include the button
const oldDetailBox = `<div id="areaDetailBox" style="display:none; padding:10px 0;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
              <span id="detailAreaName" style="font-size:1.15rem; font-weight:900; color:var(--navy);">Matemáticas</span>
              <span id="detailAreaBadge" class="delta-pill delta-blue">+7 vs Colombia</span>
            </div>
            <p id="detailAreaDiag" style="font-size:0.86rem; color:var(--text); line-height:1.5; margin-bottom:12px;">
              Diagnóstico del área...
            </p>
            <div style="background:#F8FAFC; border:1px solid var(--line); border-radius:10px; padding:10px 14px; font-size:0.8rem; color:var(--muted);">
              <strong>Distribución 2026:</strong> <span id="detailAreaLevels">0% Nivel 1 · 26% Nivel 2 · 57% Nivel 3 · 17% Nivel 4</span>
            </div>
          </div>`;

const newDetailBox = `<div id="areaDetailBox" style="display:none; padding:10px 0;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px;">
              <span id="detailAreaName" style="font-size:1.15rem; font-weight:900; color:var(--navy);">Matemáticas</span>
              <span id="detailAreaBadge" class="delta-pill delta-blue">+7 vs Colombia</span>
            </div>
            <p id="detailAreaDiag" style="font-size:0.86rem; color:var(--text); line-height:1.5; margin-bottom:12px;">
              Diagnóstico del área...
            </p>
            <div style="background:#F8FAFC; border:1px solid var(--line); border-radius:10px; padding:10px 14px; font-size:0.8rem; color:var(--muted); margin-bottom:14px;">
              <strong>Distribución 2026:</strong> <span id="detailAreaLevels">0% Nivel 1 · 26% Nivel 2 · 57% Nivel 3 · 17% Nivel 4</span>
            </div>
            <button class="btn btn-primary" id="btnGoDCEArea" style="width:100%; justify-content:center; font-size:0.84rem; font-weight:700;">
              🔬 Auditar Evidencias y Tareas de Aula en Diapositiva 5 ➔
            </button>
          </div>`;

if (html.includes('id="detailAreaName"') && !html.includes('id="btnGoDCEArea"')) {
  const p1 = html.indexOf('<div id="areaDetailBox"');
  const p2 = html.indexOf('</div>\n        </div>\n      </div>\n\n      <!-- Tarjetas Interactivas de las 5 Áreas');
  if (p1 !== -1 && p2 !== -1) {
    html = html.slice(0, p1) + newDetailBox + html.slice(p2);
    console.log('detailAreaBox updated with CTA button');
  }
}

// 2. Update AREA_DATA to include GC 3 in data and labels
const oldMat = `mat: {
        name: 'Matemáticas',
        icon: '📐',
        score2026: 59,
        diffCol: '+7 vs COL',
        color: '#0284C7',
        diag: 'La gran oportunidad estratégica para 2027. La institución erradicó el Nivel 1 (0% de rezago). Con intervenir al 26% de alumnos en Nivel 2 mediante la ruta de 4 fases de Edúcate, el promedio del área sube a 68 pts y catapulta al colegio por encima de los 320 puntos globales.',
        levels: '0% Nivel 1 · 26% Nivel 2 · 57% Nivel 3 · 17% Nivel 4',
        labels: ['2024 (Sagrada)', '2025 (Sagrada)', '2026 (Sagrada)', 'Colombia 2026', 'Soledad 2026'],
        data: [63, 60, 59, 52, 51],
        colors: ['#94A3B8', '#F59E0B', '#0284C7', '#64748B', '#FF3B69']
      },`;

const newMat = `mat: {
        name: 'Matemáticas',
        icon: '📐',
        score2026: 59,
        diffCol: '+7 vs COL',
        color: '#0284C7',
        diag: 'La gran palanca de crecimiento para 2027. Erradicado el Nivel 1 (0%), el 26% de alumnos en Nivel 2 concentra la oportunidad para ganar de 8 a 12 puntos globales mediante las tareas de aula de formulación y ejecución.',
        levels: '0% Nivel 1 · 26% Nivel 2 · 57% Nivel 3 · 17% Nivel 4',
        labels: ['2024', '2025', '2026 (Récord)', 'Colombia', 'Soledad', 'GC-3'],
        data: [63, 60, 59, 52, 51, 53],
        colors: ['#94A3B8', '#F59E0B', '#0284C7', '#64748B', '#FF3B69', '#F97316']
      },`;

html = html.replace(oldMat, newMat);

const oldLec = `lec: {
        name: 'Lectura Crítica',
        icon: '📖',
        score2026: 64,
        diffCol: '+10 vs COL',
        color: '#FF3B69',
        diag: 'Extraordinaria madurez lectora y argumentativa. El 96% de la promoción se concentra en los Niveles 3 y 4 (con 39% en nivel superior). Representa la columna vertebral cognitiva que impulsa el rendimiento en las demás pruebas.',
        levels: '0% Nivel 1 · 4% Nivel 2 · 57% Nivel 3 · 39% Nivel 4',
        labels: ['2024 (Sagrada)', '2025 (Sagrada)', '2026 (Sagrada)', 'Colombia 2026', 'Soledad 2026'],
        data: [64, 62, 64, 54, 52],
        colors: ['#94A3B8', '#F59E0B', '#FF3B69', '#64748B', '#FF3B69']
      },`;

const newLec = `lec: {
        name: 'Lectura Crítica',
        icon: '📖',
        score2026: 64,
        diffCol: '+10 vs COL',
        color: '#E11D48',
        diag: 'Extraordinaria madurez lectora y argumentativa. El 96% de la promoción se concentra en los Niveles 3 y 4 (con 39% en Nivel 4 Superior). Representa la columna vertebral cognitiva que impulsa el rendimiento en las demás pruebas.',
        levels: '0% Nivel 1 · 4% Nivel 2 · 57% Nivel 3 · 39% Nivel 4',
        labels: ['2024', '2025', '2026 (Récord)', 'Colombia', 'Soledad', 'GC-3'],
        data: [64, 62, 64, 54, 52, 55],
        colors: ['#94A3B8', '#F59E0B', '#E11D48', '#64748B', '#FF3B69', '#F97316']
      },`;

html = html.replace(oldLec, newLec);

const oldNat = `nat: {
        name: 'Ciencias Naturales',
        icon: '🔬',
        score2026: 62,
        diffCol: '+12 vs COL',
        color: '#10B981',
        diag: 'Crecimiento sostenido durante los tres años consecutivos (59 ➔ 60 ➔ 62 pts). El 78% de los estudiantes se ubica en niveles avanzados. Notable capacidad en explicación de fenómenos y modelación de sistemas físicos y biológicos.',
        levels: '0% Nivel 1 · 22% Nivel 2 · 61% Nivel 3 · 17% Nivel 4',
        labels: ['2024 (Sagrada)', '2025 (Sagrada)', '2026 (Sagrada)', 'Colombia 2026', 'Soledad 2026'],
        data: [59, 60, 62, 50, 48],
        colors: ['#94A3B8', '#F59E0B', '#10B981', '#64748B', '#FF3B69']
      },`;

const newNat = `nat: {
        name: 'Ciencias Naturales',
        icon: '🔬',
        score2026: 62,
        diffCol: '+12 vs COL',
        color: '#10B981',
        diag: 'Crecimiento sostenido durante los tres años consecutivos (59 ➔ 60 ➔ 62 pts). El 78% de los estudiantes se ubica en niveles 3 y 4. Fuerte dominio biológico y oportunidad de consolidación en indagación física.',
        levels: '0% Nivel 1 · 22% Nivel 2 · 61% Nivel 3 · 17% Nivel 4',
        labels: ['2024', '2025', '2026 (Récord)', 'Colombia', 'Soledad', 'GC-3'],
        data: [59, 60, 62, 50, 48, 53],
        colors: ['#94A3B8', '#F59E0B', '#10B981', '#64748B', '#FF3B69', '#F97316']
      },`;

html = html.replace(oldNat, newNat);

const oldSoc = `soc: {
        name: 'Sociales y Ciudadanas',
        icon: '🏛️',
        score2026: 60,
        diffCol: '+11 vs COL',
        color: '#F59E0B',
        diag: 'Evolución ascendente sólida y continua (57 ➔ 59 ➔ 60 pts). La institución erradicó por completo el Nivel 1 y concentró al 65% de sus alumnos en los niveles 3 y 4, superando ampliamente el promedio territorial.',
        levels: '0% Nivel 1 · 35% Nivel 2 · 48% Nivel 3 · 17% Nivel 4',
        labels: ['2024 (Sagrada)', '2025 (Sagrada)', '2026 (Sagrada)', 'Colombia 2026', 'Soledad 2026'],
        data: [57, 59, 60, 49, 47],
        colors: ['#94A3B8', '#F59E0B', '#F59E0B', '#64748B', '#FF3B69']
      },`;

const newSoc = `soc: {
        name: 'Sociales y Ciudadanas',
        icon: '🏛️',
        score2026: 60,
        diffCol: '+11 vs COL',
        color: '#D97706',
        diag: 'Ascenso constante durante el trienio (57 ➔ 59 ➔ 60 pts). Erradicación total del Nivel 1 y 65% en niveles 3 y 4. Fortalezas notables en multiperspectivismo y pensamiento reflexivo sistémico.',
        levels: '0% Nivel 1 · 35% Nivel 2 · 48% Nivel 3 · 17% Nivel 4',
        labels: ['2024', '2025', '2026 (Récord)', 'Colombia', 'Soledad', 'GC-3'],
        data: [57, 59, 60, 49, 47, 51],
        colors: ['#94A3B8', '#F59E0B', '#D97706', '#64748B', '#FF3B69', '#F97316']
      },`;

html = html.replace(oldSoc, newSoc);

const oldIng = `ing: {
        name: 'Inglés',
        icon: '🇬🇧',
        score2026: 69,
        diffCol: '+17 vs COL',
        color: '#8B5CF6',
        diag: 'Puntaje más alto de toda la institución (69 pts). El 61% de la promoción alcanzó los estándares internacionales B1 y B+ del Marco Común Europeo. Supera al promedio nacional por una extraordinaria brecha de +17 puntos.',
        levels: 'Solo 1 alumno (4%) en A- · 35% en A1/A2 · 61% en B1/B+',
        labels: ['2024 (Sagrada)', '2025 (Sagrada)', '2026 (Sagrada)', 'Colombia 2026', 'Soledad 2026'],
        data: [68, 66, 69, 52, 49],
        colors: ['#94A3B8', '#F59E0B', '#8B5CF6', '#64748B', '#FF3B69']
      }`;

const newIng = `ing: {
        name: 'Inglés',
        icon: '🇬🇧',
        score2026: 69,
        diffCol: '+17 vs COL',
        color: '#7C3AED',
        diag: 'Puntaje insignia del colegio (69 pts). El 61% de la promoción egresó en niveles independientes B1 y B+ del Marco Común Europeo, superando por +17 puntos el promedio nacional. Solo 1 alumno en A-.',
        levels: 'Solo 1 alumno (4%) en A- · 35% en A1/A2 · 61% en B1/B+',
        labels: ['2024', '2025', '2026 (Récord)', 'Colombia', 'Soledad', 'GC-3'],
        data: [68, 66, 69, 52, 49, 56],
        colors: ['#94A3B8', '#F59E0B', '#7C3AED', '#64748B', '#FF3B69', '#F97316']
      }`;

html = html.replace(oldIng, newIng);

// 3. Update applyAreaFilter implementation
const oldApplyFilter = `      function applyAreaFilter(code) {
        // Actualizar estado activo en botones superiores
        document.querySelectorAll('.area-pill-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.areaCode === code);
        });

        // Actualizar estado activo en las tarjetas inferiores
        document.querySelectorAll('.area-mini-card').forEach(c => {
          c.classList.toggle('active', code !== 'all' && c.dataset.areaCode === code);
        });

        const titleEl = document.getElementById('areaChartTitle');
        const subEl = document.getElementById('areaChartSubtitle');
        const btnReset = document.getElementById('btnResetAreaFilter');
        const radarBox = document.getElementById('radarBox');
        const detailBox = document.getElementById('areaDetailBox');
        const radarTitle = document.getElementById('radarTitle');
        const radarSub = document.getElementById('radarSubtitle');

        if (code === 'all') {
          // Restaurar vista general de todas las áreas
          if (titleEl) titleEl.textContent = AREA_DATA.all.title;
          if (subEl) subEl.textContent = AREA_DATA.all.subtitle;
          if (btnReset) btnReset.style.display = 'none';

          if (radarBox) radarBox.style.display = 'block';
          if (detailBox) detailBox.style.display = 'none';
          if (radarTitle) radarTitle.textContent = 'Radar de Simetría Curricular (2026)';
          if (radarSub) radarSub.textContent = 'Equilibrio formativo de Sagrada Sabiduría frente a la media nacional';

          if (chartAreas) {
            chartAreas.data.labels = AREA_DATA.all.labels;
            chartAreas.data.datasets = AREA_DATA.all.datasets;
            chartAreas.options.scales.y.min = 45;
            chartAreas.options.scales.y.max = 75;
            chartAreas.update();
          }
        } else {
          // Filtrar a la radiografía específica del área seleccionada
          const d = AREA_DATA[code];
          if (!d) return;

          if (titleEl) titleEl.textContent = \`Radiografía de \${d.name}: Evolución Trienal vs Entorno\`;
          if (subEl) subEl.textContent = \`Comparativa histórica Sagrada Sabiduría (2024-2026) frente a Colombia y Soledad\`;
          if (btnReset) btnReset.style.display = 'inline-block';

          // Mostrar Ficha de Diagnóstico del Área
          if (detailBox) {
            detailBox.style.display = 'block';
            document.getElementById('detailAreaName').textContent = \`\${d.icon} \${d.name} (\${d.score2026} pts)\`;
            document.getElementById('detailAreaBadge').textContent = d.diffCol;
            document.getElementById('detailAreaDiag').textContent = d.diag;
            document.getElementById('detailAreaLevels').textContent = d.levels;
          }
          if (radarTitle) radarTitle.textContent = \`Diagnóstico Estratégico: \${d.name}\`;
          if (radarSub) radarSub.textContent = \`Análisis de desempeño y oportunidades pedagógicas para 2027\`;

          // Actualizar el gráfico de barras con la comparativa del área
          if (chartAreas) {
            chartAreas.data.labels = d.labels;
            chartAreas.data.datasets = [
              {
                label: \`Puntaje \${d.name}\`,
                data: d.data,
                backgroundColor: d.colors,
                borderRadius: 6
              }
            ];
            chartAreas.options.scales.y.min = 40;
            chartAreas.options.scales.y.max = 75;
            chartAreas.update();
          }
        }
      }`;

const newApplyFilter = `      function applyAreaFilter(code) {
        // Actualizar estado activo en botones superiores
        document.querySelectorAll('.area-pill-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.areaCode === code);
        });

        // Actualizar estado activo en las tarjetas inferiores
        document.querySelectorAll('.area-mini-card').forEach(c => {
          c.classList.toggle('active', code !== 'all' && c.dataset.areaCode === code);
        });

        const titleEl = document.getElementById('areaChartTitle');
        const subEl = document.getElementById('areaChartSubtitle');
        const btnReset = document.getElementById('btnResetAreaFilter');
        const radarBox = document.getElementById('radarBox');
        const detailBox = document.getElementById('areaDetailBox');
        const radarTitle = document.getElementById('radarTitle');
        const radarSub = document.getElementById('radarSubtitle');

        if (code === 'all') {
          // Restaurar vista general de todas las áreas
          if (titleEl) titleEl.textContent = AREA_DATA.all.title;
          if (subEl) subEl.textContent = AREA_DATA.all.subtitle;
          if (btnReset) btnReset.style.display = 'none';

          if (radarBox) radarBox.style.display = 'block';
          if (detailBox) detailBox.style.display = 'none';
          if (radarTitle) radarTitle.textContent = 'Radar de Simetría Curricular (2026)';
          if (radarSub) radarSub.textContent = 'Equilibrio formativo de Sagrada Sabiduría frente a la media nacional';

          if (chartAreas) {
            chartAreas.data.labels = AREA_DATA.all.labels;
            chartAreas.data.datasets = AREA_DATA.all.datasets;
            chartAreas.options.scales.y.min = 45;
            chartAreas.options.scales.y.max = 75;
            chartAreas.update();
          }
        } else {
          // Filtrar a la radiografía específica del área seleccionada
          const d = AREA_DATA[code];
          if (!d) return;

          if (titleEl) titleEl.textContent = \`Radiografía de \${d.name}: Trayectoria Trienal y Entorno 2026\`;
          if (subEl) subEl.textContent = \`Evolución histórica institucional frente a Colombia, Soledad y Grupo de Comparación\`;
          if (btnReset) btnReset.style.display = 'inline-block';

          // Mostrar Ficha de Diagnóstico y Ocultar Radar
          if (radarBox) radarBox.style.display = 'none';
          if (detailBox) {
            detailBox.style.display = 'block';
            document.getElementById('detailAreaName').textContent = \`\${d.icon} \${d.name} (\${d.score2026} pts)\`;
            document.getElementById('detailAreaBadge').textContent = d.diffCol;
            document.getElementById('detailAreaDiag').textContent = d.diag;
            document.getElementById('detailAreaLevels').textContent = d.levels;

            const btnGoDCE = document.getElementById('btnGoDCEArea');
            if (btnGoDCE) {
              btnGoDCE.onclick = () => selectDceArea(code);
            }
          }

          if (radarTitle) radarTitle.textContent = \`Ficha Estratégica: \${d.name}\`;
          if (radarSub) radarSub.textContent = \`Diagnóstico institucional y foco pedagógico para la Meta 2027\`;

          // Actualizar gráfico de barras con la comparativa del área
          if (chartAreas) {
            chartAreas.data.labels = d.labels;
            chartAreas.data.datasets = [
              {
                label: \`Puntaje \${d.name}\`,
                data: d.data,
                backgroundColor: d.colors,
                borderRadius: 6
              }
            ];
            chartAreas.options.scales.y.min = 35;
            chartAreas.options.scales.y.max = 75;
            chartAreas.update();
          }
        }
      }`;

html = html.replace(oldApplyFilter, newApplyFilter);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Slide 3 interactivity fully updated');
