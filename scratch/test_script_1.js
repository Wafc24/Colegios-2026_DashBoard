
    // Navegación de Diapositivas
    let currentSlide = 1;
    const totalSlides = 6;
    const tabButtons = document.querySelectorAll('#slideTabs .tab');
    const slidePages = document.querySelectorAll('.slide-page');

    function goToSlide(num) {
      if (num < 1) num = 1;
      if (num > totalSlides) num = totalSlides;
      currentSlide = num;

      tabButtons.forEach(btn => {
        const s = parseInt(btn.dataset.slide, 10);
        btn.classList.toggle('active', s === currentSlide);
      });

      slidePages.forEach((page, idx) => {
        page.classList.toggle('active', (idx + 1) === currentSlide);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        goToSlide(parseInt(btn.dataset.slide, 10));
      });
    });

    document.getElementById('btnPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('btnNext').addEventListener('click', () => goToSlide(currentSlide + 1));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToSlide(currentSlide - 1);
      }
    });

    // ===== DATOS DETALLADOS DE LAS 5 ÁREAS PARA FILTRADO INTERACTIVO =====
    const AREA_DATA = {
      all: {
        title: 'Comportamiento Trienal por Área (2024 – 2026)',
        subtitle: 'Comparación de promedios anuales en las pruebas oficiales',
        labels: ['Matemáticas', 'Lectura Crítica', 'C. Naturales', 'Sociales', 'Inglés'],
        datasets: [
          { label: '2024', data: [63, 64, 59, 57, 68], backgroundColor: '#94A3B8', borderRadius: 5 },
          { label: '2025', data: [60, 62, 60, 59, 66], backgroundColor: '#F59E0B', borderRadius: 5 },
          { label: '2026', data: [59, 64, 62, 60, 69], backgroundColor: '#0284C7', borderRadius: 5 }
        ]
      },
      mat: {
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
      },
      lec: {
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
      },
      nat: {
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
      },
      soc: {
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
      },
      ing: {
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
      }
    };

    
    // ===== BASE DE DATOS DCE Y TAREAS DE AULA GRADO 10° =====
    const DCE_SAGRADA = {
  "mat": {
    "nombre": "Matemáticas",
    "icono": "📐",
    "color": "#0284C7",
    "promedio2026": 59,
    "desv2026": 11,
    "comparativo": {
      "col": 52,
      "etc": 51,
      "gc": 53
    },
    "niveles": {
      "n1": 0,
      "n2": 26,
      "n3": 57,
      "n4": 17
    },
    "diagnosticoArea": "Área de máxima oportunidad de crecimiento institucional hacia 2027. Aunque supera al promedio nacional (52) y a la ETC Soledad (51), la concentración de respuestas en alerta naranja ofrece la palanca perfecta para ganar entre 8 y 12 puntos globales adicionales.",
    "evidencias": [
      {
        "aprendizaje": "Frente a un problema que involucre información cuantitativa, plantea e implementa estrategias que lleven a soluciones adecuadas.",
        "competencia": "Formulación y Ejecución",
        "ee_error": 54,
        "col_error": 65,
        "etc_error": 66,
        "color": "naranja",
        "estado": "Oportunidad Prioritaria (Naranja)",
        "tareaCognitiva": "Traducir problemas del lenguaje verbal al lenguaje matemático formal: modelar restricciones simultáneas, plantear ecuaciones, proporcionalidad y optimización.",
        "accionAula10": "Descomponer el enunciado en variables explícitas e incógnitas antes de operar mecánicamente. Ejercitar el modelado de ecuaciones y razones de cambio sin calculadora."
      },
      {
        "aprendizaje": "Comprende y transforma la información cuantitativa y esquemática presentada en distintos formatos.",
        "competencia": "Interpretación y Representación",
        "ee_error": 43,
        "col_error": 57,
        "etc_error": 59,
        "color": "naranja",
        "estado": "Atención Focalizada (Naranja)",
        "tareaCognitiva": "Extraer e interrelacionar datos desde tablas bidimensionales, diagramas de dispersión, histogramas y polígonos de frecuencia hacia modelos analíticos.",
        "accionAula10": "Talleres continuos de lectura gráfica y conversión entre representaciones tabulares, gráficas y algebraicas."
      },
      {
        "aprendizaje": "Valida procedimientos y estrategias matemáticas utilizadas para dar solución a problemas.",
        "competencia": "Argumentación",
        "ee_error": 44,
        "col_error": 56,
        "etc_error": 58,
        "color": "naranja",
        "estado": "Atención Focalizada (Naranja)",
        "tareaCognitiva": "Juzgar la validez de un procedimiento algorítmico, detectar inconsistencias dimensionales y formular contraejemplos matemáticos.",
        "accionAula10": "Pedagogía del error: exponer a los estudiantes a procedimientos resueltos con fallas típicas para que identifiquen y justifiquen por qué los distractores de la prueba son trampas."
      }
    ]
  },
  "lec": {
    "nombre": "Lectura Crítica",
    "icono": "📖",
    "color": "#E11D48",
    "promedio2026": 64,
    "desv2026": 7,
    "comparativo": {
      "col": 53,
      "etc": 53,
      "gc": 55
    },
    "niveles": {
      "n1": 0,
      "n2": 4,
      "n3": 57,
      "n4": 39
    },
    "diagnosticoArea": "Desempeño sobresaliente y pilar formativo del colegio. El 96% de los alumnos se ubica en los niveles 3 y 4 de dominio lector, con una desviación extremadamente baja (σ = 7 pts), demostrando madurez analítica generalizada.",
    "evidencias": [
      {
        "aprendizaje": "Identifica y entiende los contenidos locales que conforman un texto.",
        "competencia": "Identificar y entender contenidos locales",
        "ee_error": 16,
        "col_error": 29,
        "etc_error": 30,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Localizar información explícita, identificar el significado de palabras en contexto pragmático y reconocer relaciones semánticas locales.",
        "accionAula10": "Mantener la práctica de lectura comprensiva y enriquecimiento de vocabulario académico interdisciplinar."
      },
      {
        "aprendizaje": "Comprende cómo se articulan las partes de un texto para darle un sentido global.",
        "competencia": "Comprender la articulación global",
        "ee_error": 27,
        "col_error": 47,
        "etc_error": 47,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Identificar la estructura de un texto, la tesis principal, los argumentos de soporte y la progresión temática entre párrafos.",
        "accionAula10": "Mapas de estructura argumentativa y deconstrucción de ensayos y artículos de divulgación científica."
      },
      {
        "aprendizaje": "Reflexiona a partir de un texto y evalúa su contenido.",
        "competencia": "Reflexión y Evaluación",
        "ee_error": 32,
        "col_error": 49,
        "etc_error": 49,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Juzgar la validez y solidez de los argumentos, reconocer supuestos ideológicos, intenciones ocultas, tono y sesgos del autor.",
        "accionAula10": "Debates intertextuales sobre textos filosóficos y columnas de opinión de alta complejidad contrastando posturas opuestas."
      }
    ]
  },
  "soc": {
    "nombre": "Sociales y Ciudadanas",
    "icono": "🏛️",
    "color": "#D97706",
    "promedio2026": 60,
    "desv2026": 9,
    "comparativo": {
      "col": 50,
      "etc": 49,
      "gc": 51
    },
    "niveles": {
      "n1": 0,
      "n2": 35,
      "n3": 48,
      "n4": 17
    },
    "diagnosticoArea": "Rendimiento consolidado con ascenso constante (57 → 59 → 60 pts). Supera por 10 puntos a Colombia (50) y a Soledad (49). Destaca un 0% de alumnos en Nivel 1 y un 65% en Niveles 3 y 4.",
    "evidencias": [
      {
        "aprendizaje": "Comprende que los problemas y sus soluciones involucran distintas dimensiones y reconoce relaciones entre estas.",
        "competencia": "Pensamiento Reflexivo y Sistémico",
        "ee_error": 14,
        "col_error": 43,
        "etc_error": 46,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Analizar problemáticas sociales articulando simultáneamente dimensiones económicas, políticas, culturales y ambientales.",
        "accionAula10": "Continuar el abordaje interdisciplinar de coyunturas sociopolíticas nacionales y globales."
      },
      {
        "aprendizaje": "Comprende perspectivas de distintos actores y grupos sociales.",
        "competencia": "Multiperspectivismo",
        "ee_error": 18,
        "col_error": 43,
        "etc_error": 46,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Identificar y contrastar intereses, motivaciones y posturas de diferentes actores en conflictos históricos o constitucionales.",
        "accionAula10": "Juegos de roles y análisis de dilemas morales y constitucionales desde múltiples orillas ideológicas."
      },
      {
        "aprendizaje": "Evalúa usos sociales de las ciencias sociales.",
        "competencia": "Pensamiento Reflexivo y Sistémico",
        "ee_error": 20,
        "col_error": 45,
        "etc_error": 46,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Evaluar el impacto de normas, políticas públicas y modelos económicos sobre el bienestar y la cohesión ciudadana.",
        "accionAula10": "Estudios de caso sobre mecanismos de participación ciudadana y tutela de derechos fundamentales en Colombia."
      },
      {
        "aprendizaje": "Comprende modelos conceptuales, sus características y contextos de aplicación.",
        "competencia": "Interpretación y Análisis",
        "ee_error": 33,
        "col_error": 49,
        "etc_error": 50,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Reconocer y aplicar conceptos clave de la ciencia política y la economía (Estado social de derecho, inflación, soberanía, división de poderes).",
        "accionAula10": "Glosario analítico y aplicación de conceptos teóricos a hechos históricos contemporáneos."
      },
      {
        "aprendizaje": "Contextualiza y evalúa usos de fuentes y argumentos.",
        "competencia": "Pensamiento Social",
        "ee_error": 35,
        "col_error": 53,
        "etc_error": 55,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Valorar la credibilidad de testimonios, discursos y fuentes históricas identificando intencionalidad y contexto temporal.",
        "accionAula10": "Cotejo crítico de fuentes primarias vs. secundarias sobre el conflicto colombiano y la historia del siglo XX."
      },
      {
        "aprendizaje": "Comprende dimensiones espaciales y temporales de eventos, problemáticas y prácticas sociales.",
        "competencia": "Pensamiento Social y Geográfico",
        "ee_error": 40,
        "col_error": 55,
        "etc_error": 57,
        "color": "naranja",
        "estado": "Oportunidad de Refuerzo (Naranja)",
        "tareaCognitiva": "Ubicar transformaciones territoriales, fronteras históricas y procesos geopolíticos de larga duración.",
        "accionAula10": "Trabajo intensivo con cartografía histórica, mapas temáticos y líneas de tiempo analíticas de procesos sociodemográficos."
      }
    ]
  },
  "nat": {
    "nombre": "Ciencias Naturales",
    "icono": "🔬",
    "color": "#059669",
    "promedio2026": 62,
    "desv2026": 9,
    "comparativo": {
      "col": 51,
      "etc": 51,
      "gc": 53
    },
    "niveles": {
      "n1": 0,
      "n2": 22,
      "n3": 61,
      "n4": 17
    },
    "diagnosticoArea": "Rendimiento sobresaliente (62 puntos), superando con amplitud a Colombia (51) y a Soledad (51). El 78% del grupo alcanza los niveles 3 y 4. Las oportunidades prioritarias radican en la explicación de fenómenos y deducción de conclusiones experimentales en física y biología.",
    "evidencias": [
      {
        "aprendizaje": "Utilizar algunas habilidades de pensamiento y de procedimiento para evaluar predicciones - Procesos químicos",
        "competencia": "Indagación",
        "ee_error": 10,
        "col_error": 45,
        "etc_error": 48,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Evaluar hipótesis y predecir variaciones en reacciones químicas y disoluciones con rigor metodológico.",
        "accionAula10": "Mantener el trabajo práctico de diseño experimental y balance estequiométrico."
      },
      {
        "aprendizaje": "Analizar el potencial del uso de recursos naturales o artefactos y sus efectos sobre el entorno y la salud - CTS",
        "competencia": "Ciencia, Tecnología y Sociedad",
        "ee_error": 11,
        "col_error": 38,
        "etc_error": 39,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Valorar impactos bioéticos, energéticos y ambientales de tecnologías e industrias en las comunidades.",
        "accionAula10": "Continuar el enfoque crítico sobre sostenibilidad y transición energética."
      },
      {
        "aprendizaje": "Asociar fenómenos naturales con conceptos propios del conocimiento científico - Procesos vivos",
        "competencia": "Uso Comprensivo del Conocimiento",
        "ee_error": 11,
        "col_error": 29,
        "etc_error": 31,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Identificar principios biológicos fundamentales en ciclos vitales, homeostasis y fisiología de organismos.",
        "accionAula10": "Reforzar la vinculación de conceptos biológicos con la cotidianidad médica y ambiental."
      },
      {
        "aprendizaje": "Modelar fenómenos de la naturaleza basado en el análisis de variables... - Procesos vivos",
        "competencia": "Explicación de Fenómenos",
        "ee_error": 13,
        "col_error": 46,
        "etc_error": 48,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Esquematizar redes tróficas, dinámica de poblaciones y transmisión genética de caracteres.",
        "accionAula10": "Diagramas de flujo genético y modelos de equilibrio ecosistémico."
      },
      {
        "aprendizaje": "Explicar cómo ocurren algunos fenómenos de la naturaleza basado en observaciones y patrones - Procesos vivos",
        "competencia": "Explicación de Fenómenos",
        "ee_error": 46,
        "col_error": 62,
        "etc_error": 62,
        "color": "naranja",
        "estado": "Oportunidad Prioritaria (Naranja)",
        "tareaCognitiva": "Articular explicaciones causales detalladas sobre fotosíntesis, respiración celular y adaptaciones evolutivas.",
        "accionAula10": "Laboratorios de indagación biológica: diseñar preguntas que exijan explicar el 'por qué' celular de un fenómeno y no solo recordar nombres."
      },
      {
        "aprendizaje": "Derivar conclusiones para algunos fenómenos basándose en conocimientos científicos y evidencia - Procesos físicos",
        "competencia": "Indagación",
        "ee_error": 45,
        "col_error": 50,
        "etc_error": 52,
        "color": "naranja",
        "estado": "Oportunidad Prioritaria (Naranja)",
        "tareaCognitiva": "Analizar gráficos cinemáticos, diagramas de fuerzas y trayectorias para concluir sobre leyes de conservación mecánica.",
        "accionAula10": "Ejercicios intensivos de lectura e interpretación de gráficos posición-tiempo y fuerza-deformación."
      },
      {
        "aprendizaje": "Identificar las características de algunos fenómenos basado en información científica - Procesos físicos",
        "competencia": "Uso Comprensivo del Conocimiento",
        "ee_error": 47,
        "col_error": 65,
        "etc_error": 64,
        "color": "naranja",
        "estado": "Oportunidad Prioritaria (Naranja)",
        "tareaCognitiva": "Diferenciar con precisión propiedades físicas afines: trabajo vs potencia, masa vs peso, rapidez vs velocidad, calor vs temperatura.",
        "accionAula10": "Contraste conceptual y dimensional riguroso antes de aplicar fórmulas numéricas."
      }
    ]
  },
  "ing": {
    "nombre": "Inglés",
    "icono": "🌍",
    "color": "#7C3AED",
    "promedio2026": 69,
    "desv2026": 12,
    "comparativo": {
      "col": 53,
      "etc": 53,
      "gc": 56
    },
    "niveles": {
      "a_minus": 4,
      "a1": 9,
      "a2": 26,
      "b1": 48,
      "b_plus": 13
    },
    "diagnosticoArea": "Prueba líder del colegio (69 puntos). Supera por +16 puntos el promedio nacional. El 61% de la promoción egresa en niveles independientes B1 y B+, cumpliendo los más altos estándares del Marco Común Europeo.",
    "evidencias": [
      {
        "aprendizaje": "Parte 1: Reconocimiento de vocabulario temático mediante descripciones y definiciones.",
        "competencia": "Competencia Léxica",
        "ee_error": 12,
        "col_error": 45,
        "etc_error": 48,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Emparejar descripciones contextuales con el término léxico correspondiente descartando opciones distractoras.",
        "accionAula10": "Consolidación de campos semánticos y vocabulario técnico en inglés."
      },
      {
        "aprendizaje": "Parte 2: Identificación de ubicación y función comunicativa de avisos publicitarios y normativos.",
        "competencia": "Competencia Pragmática",
        "ee_error": 9,
        "col_error": 38,
        "etc_error": 40,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Deducir dónde se encontraría un aviso (sitios públicos, medios de transporte, oficinas) según su intención.",
        "accionAula10": "Lectura rápida de avisos auténticos y señalética en entornos urbanos y escolares."
      },
      {
        "aprendizaje": "Parte 3: Selección de la respuesta conversacional coherente en situaciones de habla cotidiana.",
        "competencia": "Competencia Comunicativa",
        "ee_error": 14,
        "col_error": 42,
        "etc_error": 45,
        "color": "verde",
        "estado": "Fortaleza Consolidada (Verde)",
        "tareaCognitiva": "Elegir el turno conversacional adecuado respondiendo a preguntas de cortesía, acuerdos y desacuerdos.",
        "accionAula10": "Micro-diálogos en parejas con situaciones reales de intercambio social."
      },
      {
        "aprendizaje": "Partes 4 y 7: Completar textos con la estructura gramatical, tiempo verbal o preposición correcta.",
        "competencia": "Competencia Gramatical",
        "ee_error": 28,
        "col_error": 52,
        "etc_error": 54,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Identificar concordancias, verbos frasales, tiempos compuestos y conectores discursivos en lecturas continuas.",
        "accionAula10": "Prácticas de cloze test enfocadas en preposiciones dependientes y tiempos perfectos."
      },
      {
        "aprendizaje": "Partes 5 y 6: Comprensión literal e inferencial de textos narrativos, informativos y de opinión.",
        "competencia": "Comprensión Lectora Avanzada (B1/B+)",
        "ee_error": 25,
        "col_error": 49,
        "etc_error": 51,
        "color": "amarillo",
        "estado": "Nivel Satisfactorio (Amarillo)",
        "tareaCognitiva": "Inferir la postura del autor, tono y conclusiones no explícitas en lecturas extensas.",
        "accionAula10": "Lectura guiada de artículos de prensa internacional identificando tesis y argumentos implícitos para subir de B1 a B+."
      }
    ]
  }
};

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

      if (titleEl) titleEl.innerHTML = `${data.icono} ${data.nombre} (${data.promedio2026} pts)`;
      if (diagEl) diagEl.textContent = data.diagnosticoArea;
      if (scoreEl) {
        scoreEl.textContent = `${data.promedio2026} pts`;
        scoreEl.style.color = data.color;
      }
      if (sigmaEl) sigmaEl.innerHTML = `&sigma; = ${data.desv2026} pts`;
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
        
        return `
          <div class="dce-item-card ${semClass}">
            <div class="dce-card-head">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="dce-badge-pill ${semClass}">${semLabel}</span>
                <span style="font-size:0.78rem; font-weight:800; color:var(--muted);">Evidencia #${idx + 1}</span>
                <span style="font-size:0.78rem; background:#F1F5F9; color:var(--navy); padding:2px 8px; border-radius:6px; font-weight:700;">${escHTML(ev.competencia)}</span>
              </div>
              <div class="dce-err-tags">
                <span class="dce-err-tag ee" title="% de respuestas incorrectas en Sagrada Sabiduría">
                  Error Colegio: <b>${ev.ee_error}%</b>
                </span>
                <span class="dce-err-tag comp" title="% de error en Soledad">
                  Soledad: ${ev.etc_error}%
                </span>
                <span class="dce-err-tag comp" title="% de error en Colombia">
                  Colombia: ${ev.col_error}%
                </span>
              </div>
            </div>

            <div class="dce-afirmacion-row">
              <b>Afirmación / Aprendizaje evaluado:</b> ${escHTML(ev.aprendizaje)}
            </div>

            <div class="dce-evidencia-row">
              <b>Operación mental evaluada:</b> ${escHTML(ev.tareaCognitiva)}
            </div>

            <div class="dce-task-box">
              <b>Acción Pedagógica en Grado 10° (Meta 2027):</b> ${escHTML(ev.accionAula10)}
            </div>
          </div>
        `;
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

    document.addEventListener('DOMContentLoaded', () => {
      Chart.defaults.color = '#64748B';
      Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

      // 1. Gráfico de Evolución del Puntaje Global (2024-2026)
      let chartGlobal = null;
      const ctxGlobal = document.getElementById('chartEvolucionGlobal');
      if (ctxGlobal) {
        chartGlobal = new Chart(ctxGlobal, {
          type: 'line',
          data: {
            labels: ['2024', '2025', '2026 (Récord)'],
            datasets: [
              {
                label: 'Colegio Sagrada Sabiduría',
                data: [307, 303, 309],
                borderColor: '#0284C7',
                backgroundColor: 'rgba(2, 132, 199, 0.08)',
                borderWidth: 3.5,
                fill: true,
                tension: 0.25,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#0284C7',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8
              },
              {
                label: 'Grupo Comparación (GC-3)',
                data: [279, 280, 279],
                borderColor: '#F59E0B',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.1,
                pointRadius: 4,
                pointBackgroundColor: '#F59E0B'
              },
              {
                label: 'Promedio Colombia',
                data: [260, 261, 258],
                borderColor: '#64748B',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 4,
                pointBackgroundColor: '#64748B'
              },
              {
                label: 'ETC Soledad',
                data: [257, 257, 254],
                borderColor: '#FF3B69',
                borderWidth: 2,
                borderDash: [3, 3],
                tension: 0.1,
                pointRadius: 4,
                pointBackgroundColor: '#FF3B69'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 12, font: { weight: '700' } } },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} pts`
                }
              }
            },
            scales: {
              y: {
                min: 240,
                max: 325,
                grid: { color: '#E2E8F0' },
                ticks: { stepSize: 15 }
              },
              x: {
                grid: { color: '#E2E8F0' }
              }
            }
          }
        });
      }

      // Filtros rápidos de líneas en el gráfico de Slide 2
      const btnAll = document.getElementById('btnFilterAllLines');
      const btnSol = document.getElementById('btnFilterSagradaSoledad');
      const btnCol = document.getElementById('btnFilterSagradaColombia');

      if (btnAll && btnSol && btnCol && chartGlobal) {
        btnAll.onclick = () => {
          [btnAll, btnSol, btnCol].forEach(b => b.classList.remove('active'));
          btnAll.classList.add('active');
          chartGlobal.data.datasets.forEach(ds => ds.hidden = false);
          chartGlobal.update();
        };
        btnSol.onclick = () => {
          [btnAll, btnSol, btnCol].forEach(b => b.classList.remove('active'));
          btnSol.classList.add('active');
          chartGlobal.data.datasets[0].hidden = false; // Sagrada
          chartGlobal.data.datasets[1].hidden = true;  // GC-3
          chartGlobal.data.datasets[2].hidden = true;  // Colombia
          chartGlobal.data.datasets[3].hidden = false; // Soledad
          chartGlobal.update();
        };
        btnCol.onclick = () => {
          [btnAll, btnSol, btnCol].forEach(b => b.classList.remove('active'));
          btnCol.classList.add('active');
          chartGlobal.data.datasets[0].hidden = false; // Sagrada
          chartGlobal.data.datasets[1].hidden = true;  // GC-3
          chartGlobal.data.datasets[2].hidden = false; // Colombia
          chartGlobal.data.datasets[3].hidden = true;  // Soledad
          chartGlobal.update();
        };
      }

      // Interactividad con las tarjetas de año en Slide 2
      document.querySelectorAll('.year-story-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.year-story-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
      });

      // 2. Gráfico de Evolución de las 5 Áreas (Slide 3)
      let chartAreas = null;
      const ctxAreas = document.getElementById('chartAreasTrienal');
      if (ctxAreas) {
        chartAreas = new Chart(ctxAreas, {
          type: 'bar',
          data: {
            labels: AREA_DATA.all.labels,
            datasets: AREA_DATA.all.datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 12, font: { weight: '700' } } }
            },
            scales: {
              y: {
                min: 45,
                max: 75,
                grid: { color: '#E2E8F0' }
              },
              x: {
                grid: { display: false }
              }
            }
          }
        });
      }

      // 3. Radar de Áreas 2026: Sagrada vs Colombia (Slide 3)
      let chartRadar = null;
      const ctxRadar = document.getElementById('chartRadarAreas');
      if (ctxRadar) {
        chartRadar = new Chart(ctxRadar, {
          type: 'radar',
          data: {
            labels: ['Matemáticas', 'Lectura Crítica', 'Ciencias Naturales', 'Sociales y Ciudadanas', 'Inglés'],
            datasets: [
              {
                label: 'Sagrada Sabiduría (2026)',
                data: [59, 64, 62, 60, 69],
                borderColor: '#0284C7',
                backgroundColor: 'rgba(2, 132, 199, 0.18)',
                borderWidth: 2.5,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#0284C7',
                pointRadius: 4
              },
              {
                label: 'Promedio Nacional Colombia',
                data: [52, 54, 50, 49, 52],
                borderColor: '#64748B',
                backgroundColor: 'rgba(100, 116, 139, 0.08)',
                borderWidth: 2,
                borderDash: [4, 4],
                pointBackgroundColor: '#64748B',
                pointRadius: 3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 12, font: { weight: '700' } } }
            },
            scales: {
              r: {
                min: 40,
                max: 75,
                ticks: { display: false, stepSize: 10 },
                grid: { color: '#E2E8F0' },
                angleLines: { color: '#E2E8F0' },
                pointLabels: {
                  color: '#182334',
                  font: { size: 11, weight: '700' }
                }
              }
            }
          }
        });
      }

      // ===== FUNCIÓN DE FILTRADO INTERACTIVO DE ÁREA (SLIDE 3) =====
      function applyAreaFilter(code) {
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

          if (titleEl) titleEl.textContent = `Radiografía de ${d.name}: Trayectoria Trienal y Entorno 2026`;
          if (subEl) subEl.textContent = `Evolución histórica institucional frente a Colombia, Soledad y Grupo de Comparación`;
          if (btnReset) btnReset.style.display = 'inline-block';

          // Mostrar Ficha de Diagnóstico y Ocultar Radar
          if (radarBox) radarBox.style.display = 'none';
          if (detailBox) {
            detailBox.style.display = 'block';
            document.getElementById('detailAreaName').textContent = `${d.icon} ${d.name} (${d.score2026} pts)`;
            document.getElementById('detailAreaBadge').textContent = d.diffCol;
            document.getElementById('detailAreaDiag').textContent = d.diag;
            document.getElementById('detailAreaLevels').textContent = d.levels;

            const btnGoDCE = document.getElementById('btnGoDCEArea');
            if (btnGoDCE) {
              btnGoDCE.onclick = () => selectDceArea(code);
            }
          }

          if (radarTitle) radarTitle.textContent = `Ficha Estratégica: ${d.name}`;
          if (radarSub) radarSub.textContent = `Diagnóstico institucional y foco pedagógico para la Meta 2027`;

          // Actualizar gráfico de barras con la comparativa del área
          if (chartAreas) {
            chartAreas.data.labels = d.labels;
            chartAreas.data.datasets = [
              {
                label: `Puntaje ${d.name}`,
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
      }

      // Event listeners para los botones de píldora
      document.querySelectorAll('.area-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => applyAreaFilter(btn.dataset.areaCode));
      });

      // Event listeners para las tarjetas inferiores
      document.querySelectorAll('.area-mini-card').forEach(card => {
        card.addEventListener('click', () => applyAreaFilter(card.dataset.areaCode));
      });

      // Botón para resetear filtro de área
      const btnResetArea = document.getElementById('btnResetAreaFilter');
      if (btnResetArea) {
        btnResetArea.addEventListener('click', () => applyAreaFilter('all'));
      }

      // 4. Comparativa de Rezago (% en Nivel 1)
      
      // Inicializar DCE en Slide 5
      renderDCE('mat');
      document.querySelectorAll('.dce-area-btn').forEach(btn => {
        btn.addEventListener('click', () => renderDCE(btn.dataset.dce));
      });

      const ctxRezago = document.getElementById('chartComparativaRezago');
      if (ctxRezago) {
        new Chart(ctxRezago, {
          type: 'bar',
          data: {
            labels: ['Lectura Crítica', 'C. Naturales', 'Matemáticas', 'Sociales'],
            datasets: [
              {
                label: 'Sagrada Sabiduría (2026)',
                data: [0, 0, 0, 0],
                backgroundColor: '#10B981',
                borderRadius: 5
              },
              {
                label: 'Promedio Colombia (% en Nivel 1)',
                data: [9, 18, 13, 19],
                backgroundColor: '#FF3B69',
                borderRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { boxWidth: 12, font: { weight: '700' } } },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}% de estudiantes en Nivel 1`
                }
              }
            },
            scales: {
              y: {
                min: 0,
                max: 25,
                grid: { color: '#E2E8F0' },
                ticks: {
                  callback: (v) => v + '%'
                }
              },
              x: {
                grid: { display: false }
              }
            }
          }
        });
      }

      // 5. Simulador Interactivo de Crecimiento en Slide 6
      const slider = document.getElementById('simSlider');
      const labelAlumnos = document.getElementById('simAlumnosLabel');
      const valMat = document.getElementById('simMatVal');
      const valGlobal = document.getElementById('simGlobalVal');

      if (slider && labelAlumnos && valMat && valGlobal) {
        slider.addEventListener('input', () => {
          const migrados = parseInt(slider.value, 10);
          labelAlumnos.textContent = migrados;
          const newMat = 59 + Math.round(migrados * 1.5);
          valMat.textContent = `${newMat} pts`;
          const newGlobal = 309 + Math.round(migrados * 2.16);
          valGlobal.textContent = `${newGlobal} pts`;
        });
      }

      // Interactividad con las 4 fases de metodología
      document.querySelectorAll('.phase-tab-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.phase-tab-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
      });
    });
  