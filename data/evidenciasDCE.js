/**
 * Base de Datos Oficial de Evidencias, Tareas y Diagnóstico DCE (Saber 11°)
 * Grupo Edúcate Colombia
 */
window.EVIDENCIAS_DCE = {
  // =========================================================================
  // COLEGIO SAGRADA SABIDURIA - DANE: 308758002793
  // =========================================================================
  "308758002793": {
    dane: "308758002793",
    nombre: "COLEGIO SAGRADA SABIDURIA",
    municipio: "SOLEDAD - ATLANTICO",
    etc: "SOLEDAD",
    gc: "GC 3 (Grupo de Comparación 3)",
    sector: "No oficial",
    zona: "Urbano",
    evaluados2026: 23,

    // FASE 1: Macro-Tendencias y Benchmark Trienal
    fase1: {
      global: {
        2024: { ee: 307, ee_sd: 49, gc: 268, etc: 255, col: 260 },
        2025: { ee: 303, ee_sd: 43, gc: 265, etc: 252, col: 256 },
        2026: { ee: 309, ee_sd: 41, gc: 266, etc: 254, col: 258 }
      },
      cohesion: {
        sd2024: 49,
        sd2025: 43,
        sd2026: 41,
        diagnostico: "Alta Homogeneidad y Reducción Continua de la Brecha Interna",
        interpretacion: "La institución ha reducido su desviación estándar de 49 a 41 puntos en tres años. Los estudiantes avanzan en bloque cohesionado, facilitando intervenciones colectivas de alto impacto desde grado 10° sin riesgo de rezago disperso."
      },
      erradicacionN1: {
        porcentajeN1: 0.0,
        areasErradas: ["Matemáticas", "Lectura Crítica", "Ciencias Naturales", "Sociales y Ciudadanas"],
        colombiaN1Promedio: 12.8,
        inglesAvanzado: 61 // % en B1 y B+
      }
    },

    // FASE 2: Radiografía por Áreas del Conocimiento (DCE)
    fase2: {
      mat: {
        nombre: "Matemáticas",
        icono: "📐",
        color: "#0284C7",
        promedio2026: 59,
        desv2026: 11,
        comparativo: { col: 52, etc: 51, gc: 53 },
        niveles: { n1: 0, n2: 26, n3: 57, n4: 17 },
        diagnosticoArea: "Área de máxima oportunidad de crecimiento institucional hacia 2027. Aunque supera al promedio nacional (52) y a la ETC Soledad (51), la concentración de respuestas en alerta naranja ofrece la palanca perfecta para ganar entre 8 y 12 puntos globales adicionales.",
        evidencias: [
          {
            aprendizaje: "Frente a un problema que involucre información cuantitativa, plantea e implementa estrategias que lleven a soluciones adecuadas.",
            competencia: "Formulación y Ejecución",
            ee_error: 54,
            col_error: 65,
            etc_error: 66,
            color: "naranja",
            estado: "Oportunidad Prioritaria (Naranja)",
            tareaCognitiva: "Traducir problemas del lenguaje verbal al lenguaje matemático formal: modelar restricciones simultáneas, plantear ecuaciones, proporcionalidad y optimización.",
            accionAula10: "Descomponer el enunciado en variables explícitas e incógnitas antes de operar mecánicamente. Ejercitar el modelado de ecuaciones y razones de cambio sin calculadora."
          },
          {
            aprendizaje: "Comprende y transforma la información cuantitativa y esquemática presentada en distintos formatos.",
            competencia: "Interpretación y Representación",
            ee_error: 43,
            col_error: 57,
            etc_error: 59,
            color: "naranja",
            estado: "Atención Focalizada (Naranja)",
            tareaCognitiva: "Extraer e interrelacionar datos desde tablas bidimensionales, diagramas de dispersión, histogramas y polígonos de frecuencia hacia modelos analíticos.",
            accionAula10: "Talleres continuos de lectura gráfica y conversión entre representaciones tabulares, gráficas y algebraicas."
          },
          {
            aprendizaje: "Valida procedimientos y estrategias matemáticas utilizadas para dar solución a problemas.",
            competencia: "Argumentación",
            ee_error: 44,
            col_error: 56,
            etc_error: 58,
            color: "naranja",
            estado: "Atención Focalizada (Naranja)",
            tareaCognitiva: "Juzgar la validez de un procedimiento algorítmico, detectar inconsistencias dimensionales y formular contraejemplos matemáticos.",
            accionAula10: "Pedagogía del error: exponer a los estudiantes a procedimientos resueltos con fallas típicas para que identifiquen y justifiquen por qué los distractores de la prueba son trampas."
          }
        ]
      },

      lec: {
        nombre: "Lectura Crítica",
        icono: "📖",
        color: "#E11D48",
        promedio2026: 64,
        desv2026: 7,
        comparativo: { col: 53, etc: 53, gc: 55 },
        niveles: { n1: 0, n2: 4, n3: 57, n4: 39 },
        diagnosticoArea: "Desempeño sobresaliente y pilar formativo del colegio. El 96% de los alumnos se ubica en los niveles 3 y 4 de dominio lector, con una desviación extremadamente baja (σ = 7 pts), demostrando madurez analítica generalizada.",
        evidencias: [
          {
            aprendizaje: "Identifica y entiende los contenidos locales que conforman un texto.",
            competencia: "Identificar y entender contenidos locales",
            ee_error: 16,
            col_error: 29,
            etc_error: 30,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Localizar información explícita, identificar el significado de palabras en contexto pragmático y reconocer relaciones semánticas locales.",
            accionAula10: "Mantener la práctica de lectura comprensiva y enriquecimiento de vocabulario académico interdisciplinar."
          },
          {
            aprendizaje: "Comprende cómo se articulan las partes de un texto para darle un sentido global.",
            competencia: "Comprender la articulación global",
            ee_error: 27,
            col_error: 47,
            etc_error: 47,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Identificar la estructura de un texto, la tesis principal, los argumentos de soporte y la progresión temática entre párrafos.",
            accionAula10: "Mapas de estructura argumentativa y deconstrucción de ensayos y artículos de divulgación científica."
          },
          {
            aprendizaje: "Reflexiona a partir de un texto y evalúa su contenido.",
            competencia: "Reflexión y Evaluación",
            ee_error: 32,
            col_error: 49,
            etc_error: 49,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Juzgar la validez y solidez de los argumentos, reconocer supuestos ideológicos, intenciones ocultas, tono y sesgos del autor.",
            accionAula10: "Debates intertextuales sobre textos filosóficos y columnas de opinión de alta complejidad contrastando posturas opuestas."
          }
        ]
      },

      soc: {
        nombre: "Sociales y Ciudadanas",
        icono: "🏛️",
        color: "#D97706",
        promedio2026: 60,
        desv2026: 9,
        comparativo: { col: 50, etc: 49, gc: 51 },
        niveles: { n1: 0, n2: 35, n3: 48, n4: 17 },
        diagnosticoArea: "Rendimiento consolidado con ascenso constante (57 → 59 → 60 pts). Supera por 10 puntos a Colombia (50) y a Soledad (49). Destaca un 0% de alumnos en Nivel 1 y un 65% en Niveles 3 y 4.",
        evidencias: [
          {
            aprendizaje: "Comprende que los problemas y sus soluciones involucran distintas dimensiones y reconoce relaciones entre estas.",
            competencia: "Pensamiento Reflexivo y Sistémico",
            ee_error: 14,
            col_error: 43,
            etc_error: 46,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Analizar problemáticas sociales articulando simultáneamente dimensiones económicas, políticas, culturales y ambientales.",
            accionAula10: "Continuar el abordaje interdisciplinar de coyunturas sociopolíticas nacionales y globales."
          },
          {
            aprendizaje: "Comprende perspectivas de distintos actores y grupos sociales.",
            competencia: "Multiperspectivismo",
            ee_error: 18,
            col_error: 43,
            etc_error: 46,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Identificar y contrastar intereses, motivaciones y posturas de diferentes actores en conflictos históricos o constitucionales.",
            accionAula10: "Juegos de roles y análisis de dilemas morales y constitucionales desde múltiples orillas ideológicas."
          },
          {
            aprendizaje: "Evalúa usos sociales de las ciencias sociales.",
            competencia: "Pensamiento Reflexivo y Sistémico",
            ee_error: 20,
            col_error: 45,
            etc_error: 46,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Evaluar el impacto de normas, políticas públicas y modelos económicos sobre el bienestar y la cohesión ciudadana.",
            accionAula10: "Estudios de caso sobre mecanismos de participación ciudadana y tutela de derechos fundamentales en Colombia."
          },
          {
            aprendizaje: "Comprende modelos conceptuales, sus características y contextos de aplicación.",
            competencia: "Interpretación y Análisis",
            ee_error: 33,
            col_error: 49,
            etc_error: 50,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Reconocer y aplicar conceptos clave de la ciencia política y la economía (Estado social de derecho, inflación, soberanía, división de poderes).",
            accionAula10: "Glosario analítico y aplicación de conceptos teóricos a hechos históricos contemporáneos."
          },
          {
            aprendizaje: "Contextualiza y evalúa usos de fuentes y argumentos.",
            competencia: "Pensamiento Social",
            ee_error: 35,
            col_error: 53,
            etc_error: 55,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Valorar la credibilidad de testimonios, discursos y fuentes históricas identificando intencionalidad y contexto temporal.",
            accionAula10: "Cotejo crítico de fuentes primarias vs. secundarias sobre el conflicto colombiano y la historia del siglo XX."
          },
          {
            aprendizaje: "Comprende dimensiones espaciales y temporales de eventos, problemáticas y prácticas sociales.",
            competencia: "Pensamiento Social y Geográfico",
            ee_error: 40,
            col_error: 55,
            etc_error: 57,
            color: "naranja",
            estado: "Oportunidad de Refuerzo (Naranja)",
            tareaCognitiva: "Ubicar transformaciones territoriales, fronteras históricas y procesos geopolíticos de larga duración.",
            accionAula10: "Trabajo intensivo con cartografía histórica, mapas temáticos y líneas de tiempo analíticas de procesos sociodemográficos."
          }
        ]
      },

      nat: {
        nombre: "Ciencias Naturales",
        icono: "🔬",
        color: "#059669",
        promedio2026: 62,
        desv2026: 9,
        comparativo: { col: 51, etc: 51, gc: 53 },
        niveles: { n1: 0, n2: 22, n3: 61, n4: 17 },
        diagnosticoArea: "Rendimiento sobresaliente (62 puntos), superando con amplitud a Colombia (51) y a Soledad (51). El 78% del grupo alcanza los niveles 3 y 4. Las oportunidades prioritarias radican en la explicación de fenómenos y deducción de conclusiones experimentales en física y biología.",
        evidencias: [
          {
            aprendizaje: "Utilizar algunas habilidades de pensamiento y de procedimiento para evaluar predicciones - Procesos químicos",
            competencia: "Indagación",
            ee_error: 10,
            col_error: 45,
            etc_error: 48,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Evaluar hipótesis y predecir variaciones en reacciones químicas y disoluciones con rigor metodológico.",
            accionAula10: "Mantener el trabajo práctico de diseño experimental y balance estequiométrico."
          },
          {
            aprendizaje: "Analizar el potencial del uso de recursos naturales o artefactos y sus efectos sobre el entorno y la salud - CTS",
            competencia: "Ciencia, Tecnología y Sociedad",
            ee_error: 11,
            col_error: 38,
            etc_error: 39,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Valorar impactos bioéticos, energéticos y ambientales de tecnologías e industrias en las comunidades.",
            accionAula10: "Continuar el enfoque crítico sobre sostenibilidad y transición energética."
          },
          {
            aprendizaje: "Asociar fenómenos naturales con conceptos propios del conocimiento científico - Procesos vivos",
            competencia: "Uso Comprensivo del Conocimiento",
            ee_error: 11,
            col_error: 29,
            etc_error: 31,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Identificar principios biológicos fundamentales en ciclos vitales, homeostasis y fisiología de organismos.",
            accionAula10: "Reforzar la vinculación de conceptos biológicos con la cotidianidad médica y ambiental."
          },
          {
            aprendizaje: "Modelar fenómenos de la naturaleza basado en el análisis de variables... - Procesos vivos",
            competencia: "Explicación de Fenómenos",
            ee_error: 13,
            col_error: 46,
            etc_error: 48,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Esquematizar redes tróficas, dinámica de poblaciones y transmisión genética de caracteres.",
            accionAula10: "Diagramas de flujo genético y modelos de equilibrio ecosistémico."
          },
          {
            aprendizaje: "Explicar cómo ocurren algunos fenómenos de la naturaleza basado en observaciones y patrones - Procesos vivos",
            competencia: "Explicación de Fenómenos",
            ee_error: 46,
            col_error: 62,
            etc_error: 62,
            color: "naranja",
            estado: "Oportunidad Prioritaria (Naranja)",
            tareaCognitiva: "Articular explicaciones causales detalladas sobre fotosíntesis, respiración celular y adaptaciones evolutivas.",
            accionAula10: "Laboratorios de indagación biológica: diseñar preguntas que exijan explicar el 'por qué' celular de un fenómeno y no solo recordar nombres."
          },
          {
            aprendizaje: "Derivar conclusiones para algunos fenómenos basándose en conocimientos científicos y evidencia - Procesos físicos",
            competencia: "Indagación",
            ee_error: 45,
            col_error: 50,
            etc_error: 52,
            color: "naranja",
            estado: "Oportunidad Prioritaria (Naranja)",
            tareaCognitiva: "Analizar gráficos cinemáticos, diagramas de fuerzas y trayectorias para concluir sobre leyes de conservación mecánica.",
            accionAula10: "Ejercicios intensivos de lectura e interpretación de gráficos posición-tiempo y fuerza-deformación."
          },
          {
            aprendizaje: "Identificar las características de algunos fenómenos basado en información científica - Procesos físicos",
            competencia: "Uso Comprensivo del Conocimiento",
            ee_error: 47,
            col_error: 65,
            etc_error: 64,
            color: "naranja",
            estado: "Oportunidad Prioritaria (Naranja)",
            tareaCognitiva: "Diferenciar con precisión propiedades físicas afines: trabajo vs potencia, masa vs peso, rapidez vs velocidad, calor vs temperatura.",
            accionAula10: "Contraste conceptual y dimensional riguroso antes de aplicar fórmulas numéricas."
          }
        ]
      },

      ing: {
        nombre: "Inglés",
        icono: "🌍",
        color: "#7C3AED",
        promedio2026: 69,
        desv2026: 12,
        comparativo: { col: 53, etc: 53, gc: 56 },
        niveles: { a_minus: 4, a1: 9, a2: 26, b1: 48, b_plus: 13 },
        diagnosticoArea: "Prueba líder del colegio (69 puntos). Supera por +16 puntos el promedio nacional. El 61% de la promoción egresa en niveles independientes B1 y B+, cumpliendo los más altos estándares del Marco Común Europeo.",
        evidencias: [
          {
            aprendizaje: "Parte 1: Reconocimiento de vocabulario temático mediante descripciones y definiciones.",
            competencia: "Competencia Léxica",
            ee_error: 12,
            col_error: 45,
            etc_error: 48,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Emparejar descripciones contextuales con el término léxico correspondiente descartando opciones distractoras.",
            accionAula10: "Consolidación de campos semánticos y vocabulario técnico en inglés."
          },
          {
            aprendizaje: "Parte 2: Identificación de ubicación y función comunicativa de avisos publicitarios y normativos.",
            competencia: "Competencia Pragmática",
            ee_error: 9,
            col_error: 38,
            etc_error: 40,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Deducir dónde se encontraría un aviso (sitios públicos, medios de transporte, oficinas) según su intención.",
            accionAula10: "Lectura rápida de avisos auténticos y señalética en entornos urbanos y escolares."
          },
          {
            aprendizaje: "Parte 3: Selección de la respuesta conversacional coherente en situaciones de habla cotidiana.",
            competencia: "Competencia Comunicativa",
            ee_error: 14,
            col_error: 42,
            etc_error: 45,
            color: "verde",
            estado: "Fortaleza Consolidada (Verde)",
            tareaCognitiva: "Elegir el turno conversacional adecuado respondiendo a preguntas de cortesía, acuerdos y desacuerdos.",
            accionAula10: "Micro-diálogos en parejas con situaciones reales de intercambio social."
          },
          {
            aprendizaje: "Partes 4 y 7: Completar textos con la estructura gramatical, tiempo verbal o preposición correcta.",
            competencia: "Competencia Gramatical",
            ee_error: 28,
            col_error: 52,
            etc_error: 54,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Identificar concordancias, verbos frasales, tiempos compuestos y conectores discursivos en lecturas continuas.",
            accionAula10: "Prácticas de cloze test enfocadas en preposiciones dependientes y tiempos perfectos."
          },
          {
            aprendizaje: "Partes 5 y 6: Comprensión literal e inferencial de textos narrativos, informativos y de opinión.",
            competencia: "Comprensión Lectora Avanzada (B1/B+)",
            ee_error: 25,
            col_error: 49,
            etc_error: 51,
            color: "amarillo",
            estado: "Nivel Satisfactorio (Amarillo)",
            tareaCognitiva: "Inferir la postura del autor, tono y conclusiones no explícitas en lecturas extensas.",
            accionAula10: "Lectura guiada de artículos de prensa internacional identificando tesis y argumentos implícitos para subir de B1 a B+."
          }
        ]
      }
    }
  }
};
