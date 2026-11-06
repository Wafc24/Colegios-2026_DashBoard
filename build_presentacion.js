const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
global.window = global;
require(path.join(projectRoot, 'data/evidenciasDCE.js'));
const dceData = global.EVIDENCIAS_DCE['308758002793'];

const htmlPath = path.join(projectRoot, 'presentacion_sagrada_sabiduria.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Ensure <script src="data/evidenciasDCE.js"></script> is included in <head>
if (!html.includes('data/evidenciasDCE.js')) {
  html = html.replace('  <script src="js/vendor/chart.umd.min.js"></script>', 
    '  <script src="js/vendor/chart.umd.min.js"></script>\n  <script src="data/evidenciasDCE.js?v=2026.10"></script>');
}

// 2. Extra CSS
const extraCSS = `
    /* Botones de Áreas con Colores Temáticos cuando están Activos */
    .area-pill-btn[data-area-code="all"].active { background: var(--navy) !important; border-color: var(--navy) !important; color: #fff !important; }
    .area-pill-btn[data-area-code="mat"].active { background: #0284C7 !important; border-color: #0284C7 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35) !important; }
    .area-pill-btn[data-area-code="lec"].active { background: #E11D48 !important; border-color: #E11D48 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35) !important; }
    .area-pill-btn[data-area-code="nat"].active { background: #10B981 !important; border-color: #10B981 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35) !important; }
    .area-pill-btn[data-area-code="soc"].active { background: #D97706 !important; border-color: #D97706 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35) !important; }
    .area-pill-btn[data-area-code="ing"].active { background: #7C3AED !important; border-color: #7C3AED !important; color: #fff !important; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35) !important; }

    /* Banner Pedagógico de Clarificación MCER vs Niveles (Slide 4) */
    .mcer-clarification-banner {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-left: 5px solid #7C3AED;
      border-radius: var(--radius);
      padding: 16px 20px;
      margin-bottom: 18px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .mcer-clarification-banner .clarification-badge {
      align-self: flex-start;
      background: #EDE9FE;
      color: #6D28D9;
      font-size: 0.74rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 10px;
      border-radius: 999px;
    }
    .mcer-clarification-banner h4 {
      font-size: 1rem;
      font-weight: 800;
      color: var(--navy);
      margin: 0;
    }
    .mcer-clarification-banner p {
      font-size: 0.85rem;
      color: var(--text);
      line-height: 1.5;
      margin: 0;
    }

    /* Estilos Fase 2 DCE (Slide 5) */
    .dce-pills-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .dce-area-btn {
      font-family: var(--font-text);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--muted);
      background: #FFFFFF;
      border: 1.5px solid var(--line);
      border-radius: 20px;
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .dce-area-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-1px);
    }
    .dce-area-btn.active {
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);
    }
    .dce-area-btn[data-dce="mat"].active { background: #0284C7; border-color: #0284C7; }
    .dce-area-btn[data-dce="lec"].active { background: #E11D48; border-color: #E11D48; }
    .dce-area-btn[data-dce="nat"].active { background: #10B981; border-color: #10B981; }
    .dce-area-btn[data-dce="soc"].active { background: #D97706; border-color: #D97706; }
    .dce-area-btn[data-dce="ing"].active { background: #7C3AED; border-color: #7C3AED; }

    .dce-btn-score {
      font-weight: 800;
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 7px;
      border-radius: 8px;
    }
    .dce-area-btn:not(.active) .dce-btn-score {
      background: #F1F5F9;
      color: var(--navy);
    }

    .dce-summary-box {
      background: #FFFFFF;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 18px 22px;
      margin-bottom: 16px;
      box-shadow: var(--shadow);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      flex-wrap: wrap;
    }
    .dce-summary-left {
      flex: 1;
      min-width: 280px;
    }
    .dce-summary-left h3 {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--navy);
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .dce-summary-left p {
      font-size: 0.88rem;
      color: var(--muted);
      line-height: 1.5;
      margin: 0;
    }
    .dce-summary-metrics {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .dce-stat-card {
      background: #F8FAFC;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px 14px;
      text-align: center;
      min-width: 95px;
    }
    .dce-stat-card .lbl {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--muted);
    }
    .dce-stat-card .val {
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--navy);
      margin-top: 2px;
    }

    .dce-legend-bar {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--muted);
      flex-wrap: wrap;
    }

    .dce-cards-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .dce-item-card {
      background: #FFFFFF;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 18px 20px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all 0.2s ease;
    }
    .dce-item-card:hover {
      box-shadow: var(--shadow-hover);
    }
    .dce-item-card.verde { border-left: 5px solid #10B981; }
    .dce-item-card.amarillo { border-left: 5px solid #F59E0B; }
    .dce-item-card.naranja { border-left: 5px solid #F97316; }

    .dce-card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .dce-badge-pill {
      font-size: 0.74rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .dce-badge-pill.verde { background: #D1FAE5; color: #047857; }
    .dce-badge-pill.amarillo { background: #FEF3C7; color: #B45309; }
    .dce-badge-pill.naranja { background: #FFEDD5; color: #C2410C; }

    .dce-err-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
    }
    .dce-err-tag {
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
    }
    .dce-err-tag.ee { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; font-weight: 800; }
    .dce-err-tag.comp { background: #F1F5F9; color: #64748B; }

    .dce-afirmacion-row {
      font-size: 0.88rem;
      color: var(--text);
      line-height: 1.45;
    }
    .dce-afirmacion-row b { color: var(--navy); }

    .dce-evidencia-row {
      font-size: 0.83rem;
      color: var(--muted);
      line-height: 1.45;
      background: #F8FAFC;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 9px 12px;
    }

    .dce-task-box {
      background: #F0FDF4;
      border: 1.5px solid #BBF7D0;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.84rem;
      color: #14532D;
      line-height: 1.45;
    }
    .dce-task-box b { color: #166534; }
`;

if (!html.includes('.mcer-clarification-banner')) {
  html = html.replace('  </style>', extraCSS + '\n  </style>');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('CSS added successfully.');
