# 📊 Dashboard · Clasificación de Planteles Saber 11° (2024 - 2026)

Plataforma ejecutiva e interactiva de analítica, comparación y autoevaluación institucional basada en los resultados oficiales de la **Clasificación de Planteles Saber 11° del ICFES** para los periodos **2024**, **2025** y **2026**.

Diseñado bajo estándares de visualización ejecutiva moderna con tipografía **Plus Jakarta Sans**, paleta cromática slate/coral/cyan y experiencia de usuario fluida sin dependencias complejas.

---

## 🚀 Características Principales

### 1. 🌐 Panorama Nacional y Departamental
* **KPIs Clave en Tiempo Real:** Total de colegios clasificados, estudiantes evaluados, porcentaje y conteo de colegios en categorías de excelencia ($A+$ y $A$), distribución de sector oficial vs. no oficial, e índice total promedio nacional.
* **Visualizaciones Interactivas:**
  - Gráfico de dona con distribución oficial por categoría ($A+$, $A$, $B$, $C$, $D$, $S/C$).
  - Gráfico de barras apiladas de clasificación por sector.
  - Promedios por área de conocimiento evaluada frente a la referencia nacional.
  - Distribución del índice global por rangos de desempeño.
* **Filtros Laterales Inteligentes:** Filtro por Departamento, Municipio, Sector (Oficial / No oficial), Tipo (Establecimiento / Sede) y selección individual inteligente de categorías con un solo clic.

### 2. 🗓️ Selector Multi-Periodo Oficial (`[2024] [2025] [2026]`)
* Alterna en un clic entre las bases de datos oficiales publicadas por el ICFES:
  - **Periodo 2024:** 12.276 colegios evaluados.
  - **Periodo 2025:** 12.253 colegios evaluados.
  - **Periodo 2026:** 12.810 colegios evaluados.
* Todos los paneles, exploradores y fichas se recalculan dinámicamente según el año activo.

### 3. 🔎 Explorador y Buscador Universal de Colegios
* **Búsqueda predictiva:** Localiza cualquier institución tanto por su **Código DANE (12 dígitos)** como por su **Nombre de Institución**, Municipio o Departamento.
* **Tabla interactiva paginada:** Ordenable por posición nacional, departamental, municipal, sectorial o por índice específico en cada área.
* Acceso directo a la Ficha Institucional o al Comparador en un clic.

### 4. 🏫 Ficha Institucional & Evolución Trienal Oficial
* Categoría oficial obtenida con distintivo visual de color normativo.
* Métricas de matrícula y cobertura de evaluación.
* **Evolución Histórica Oficial:** Tarjetas comparativas de los periodos con indicador de variación interanual ($\Delta$), alumnos evaluados y gráfico comparativo de índices en las 5 áreas del saber:
  - *Matemáticas*
  - *Ciencias Naturales*
  - *Sociales y Ciudadanas*
  - *Lectura Crítica*
  - *Inglés*
* Gráfico de radar curricular del plantel frente al municipio, departamento, nación y colegios $A+$.
* Diagnóstico de fortalezas y áreas prioritarias a potenciar.

### 5. 📈 Trayectoria Histórica y Autoevaluación Institucional (Horizonte Dinámico)
* **Horizonte adaptativo según el año activo:**
  - Si el dashboard está en **2024**: evalúa **2021 a 2024** (4 años).
  - Si el dashboard está en **2025**: evalúa **2021 a 2025** (5 años).
  - Si el dashboard está en **2026**: evalúa **2021 a 2026** (6 años).
* **Matriz interactiva:** Permite ingresar o editar los promedios anuales ($\bar{X}$) y desviaciones estándar ($\sigma$) por área.
* **Botón `🔄 Sincronizar ICFES`:** Carga y vincula automáticamente los índices oficiales del colegio para los periodos disponibles.
* **Gráficos automáticos:**
  - Evolución de Promedios por Área.
  - Semáforo y gráfica de Dispersión Estudiantil / Desviación Estándar ($\sigma$) para medir equidad en el aula.
  - Radar de Equilibrio Curricular (año inicial vs. año final).
* **Diagnóstico y Plan de Mejora Proyectado:** Generación automática de recomendaciones pedagógicas, balance de brechas y metas de ascenso institucional.
* **Herramientas:** Guardado en navegador (`localStorage`), exportación a CSV, importación desde plantilla CSV y botón de impresión / guardado en PDF.

### 6. ⚖️ Comparador Institucional
* Compara hasta 5 instituciones simultáneamente cara a cara en métricas, índices por área y perfil de competencias.

### 7. 📌 Encabezado Estático (Sticky Navigation)
* La barra de herramientas, selector de periodos, buscador y menú de navegación permanecen fijos en la parte superior durante el desplazamiento en todas las vistas.

---

## 📁 Estructura del Proyecto

```text
Colegios 2026_DashBoard/
├── index.html              # Estructura principal y maquetación de vistas
├── README.md               # Documentación general del repositorio
├── LICENSE                 # Licencia de código abierto MIT
├── .gitignore              # Reglas de exclusión para Git
├── css/
│   └── estilos.css         # Estilos visuales ejecutivos, temas y responsive design
├── js/
│   ├── app.js              # Lógica principal, filtros, enrutamiento y cálculos
│   ├── graficos.js         # Motor gráfico con Chart.js personalizado
│   ├── parser.js           # Módulo de procesamiento y parseo de datos ICFES
│   └── vendor/             # Librerías externas (Chart.js, SheetJS XLSX)
├── data/
│   ├── datos.js            # Dataset oficial Saber 11° periodo 2026
│   ├── datos2024.js        # Dataset oficial Saber 11° periodo 2024
│   ├── datos2025.js        # Dataset oficial Saber 11° periodo 2025
│   ├── educate.js          # Listado de colegios aliados Edúcate
│   └── resultados2026.js   # Resultados detallados por prueba Saber 11
└── assets/
    └── logos/              # Logotipos e identidades visuales
```

---

## 💻 Ejecución Local

No requiere NodeJS, bases de datos externas ni servidores complejos. Todo el dashboard corre en el lado del cliente (navegador web):

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/Wafc24/Dashboard_Colegio_2026.git
   ```
2. Abre el archivo `index.html` en tu navegador preferido (**Microsoft Edge**, **Google Chrome**, **Firefox** o **Safari**).

---

## 🌐 Publicación en GitHub Pages

Para habilitar el dashboard en internet de forma gratuita con **GitHub Pages**:

1. Ingresa a tu repositorio en GitHub: `https://github.com/Wafc24/Dashboard_Colegio_2026`.
2. Ve a la pestaña **Settings** (Configuración) $\rightarrow$ sección **Pages** (en el menú lateral izquierdo).
3. En **Build and deployment** $\rightarrow$ **Source**, selecciona `Deploy from a branch`.
4. En **Branch**, selecciona la rama `main` (o `master`) y carpeta `/(root)`.
5. Haz clic en **Save**.
6. En un par de minutos, tu dashboard estará publicado y accesible en:
   ```
   https://wafc24.github.io/Dashboard_Colegio_2026/
   ```

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más información.

---

### Grupo Edúcate Colombia
*Inteligencia de datos y analítica educativa al servicio de la calidad institucional.*
