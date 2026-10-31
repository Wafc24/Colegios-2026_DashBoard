/* Utilidades de gráficos (Chart.js) con la identidad visual moderna de Grupo Edúcate */
(function () {
  const C = {
    primary: '#0284C7', sky: '#0EA5E9', cyan: '#06B6D4', lime: '#10B981',
    yellow: '#F59E0B', orange: '#F97316', red: '#FF3B69', rose: '#FF3B69',
    silver: '#94A3B8', gray: '#64748B', teal: '#0891B2', navy: '#182334',
    purple: '#8B5CF6', indigo: '#6366F1'
  };
  const CLAS = ['A+', 'A', 'B', 'C', 'D', 'NC'];
  const CLAS_COLOR = {
    'A+': '#10B981',
    'A': '#0EA5E9',
    'B': '#6366F1',
    'C': '#F59E0B',
    'D': '#FF3B69',
    'NC': '#94A3B8'
  };
  const AREAS = ['Matemática', 'C. Naturales', 'Sociales y Ciud.', 'Lectura Crítica', 'Inglés'];
  const AREA_COLOR = ['#0284C7', '#10B981', '#F59E0B', '#FF3B69', '#8B5CF6'];
  const SERIES = ['#0284C7', '#FF3B69', '#0891B2', '#10B981', '#F59E0B'];
  const CLAS_ON = { 'A+': '#fff', 'A': '#fff', 'B': '#fff', 'C': '#fff', 'D': '#fff', 'NC': '#fff' };

  Chart.defaults.color = '#64748B';
  Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.borderColor = 'rgba(226, 232, 240, 0.8)';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(24, 35, 52, 0.95)';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(14, 165, 233, 0.35)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.titleFont = { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: 700 };
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.animation.duration = 600;

  const registry = {};
  function draw(id, config) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (registry[id]) registry[id].destroy();
    registry[id] = new Chart(el, config);
    return registry[id];
  }

  function alpha(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }

  const fmt = v => (v == null ? '—' : v.toFixed(3));

  window.G = {
    C, CLAS, CLAS_COLOR, CLAS_ON, AREAS, AREA_COLOR, SERIES, draw, alpha, fmt,

    donut(id, labels, data, colors) {
      return draw(id, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: '#fff', borderWidth: 3, hoverOffset: 10 }] },
        options: {
          cutout: '64%',
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => {
              const tot = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
              return ` ${ctx.label}: ${ctx.raw.toLocaleString('es-CO')} (${(ctx.raw * 100 / tot).toFixed(1)}%)`;
            } } }
          }
        }
      });
    },

    stacked(id, labels, datasets, horizontal) {
      return draw(id, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          indexAxis: horizontal ? 'y' : 'x',
          scales: { x: { stacked: true, grid: { display: !horizontal } }, y: { stacked: true, grid: { display: horizontal ? false : true } } },
          plugins: { legend: { position: 'bottom' } }
        }
      });
    },

    bars(id, labels, datasets, opts = {}) {
      return draw(id, {
        type: 'bar',
        data: { labels, datasets },
        options: Object.assign({
          indexAxis: opts.horizontal ? 'y' : 'x',
          scales: {
            x: { min: opts.horizontal ? opts.min : undefined, grid: { display: !!opts.horizontal } },
            y: { min: opts.horizontal ? undefined : opts.min, grid: { display: !opts.horizontal }, ticks: { autoSkip: false } }
          },
          plugins: { legend: { display: datasets.length > 1, position: 'bottom' } },
          onClick: opts.onClick
        }, opts.extra || {})
      });
    },

    radar(id, datasets, min) {
      return draw(id, {
        type: 'radar',
        data: { labels: AREAS, datasets },
        options: {
          scales: {
            r: {
              min: min ?? 0.4, max: 1,
              angleLines: { color: 'rgba(13,21,40,0.1)' },
              grid: { color: 'rgba(13,21,40,0.08)' },
              pointLabels: { color: '#1C2233', font: { size: 12, weight: 700 } },
              ticks: { backdropColor: 'transparent', color: '#9AA1B2', stepSize: 0.1, font: { size: 10 } }
            }
          },
          plugins: { legend: { position: 'bottom' } },
          elements: { line: { borderWidth: 2 }, point: { radius: 3 } }
        }
      });
    },

    radarSet(label, data, color, fill = true, dash) {
      return {
        label, data, borderColor: color, backgroundColor: fill ? alpha(color, 0.18) : 'transparent',
        pointBackgroundColor: color, borderDash: dash || [], fill
      };
    },

    line(id, labels, datasets, opts = {}) {
      return draw(id, {
        type: 'line',
        data: { labels, datasets },
        options: Object.assign({
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { usePointStyle: true, boxWidth: 8, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 } }
            },
            tooltip: {
              padding: 12,
              cornerRadius: 10,
              callbacks: opts.tooltipCallbacks || {}
            }
          },
          scales: {
            y: {
              min: opts.min,
              max: opts.max,
              grid: { color: 'rgba(226, 232, 240, 0.6)' },
              ticks: { stepSize: opts.stepSize, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 } }
            }
          }
        }, opts.extra || {})
      });
    }
  };
})();

