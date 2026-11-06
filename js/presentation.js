/**
 * ==========================================================================
 * PRESENTACIÓN EJECUTIVA: COMPETENCIAS CIUDADANAS
 * COLEGIO SAGRADA SABIDURÍA • GRUPO EDÚCATE COLOMBIA
 * Lógica modular, datos oficiales Figura 5.4 ICFES 2026, paleta Dashboard
 * ==========================================================================
 */

// 1. OBJETO DE DATOS OFICIALES Y CONTENIDO DE LAS DIAPOSITIVAS
const PRESENTATION_DATA = {
  institucion: {
    nombre: "Colegio Sagrada Sabiduría",
    dane: "308758002793",
    municipio: "Soledad, Atlántico",
    fecha: "Noviembre 2026",
    facilitador: "Grupo Edúcate Colombia",
    lema: "La pedagogía no se decreta, se construye en equipo"
  },
  
  // Slide 2: Triangulación ICFES 2024-2026
  reconocimiento: {
    kpis: {
      global: { valor: 309, etiqueta: "Puntaje Global 2026", detalle: "Nivel Muy Superior (+51 pts sobre Colombia y +55 sobre Soledad)", delta: "+6 pts vs 2025" },
      rezago: { valor: "0%", etiqueta: "En Nivel 1 (Rezago Crítico)", detalle: "Erradicación total del rezago en las 4 áreas académicas", delta: "100% de la cohorte" },
      sociales: { valor: 60, etiqueta: "Sociales y Ciudadanas", detalle: "Trayectoria en ascenso sostenido: 57 → 59 → 60 pts", delta: "+3 pts trienal" }
    },
    historicoAreas: {
      areas: ["Matemáticas", "Lectura Crítica", "C. Naturales", "Sociales y Ciudadanas", "Inglés"],
      anios: ["2024", "2025", "2026"],
      series: {
        "2024": [63, 64, 59, 57, 68],
        "2025": [60, 62, 60, 59, 66],
        "2026": [59, 64, 62, 60, 69],
        "colombia2026": [52, 53, 50, 49, 52]
      }
    }
  },

  // Slide 3: El Foco Estratégico (Niveles y Aprendizajes Oficiales Figura 5.4 ICFES)
  focoEstrategico: {
    nivelesSociales: {
      labels: ["Nivel 1 (Rezago)", "Nivel 2 (Básico)", "Nivel 3 (Satisfactorio)", "Nivel 4 (Avanzado)"],
      data: [0, 35, 48, 17],
      colores: ["#FF3B69", "#F59E0B", "#0284C7", "#10B981"] // Paleta oficial Dashboard
    },
    metaClave: "El reto pedagógico: Movilizar el 35% de estudiantes de Nivel 2 hacia los Niveles 3 y 4. Con cero rezago en Nivel 1, este tercio de la cohorte es la gran palanca institucional: pasar 4 de estos estudiantes al Nivel 3 catapulta el promedio del área a 63+ puntos y el Global por encima de 315 puntos.",
    
    // Datos 100% fieles a la Figura 5.4 del Reporte ICFES 2026 del Colegio
    aprendizajesCriticos: [
      {
        id: "espacio-temporal",
        titulo: "Dimensión Espacial y Temporal",
        nombreOficial: "Comprende dimensiones espaciales y temporales de eventos, problemáticas y prácticas sociales",
        competencia: "Pensamiento Social y Geográfico",
        tasaErrorEE: "40%",
        tasaErrorCol: "55%",
        tasaErrorETC: "57%",
        semaforo: "naranja", // Naranja oficial en el EE (40%)
        badge: "Oportunidad Prioritaria (40% Error EE • Naranja)",
        diagnostico: "Es el único aprendizaje del colegio en rango NARANJA (≥40% de respuestas incorrectas). A los estudiantes les cuesta correlacionar mapas temáticos, dinámicas geopolíticas y secuencias temporales históricas.",
        accionAula: "Superposición de cartografía histórica interactiva, análisis de mapas de Soledad/Atlántico y líneas de tiempo con procesos sincrónicos y diacrónicos."
      },
      {
        id: "evaluacion-fuentes",
        titulo: "Evaluación de Fuentes y Argumentos",
        nombreOficial: "Contextualiza y evalúa usos de fuentes y argumentos",
        competencia: "Pensamiento Reflexivo",
        tasaErrorEE: "35%",
        tasaErrorCol: "53%",
        tasaErrorETC: "55%",
        semaforo: "amarillo", // Amarillo oficial en el EE (35% vs 53% en Colombia)
        badge: "En Seguimiento (35% Error EE vs 53% Colombia)",
        diagnostico: "En Colombia el 53% de los estudiantes falla en esta tarea (Naranja nacional). El Colegio Sagrada Sabiduría supera ampliamente al país con solo 35% de error (Amarillo), pero subsiste el reto de afinar la detección de sesgos y fuentes dudosas.",
        accionAula: "Cotejo crítico de fuentes primarias vs. secundarias, verificación de intencionalidad discursiva y análisis de noticias de coyuntura."
      },
      {
        id: "modelos-conceptuales",
        titulo: "Modelos Conceptuales y Contextos",
        nombreOficial: "Comprende modelos conceptuales, sus características y contextos de aplicación",
        competencia: "Interpretación y Análisis",
        tasaErrorEE: "33%",
        tasaErrorCol: "49%",
        tasaErrorETC: "50%",
        semaforo: "amarillo",
        badge: "En Seguimiento (33% Error EE vs 49% Colombia)",
        diagnostico: "Identificación de conceptos teóricos fundamentales de la ciencia política y la economía (Estado Social de Derecho, soberanía, inflación, separación de poderes) aplicados a hechos cotidianos.",
        accionAula: "Glosario analítico aplicado a estudios de caso y dilemas constitucionales de la vida real."
      },
      {
        id: "usos-sociales",
        titulo: "Usos Sociales de las Ciencias Sociales",
        nombreOficial: "Evalúa usos sociales de las ciencias sociales",
        competencia: "Pensamiento Reflexivo y Sistémico",
        tasaErrorEE: "20%",
        tasaErrorCol: "45%",
        tasaErrorETC: "46%",
        semaforo: "amarillo",
        badge: "Cercano a Fortaleza (20% Error EE vs 45% Colombia)",
        diagnostico: "Evaluar el impacto de políticas públicas, modelos económicos y mecanismos de participación ciudadana en el bienestar colectivo.",
        accionAula: "Simulaciones de audiencias públicas y análisis del impacto comunitario de proyectos locales."
      },
      {
        id: "multiperspectivismo",
        titulo: "Perspectivas de Actores y Grupos",
        nombreOficial: "Comprende perspectivas de distintos actores y grupos sociales",
        competencia: "Multiperspectivismo",
        tasaErrorEE: "18%",
        tasaErrorCol: "43%",
        tasaErrorETC: "46%",
        semaforo: "verde", // Verde oficial en el EE (< 20%)
        badge: "Gran Fortaleza (18% Error EE • Verde)",
        diagnostico: "Desempeño sobresaliente: el 82% de los estudiantes del colegio domina la comprensión de posturas encontradas en conflictos sociales, frente al 43% de error en Colombia y 46% en Soledad.",
        accionAula: "Juegos de roles y análisis de dilemas éticos y constitucionales desde múltiples orillas ideológicas."
      },
      {
        id: "multicausalidad",
        titulo: "Relaciones Multidimensionales (Multicausalidad)",
        nombreOficial: "Comprende que los problemas y sus soluciones involucran distintas dimensiones y reconoce relaciones entre estas",
        competencia: "Pensamiento Reflexivo y Sistémico",
        tasaErrorEE: "14%",
        tasaErrorCol: "43%",
        tasaErrorETC: "46%",
        semaforo: "verde", // ¡14% de error en el Colegio Sagrada Sabiduría!
        badge: "Máxima Fortaleza (14% Error EE • Verde)",
        diagnostico: "¡El mejor resultado del colegio en toda la prueba! Solo el 14% de respuestas incorrectas (vs 43% en Colombia y 46% en Soledad). El 86% de los estudiantes articula con éxito dimensiones políticas, económicas y culturales.",
        accionAula: "Continuar el abordaje interdisciplinar y usar esta fortaleza cognitiva para apalancar el análisis territorial y la evaluación de fuentes."
      }
    ]
  },

  // Slide 4: Desmitificación de las Competencias Ciudadanas (3 Tabs)
  desmitificacion: {
    pregunta: "¿Es responsabilidad exclusiva del docente de Sociales?",
    respuesta: "NO: Es un constructo transversal que se nutre y evalúa desde todas las áreas del saber.",
    tabs: [
      {
        id: "pensamiento-social",
        nombre: "1. Pensamiento Social",
        icono: "fa-landmark",
        definicion: "Comprender conceptos básicos, normas, principios constitucionales y los mecanismos institucionales del Estado.",
        articulacionAreas: [
          { area: "Matemáticas", aporte: "Lectura crítica de estadísticas de pobreza, IPC, distribución de regalías e impuestos." },
          { area: "Lenguaje", aporte: "Análisis semántico del texto constitucional y comprensión de leyes o decretos normativos." },
          { area: "Ciencias", aporte: "Comprensión de tratados ambientales, políticas de salud pública y bioseguridad del Estado." }
        ],
        preguntaTipo: "¿Qué principio constitucional fundamenta la priorización de recursos hídricos para consumo humano antes que para actividades extractivas?"
      },
      {
        id: "multiperspectivismo",
        nombre: "2. Multiperspectivismo",
        icono: "fa-people-arrows",
        definicion: "Reconocer y contrastar los intereses, emociones, valores y argumentos de distintos actores en una situación de tensión.",
        articulacionAreas: [
          { area: "Ciencias Naturales", aporte: "Dilemas de transición energética: la postura de la petrolera vs. la comunidad ancestral vs. el consumidor urbano." },
          { area: "Lenguaje / Literatura", aporte: "Análisis de polifonía y motivaciones dispares de personajes en narrativas del conflicto." },
          { area: "Educación Física / Artes", aporte: "Resolución de discrepancias arbitrales, juego limpio y respeto a la diversidad expresiva." }
        ],
        preguntaTipo: "Frente a una huelga de transporte que exige tarifas justas pero impide llegar al hospital, ¿qué intereses legítimos colisionan?"
      },
      {
        id: "pensamiento-reflexivo",
        nombre: "3. Pensamiento Reflexivo",
        icono: "fa-brain",
        definicion: "Evaluar la solidez de argumentos, detectar falacias, valorar fuentes y sopesar efectos no deseados de las decisiones.",
        articulacionAreas: [
          { area: "Matemáticas", aporte: "Identificar cuando un gráfico engañoso (eje Y truncado) manipula la percepción del electorado." },
          { area: "Ciencias Naturales", aporte: "Evaluar evidencias empíricas frente a mitos pseudocientíficos o fake news virales." },
          { area: "Filosofía / Ética", aporte: "Desmontar falacias ad hominem o de falsa causalidad en el debate democrático." }
        ],
        preguntaTipo: "Si una medida de pico y placa aumenta la compra de segundos vehículos más antiguos, ¿qué efecto colateral no previsto ocurrió?"
      }
    ]
  },

  // Slide 5: Demostración Práctica Transversal (Caso: El Agua)
  casoPractico: {
    problema: "Escasez severa de agua potable y racionamiento rotativo en el municipio de Soledad / barrio circunvecino.",
    columnas: [
      {
        area: "Matemáticas",
        competenciaSaber: "Razonamiento Cuantitativo",
        icono: "fa-calculator",
        color: "#0284C7",
        meta: "Modelar el consumo por habitante y el impacto tarifario según estratos socioeconómicos.",
        actividad: "Los estudiantes calculan el consumo diario per cápita (L/persona/día), proyectan la curva de agotamiento del tanque comunal y construyen un modelo tarifario progresivo que incentive el ahorro.",
        preguntaOrientadora: "¿Cómo una tarifa escalonada por m³ desincentiva el derroche sin vulnerar el mínimo vital de agua para familias de bajos recursos?",
        evidencia: "Gráfico de dispersión y propuesta de subsidio cruzado validada matemáticamente."
      },
      {
        area: "Ciencias Naturales",
        competenciaSaber: "Uso Comprensivo del Conocimiento e Indagación",
        icono: "fa-flask-vial",
        color: "#10B981",
        meta: "Evaluar el impacto en el ecosistema hídrico y la calidad biológica/química del agua de reserva.",
        actividad: "Los estudiantes analizan muestras de agua de almacenamiento casero (turbidez, pH, cloro residual, riesgo de larvas de dengue) y comparan la huella hídrica de actividades industriales vs. residenciales.",
        preguntaOrientadora: "¿Qué factores bióticos y abióticos transforman el agua acumulada en un riesgo epidemiológico para la comunidad infantil?",
        evidencia: "Informe técnico de laboratorio escolar con protocolo casero de desinfección biosegura."
      },
      {
        area: "Sociales y Ciudadanas",
        competenciaSaber: "Multiperspectivismo y Reflexión Sistémica",
        icono: "fa-scale-balanced",
        color: "#F59E0B",
        meta: "Analizar el conflicto entre el derecho fundamental al agua vs. la continuidad de la actividad productiva.",
        actividad: "Simulación de una mesa de concertación: los estudiantes representan a la Empresa de Servicios, Junta de Acción Comunal, Industriales locales y Defensoría del Pueblo.",
        preguntaOrientadora: "¿Qué mecanismo de protección constitucional (Tutela o Acción Popular) procede y qué acuerdo equilibra el empleo local y la dignidad humana?",
        evidencia: "Acta de mediación con compromisos vinculantes fundamentados en el bloque de constitucionalidad."
      }
    ]
  },

  // Slide 6: Matriz de Integración PMI Editable (Taller Ágil de 1 Página)
  matrizPMI: {
    ejemplosPrecargados: {
      mat: {
        nombre: "Matemáticas (Servicios Públicos)",
        area: "Matemáticas y Razonamiento Cuantitativo",
        situacion: "Diferencias en los cobros de energía y agua en recibos domiciliarios de familias del sector.",
        pregunta: "¿Cómo interpretar las variaciones de consumo en barras e identificar si un cobro estimado vulnera los derechos del usuario?",
        evidencia: "Hoja de cálculo con balance de consumos reales y formato de reclamación fundamentado con cifras."
      },
      len: {
        nombre: "Lenguaje (Desinformación y Fake News)",
        area: "Lenguaje y Humanidades",
        situacion: "Circulación masiva de cadenas de WhatsApp sobre supuesta contaminación del acueducto que genera pánico.",
        pregunta: "¿Qué marcas discursivas y ausencias de fuentes permiten distinguir una noticia falsa de un comunicado de prensa oficial?",
        evidencia: "Ficha de curaduría de contenidos comparando el bulo con el reporte del laboratorio de salud municipal."
      },
      cn: {
        nombre: "Ciencias Naturales (Manejo de Residuos)",
        area: "Ciencias Naturales y CTS",
        situacion: "Taponamiento de canales pluviales del barrio por botellas plásticas durante la temporada de lluvias.",
        pregunta: "¿Cómo interactúa la degradación química de microplásticos con el derecho constitucional a un ambiente sano?",
        evidencia: "Prototipo de trampa comunitaria de sólidos y acuerdo de reciclaje con recicladores de oficio."
      },
      ing: {
        nombre: "Inglés (Cambio Climático y ODS)",
        area: "Inglés / Lengua Extranjera",
        situacion: "Análisis de metas locales frente al ODS 6 (Clean Water and Sanitation) en foros juveniles internacionales.",
        pregunta: "¿How can high school students propose actionable solutions in English to promote responsible water stewardship?",
        evidencia: "Infografía bilingüe tipo pitch para redes sociales sobre consumo consciente del recurso."
      }
    }
  },

  // Slide 7: Ruta de Implementación en 3 Fases
  rutaImplementacion: {
    fases: [
      {
        fase: "Fase 1",
        tiempo: "Noviembre - Diciembre 2026",
        titulo: "Apropiación en el Cierre del PMI",
        enfoque: "0% Sobrecarga docente: Articulación sin crear asignaturas adicionales.",
        icono: "fa-seedling",
        color: "#0284C7",
        entregables: [
          "Socialización de la triangulación ICFES 2024-2026 en el Comité Directivo.",
          "Presentación del modelo de Matriz Transversal de 1 página a los jefes de área.",
          "Inclusión formal del reto 'Movilización del Nivel 2 al Nivel 3 y 4' en el PMI 2027."
        ]
      },
      {
        fase: "Fase 2",
        tiempo: "Enero - Febrero 2027",
        titulo: "Alineación Microcurricular por Áreas",
        enfoque: "Integración en planes de periodo existentes.",
        icono: "fa-puzzle-piece",
        color: "#10B981",
        entregables: [
          "Cada área define 1 situación problema contextualizada por periodo académico.",
          "Diseño de rúbricas de aula con foco en Multicausalidad y Pensamiento Reflexivo.",
          "Banco de preguntas contextualizadas tipo Saber 11 en las evaluaciones periódicas."
        ]
      },
      {
        fase: "Fase 3",
        tiempo: "Marzo - Octubre 2027",
        titulo: "Monitoreo Formativo y Consolidación",
        enfoque: "Medición diagnóstica continua y ajustes ágiles.",
        icono: "fa-chart-line-up",
        color: "#8B5CF6",
        entregables: [
          "Aplicación de simulacros diagnósticos Saber 11 con retroalimentación por evidencias.",
          "Clínica de errores en tareas de Multicausalidad y Cartografía.",
          "Consolidación de la meta institucional: Sociales ≥ 64 pts y Global ≥ 315 pts."
        ]
      }
    ]
  }
};

// 2. CONTROLADOR DE LA PRESENTACIÓN (SLIDE DECK CONTROLLER CON AUTO-HIDE INTELIGENTE)
class SlideDeckController {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 7;
    this.slideElements = [];
    this.charts = {};
    this.autoHideTimer = null;
    
    this.initElements();
    this.initEvents();
    this.initTouchSupport();
    this.initAutoHideControls();
    this.handleInitialHash();
  }

  initElements() {
    this.slideElements = Array.from(document.querySelectorAll('.slide'));
    this.progressBar = document.getElementById('topProgressBar');
    this.sectionBadge = document.getElementById('activeSectionBadge');
    
    // Controles superiores en el Header
    this.headerBtnPrev = document.getElementById('headerBtnPrev');
    this.headerBtnNext = document.getElementById('headerBtnNext');
    this.headerSlideCounter = document.getElementById('headerSlideCounter');
    this.headerCurrentSlide = document.getElementById('headerCurrentSlide');
    this.headerTotalSlides = document.getElementById('headerTotalSlides');

    // Controles inferiores flotantes
    this.deckBottomControls = document.getElementById('deckBottomControls');
    this.btnPrev = document.getElementById('btnPrevSlide');
    this.btnNext = document.getElementById('btnNextSlide');
    this.navDotsContainer = document.getElementById('navDotsContainer');
    
    if (this.headerTotalSlides) this.headerTotalSlides.textContent = String(this.totalSlides).padStart(2, '0');

    // Construir dots de navegación inferior
    if (this.navDotsContainer) {
      this.navDotsContainer.innerHTML = '';
      for (let i = 1; i <= this.totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `nav-dot ${i === 1 ? 'active' : ''}`;
        dot.setAttribute('title', `Ir a Diapositiva ${i}`);
        dot.addEventListener('click', () => this.goToSlide(i));
        this.navDotsContainer.appendChild(dot);
      }
    }
  }

  initEvents() {
    if (this.headerBtnPrev) this.headerBtnPrev.addEventListener('click', () => this.prev());
    if (this.headerBtnNext) this.headerBtnNext.addEventListener('click', () => this.next());
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prev());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.next());

    window.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.isContentEditable) {
        if (e.key === 'Escape') document.activeElement.blur();
        return;
      }
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prev();
          break;
        case ' ':
          e.preventDefault();
          this.next();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(1);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullScreen();
          break;
      }
    });

    const btnFullscreen = document.getElementById('btnToggleFullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullScreen());
    }

    const btnPrint = document.getElementById('btnPrintDeck');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

    window.addEventListener('hashchange', () => {
      const match = window.location.hash.match(/slide-(\d+)/);
      if (match) {
        const target = parseInt(match[1], 10);
        if (target >= 1 && target <= this.totalSlides && target !== this.currentSlide) {
          this.goToSlide(target, false);
        }
      }
    });
  }

  initAutoHideControls() {
    const showControls = () => {
      if (this.deckBottomControls) {
        this.deckBottomControls.classList.remove('auto-hidden');
      }
      this.resetAutoHideTimer();
    };

    window.addEventListener('mousemove', () => showControls(), { passive: true });
    window.addEventListener('touchstart', () => showControls(), { passive: true });

    if (this.deckBottomControls) {
      this.deckBottomControls.addEventListener('mouseenter', () => {
        clearTimeout(this.autoHideTimer);
        this.deckBottomControls.classList.remove('auto-hidden');
      });

      this.deckBottomControls.addEventListener('mouseleave', () => {
        this.resetAutoHideTimer();
      });
    }

    this.resetAutoHideTimer();
  }

  resetAutoHideTimer() {
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      if (this.deckBottomControls) {
        this.deckBottomControls.classList.add('auto-hidden');
      }
    }, 2200);
  }

  initTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }

  handleInitialHash() {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (match) {
      const target = parseInt(match[1], 10);
      if (target >= 1 && target <= this.totalSlides) {
        this.goToSlide(target, false);
        return;
      }
    }
    this.goToSlide(1, false);
  }

  goToSlide(slideIndex, updateHash = true) {
    if (slideIndex < 1 || slideIndex > this.totalSlides) return;
    
    this.currentSlide = slideIndex;

    this.slideElements.forEach((el, index) => {
      const isActive = (index + 1) === this.currentSlide;
      el.classList.toggle('active', isActive);
      if (isActive) {
        el.setAttribute('tabindex', '0');
      } else {
        el.removeAttribute('tabindex');
      }
    });

    const progressPercent = ((this.currentSlide) / this.totalSlides) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${progressPercent}%`;
    }

    if (this.headerCurrentSlide) {
      this.headerCurrentSlide.textContent = String(this.currentSlide).padStart(2, '0');
    }

    const isFirst = (this.currentSlide === 1);
    const isLast = (this.currentSlide === this.totalSlides);

    if (this.headerBtnPrev) this.headerBtnPrev.disabled = isFirst;
    if (this.headerBtnNext) this.headerBtnNext.disabled = isLast;
    if (this.btnPrev) this.btnPrev.disabled = isFirst;
    if (this.btnNext) this.btnNext.disabled = isLast;

    if (this.navDotsContainer) {
      const dots = this.navDotsContainer.querySelectorAll('.nav-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', (idx + 1) === this.currentSlide);
      });
    }

    const currentSlideEl = this.slideElements[this.currentSlide - 1];
    if (currentSlideEl && this.sectionBadge) {
      const sectionName = currentSlideEl.dataset.sectionTitle || `Diapositiva ${this.currentSlide}`;
      this.sectionBadge.textContent = sectionName;
    }

    if (updateHash) {
      window.location.hash = `slide-${this.currentSlide}`;
    }

    const viewport = document.querySelector('.slides-viewport');
    if (viewport) viewport.scrollTop = 0;

    this.resetAutoHideTimer();
    this.onSlideActivated(this.currentSlide);
  }

  next() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  prev() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  onSlideActivated(slideNumber) {
    if (slideNumber === 2) {
      chartsManager.initSlide2Chart();
    } else if (slideNumber === 3) {
      chartsManager.initSlide3Donut();
    }
  }
}

// 3. GESTOR DE GRÁFICOS (CHART.JS CON PALETA OFICIAL DASHBOARD SABER 11°)
class ChartsManager {
  constructor() {
    this.chartSlide2 = null;
    this.chartSlide3 = null;
  }

  initSlide2Chart(mode = 'evolution') {
    const ctx = document.getElementById('chartHistoricoAreas');
    if (!ctx) return;

    if (this.chartSlide2) {
      this.chartSlide2.destroy();
    }

    const d = PRESENTATION_DATA.reconocimiento.historicoAreas;

    if (mode === 'evolution') {
      this.chartSlide2 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: d.areas,
          datasets: [
            {
              label: '2024',
              data: d.series['2024'],
              backgroundColor: '#94A3B8',
              borderRadius: 6,
              barPercentage: 0.75
            },
            {
              label: '2025',
              data: d.series['2025'],
              backgroundColor: '#F59E0B',
              borderRadius: 6,
              barPercentage: 0.75
            },
            {
              label: '2026 (Récord 309 pts)',
              data: d.series['2026'],
              backgroundColor: '#0284C7',
              borderRadius: 6,
              barPercentage: 0.75
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#1E293B',
                font: { family: 'Plus Jakarta Sans', weight: '700', size: 12 },
                boxWidth: 14,
                boxHeight: 14,
                useBorderRadius: true,
                borderRadius: 4
              }
            },
            tooltip: {
              backgroundColor: '#182334',
              titleColor: '#FFFFFF',
              bodyColor: '#E2E8F0',
              borderColor: '#334155',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (c) => ` ${c.dataset.label}: ${c.raw} puntos`
              }
            }
          },
          scales: {
            y: {
              min: 45,
              max: 75,
              grid: { color: '#E2E8F0' },
              ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans', weight: '600' } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#1E293B', font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 } }
            }
          }
        }
      });
    } else {
      this.chartSlide2 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: d.areas,
          datasets: [
            {
              label: 'Colegio Sagrada Sabiduría (2026)',
              data: d.series['2026'],
              backgroundColor: '#10B981',
              borderRadius: 6,
              barPercentage: 0.7
            },
            {
              label: 'Promedio Nacional Colombia (2026)',
              data: d.series['colombia2026'],
              backgroundColor: '#FF3B69',
              borderRadius: 6,
              barPercentage: 0.7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#1E293B',
                font: { family: 'Plus Jakarta Sans', weight: '700', size: 12 },
                boxWidth: 14,
                boxHeight: 14,
                useBorderRadius: true,
                borderRadius: 4
              }
            },
            tooltip: {
              backgroundColor: '#182334',
              titleColor: '#FFFFFF',
              bodyColor: '#E2E8F0',
              borderColor: '#334155',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (c) => ` ${c.dataset.label}: ${c.raw} pts (Ventaja: +${c.raw - (c.datasetIndex === 0 ? d.series['colombia2026'][c.dataIndex] : 0)} pts)`
              }
            }
          },
          scales: {
            y: {
              min: 40,
              max: 75,
              grid: { color: '#E2E8F0' },
              ticks: { color: '#64748B' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#1E293B', font: { family: 'Plus Jakarta Sans', weight: '700' } }
            }
          }
        }
      });
    }
  }

  initSlide3Donut() {
    const ctx = document.getElementById('chartNivelesSociales');
    if (!ctx) return;

    if (this.chartSlide3) {
      this.chartSlide3.destroy();
    }

    const d = PRESENTATION_DATA.focoEstrategico.nivelesSociales;

    this.chartSlide3 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: d.labels,
        datasets: [{
          data: d.data,
          backgroundColor: d.colores,
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#1E293B',
              font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
              padding: 12,
              boxWidth: 11,
              boxHeight: 11,
              useBorderRadius: true,
              borderRadius: 3
            }
          },
          tooltip: {
            backgroundColor: '#182334',
            padding: 12,
            callbacks: {
              label: (c) => ` ${c.label}: ${c.raw}% de los estudiantes`
            }
          }
        }
      }
    });
  }
}

// 4. GESTOR DE CARACTERÍSTICAS INTERACTIVAS
class InteractiveManager {
  constructor() {
    this.initSlide2Controls();
    this.initSlide3Filters();
    this.initSlide4Tabs();
    this.initSlide5Accordion();
    this.initSlide6Matrix();
  }

  initSlide2Controls() {
    const btnEvolution = document.getElementById('btnViewEvolution');
    const btnCompareCol = document.getElementById('btnViewCompareCol');

    if (btnEvolution && btnCompareCol) {
      btnEvolution.addEventListener('click', () => {
        btnEvolution.classList.add('bg-blue-600', 'text-white');
        btnEvolution.classList.remove('bg-slate-100', 'text-slate-700');
        btnCompareCol.classList.remove('bg-blue-600', 'text-white');
        btnCompareCol.classList.add('bg-slate-100', 'text-slate-700');
        chartsManager.initSlide2Chart('evolution');
      });

      btnCompareCol.addEventListener('click', () => {
        btnCompareCol.classList.add('bg-blue-600', 'text-white');
        btnCompareCol.classList.remove('bg-slate-100', 'text-slate-700');
        btnEvolution.classList.remove('bg-blue-600', 'text-white');
        btnEvolution.classList.add('bg-slate-100', 'text-slate-700');
        chartsManager.initSlide2Chart('compare');
      });
    }
  }

  initSlide3Filters() {
    const filterChips = document.querySelectorAll('.crit-learning-chip');
    const detailTitle = document.getElementById('critDetailTitle');
    const detailBadge = document.getElementById('critDetailBadge');
    const detailCompetencia = document.getElementById('critDetailCompetencia');
    const detailDiagnostico = document.getElementById('critDetailDiagnostico');
    const detailAccion = document.getElementById('critDetailAccion');
    const detailStatsRow = document.getElementById('critDetailStatsRow');

    const learningsMap = {};
    PRESENTATION_DATA.focoEstrategico.aprendizajesCriticos.forEach(item => {
      learningsMap[item.id] = item;
    });

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.dataset.critId;
        const data = learningsMap[key];
        if (data && detailTitle) {
          detailTitle.textContent = data.titulo;
          detailBadge.textContent = data.badge;
          detailBadge.className = `text-xs px-2.5 py-1 rounded-md font-extrabold uppercase ${
            data.semaforo === 'naranja' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
            data.semaforo === 'amarillo' ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' :
            'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`;
          detailCompetencia.textContent = `Competencia ICFES: ${data.competencia} • Aprendizaje Oficial: "${data.nombreOficial}"`;
          detailDiagnostico.textContent = data.diagnostico;
          detailAccion.textContent = data.accionAula;

          if (detailStatsRow) {
            detailStatsRow.innerHTML = `
              <span class="inline-flex items-center gap-1.5 font-bold ${data.semaforo === 'naranja' ? 'text-amber-700' : data.semaforo === 'amarillo' ? 'text-yellow-700' : 'text-emerald-700'}">
                <i class="fa-solid fa-school"></i> Colegio (EE): <strong>${data.tasaErrorEE} de error</strong>
              </span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-600">Colombia: <strong>${data.tasaErrorCol}</strong></span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-600">Soledad (ETC): <strong>${data.tasaErrorETC}</strong></span>
            `;
          }
        }
      });
    });
  }

  initSlide4Tabs() {
    const tabButtons = document.querySelectorAll('.desmit-tab-btn');
    const tabPanels = document.querySelectorAll('.desmit-tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tabTarget;

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`tab-panel-${targetId}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  initSlide5Accordion() {
    const cards = document.querySelectorAll('.transversal-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  initSlide6Matrix() {
    const tableBody = document.getElementById('matrixTableBody');
    const btnLoadMath = document.getElementById('btnLoadExampleMath');
    const btnLoadLang = document.getElementById('btnLoadExampleLang');
    const btnLoadNat = document.getElementById('btnLoadExampleNat');
    const btnAddRow = document.getElementById('btnAddMatrixRow');
    const btnCopy = document.getElementById('btnCopyMatrix');
    const btnDownload = document.getElementById('btnDownloadMatrix');

    const examples = PRESENTATION_DATA.matrizPMI.ejemplosPrecargados;

    const renderRow = (data) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-sky-700">
          <div contenteditable="true" class="matrix-cell-editable" title="Haz clic para editar el Área">${data.area}</div>
        </td>
        <td>
          <div contenteditable="true" class="matrix-cell-editable" title="Haz clic para editar la Situación Problema">${data.situacion}</div>
        </td>
        <td>
          <div contenteditable="true" class="matrix-cell-editable" title="Haz clic para editar la Pregunta Orientadora">${data.pregunta}</div>
        </td>
        <td>
          <div contenteditable="true" class="matrix-cell-editable" title="Haz clic para editar la Evidencia">${data.evidencia}</div>
        </td>
        <td class="text-right w-12">
          <button class="btn-delete-row text-slate-400 hover:text-rose-600 p-1 transition" title="Eliminar fila">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;

      tr.querySelector('.btn-delete-row').addEventListener('click', () => {
        tr.remove();
      });

      return tr;
    };

    const loadExample = (key) => {
      if (!tableBody || !examples[key]) return;
      tableBody.innerHTML = '';
      tableBody.appendChild(renderRow(examples[key]));
    };

    if (btnLoadMath) btnLoadMath.addEventListener('click', () => loadExample('mat'));
    if (btnLoadLang) btnLoadLang.addEventListener('click', () => loadExample('len'));
    if (btnLoadNat) btnLoadNat.addEventListener('click', () => loadExample('cn'));

    if (tableBody) {
      tableBody.innerHTML = '';
      tableBody.appendChild(renderRow(examples.mat));
      tableBody.appendChild(renderRow(examples.cn));
      tableBody.appendChild(renderRow(examples.len));
    }

    if (btnAddRow) {
      btnAddRow.addEventListener('click', () => {
        tableBody.appendChild(renderRow({
          area: "Nueva Área Curricular",
          situacion: "Escriba aquí la situación problema cotidiana...",
          pregunta: "Escriba aquí la pregunta orientadora Saber 11...",
          evidencia: "Escriba aquí la evidencia observable en el aula..."
        }));
      });
    }

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        let text = "MATRIZ DE INTEGRACIÓN TRANSVERSAL - COMPETENCIAS CIUDADANAS (PMI)\n";
        text += "Colegio Sagrada Sabiduría • Noviembre 2026\n\n";

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, i) => {
          const cells = row.querySelectorAll('.matrix-cell-editable');
          if (cells.length >= 4) {
            text += `FILA ${i + 1}:\n`;
            text += `• Área: ${cells[0].innerText.trim()}\n`;
            text += `• Situación Problema: ${cells[1].innerText.trim()}\n`;
            text += `• Pregunta Orientadora: ${cells[2].innerText.trim()}\n`;
            text += `• Evidencia Observable: ${cells[3].innerText.trim()}\n\n`;
          }
        });

        navigator.clipboard.writeText(text).then(() => {
          showToast("¡Matriz copiada al portapapeles! Lista para pegar en Word o Drive.");
        }).catch(() => {
          showToast("Error al copiar. Por favor seleccione y copie manualmente.");
        });
      });
    }

    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        let csv = 'Area,Situacion Problema,Pregunta Orientadora,Evidencia Observable\n';
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('.matrix-cell-editable');
          if (cells.length >= 4) {
            const clean = (t) => `"${t.innerText.replace(/"/g, '""').trim()}"`;
            csv += `${clean(cells[0])},${clean(cells[1])},${clean(cells[2])},${clean(cells[3])}\n`;
          }
        });

        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Matriz_Transversal_PMI_Sagrada_Sabiduria_${new Date().getFullYear()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Descargando archivo CSV para el PMI...");
      });
    }
  }
}

function showToast(msg) {
  let toast = document.getElementById('deckToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'deckToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

let deckController = null;
let chartsManager = null;
let interactiveManager = null;

document.addEventListener('DOMContentLoaded', () => {
  chartsManager = new ChartsManager();
  interactiveManager = new InteractiveManager();
  deckController = new SlideDeckController();
});
