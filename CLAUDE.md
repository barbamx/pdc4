# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PDC4 — Paseo de Cumbres 4

Sitio de comunicación vecinal para el sector Paseo de Cumbres 4: proyectos en
curso, anuncios, galería y un canal para reportar incidencias. Estado actual:
**piloto**, en producción en GitHub Pages.

- **Sitio en vivo**: https://barbamx.github.io/pdc4/
- **Repositorio**: https://github.com/barbamx/pdc4
- **Administrador**: barbamx (heberb32@gmail.com)

## Comandos

No hay build, lint, ni test suite — es HTML/CSS/JS plano (ver decisión abajo).

- **Previsualizar localmente** (requerido porque `js/main.js` usa `fetch()`
  para cargar `data/*.json`, lo cual falla con `file://`):
  ```bash
  python3 -m http.server 8000
  ```
  Luego abrir `http://localhost:8000`.
- **Desplegar**: commit + push a `main`; GitHub Pages sirve el repo tal cual
  (no hay paso de build ni CI).

## Stack y decisiones de arquitectura

- HTML/CSS/JS plano, **sin paso de build**, sin dependencias/npm. Elegido
  deliberadamente para el piloto: cero fricción para editar y desplegar,
  GitHub Pages sirve el repo tal cual.
- No hay backend. El "reporte de incidencias" usa un Google Form embebido
  (`reportar.html`) porque GitHub Pages solo sirve archivos estáticos.
- El contenido dinámico (proyectos, anuncios) vive en `data/*.json` y se
  renderiza en el cliente con `fetch()` desde `js/main.js`. Esto permite que
  el administrador actualice contenido editando JSON, sin tocar HTML/CSS.
- El header/nav/footer están **duplicados en cada página HTML** (no hay
  templating). Es intencional para mantener "sin build step" — ver sección
  "Cuándo migrar a un generador de sitios" antes de considerar esto deuda
  técnica a corregir de inmediato.

## Estructura del repo

```
index.html, proyectos.html, anuncios.html,      Páginas (HTML duplicado por
galeria.html, reportar.html, contacto.html       página, ver arriba)
css/styles.css                                    Único stylesheet, variables
                                                    CSS en :root (paleta, radios,
                                                    sombras)
js/main.js                                         Menú móvil + fetch/render de
                                                    data/*.json
data/proyectos.json, data/anuncios.json            Contenido editable por el
                                                    administrador
assets/images/galeria/                             Fotos de la galería
.nojekyll                                          Evita procesamiento Jekyll
                                                    en GitHub Pages
README.md                                          Instrucciones operativas
                                                    para el administrador
```

Para instrucciones paso a paso de edición de contenido y despliegue, ver
`README.md` — ese archivo está dirigido al administrador humano, no al
agente. Este archivo (`CLAUDE.md`) es contexto para trabajo futuro asistido.

## Convenciones al modificar este repo

- Mantén el sitio en **español**; es la decisión confirmada del proyecto.
- Todo el HTML usa rutas **relativas** (`css/styles.css`, no `/css/styles.css`)
  porque el sitio vive bajo un subpath (`/pdc4/`), no en la raíz del dominio.
  No introduzcas rutas absolutas.
- Al agregar una página nueva, copia el header/nav/footer de una página
  existente (p. ej. `contacto.html`) para mantener consistencia, y marca el
  link activo con `aria-current="page"`.
- Estilos: usa las variables CSS ya definidas en `css/styles.css` (`--color-*`,
  `--radius-*`, `--shadow-*`) en vez de valores nuevos sueltos, para no romper
  la coherencia visual del sistema de diseño.
- No agregues dependencias externas (CDNs de fuentes, frameworks CSS/JS,
  analytics) sin que el administrador lo pida explícitamente — el pilar del
  piloto es "cero dependencias, cero build".
- Commits en español o inglés está bien; sé descriptivo sobre el *por qué*
  del cambio de contenido cuando aplique (p. ej. "actualizar estado de obra
  de alumbrado a completado").

## Del piloto a producto final — checklist de buenas prácticas

Esto es una hoja de ruta, no una lista de tareas pendientes urgentes. Úsala
para orientar decisiones cuando el administrador pida "hacer esto más
serio/definitivo" o cuando el sitio crezca en tráfico o en número de
administradores.

### 1. Dominio y branding
- [ ] Dominio propio (`CNAME` en la raíz) en vez de `github.io/pdc4/`, si el
      piloto se vuelve permanente.
- [ ] Reemplazar el favicon SVG inline por archivos reales (`favicon.ico`,
      `apple-touch-icon.png`, etc.) y agregar un logo si la comunidad lo
      define.
- [ ] Agregar meta tags Open Graph (`og:title`, `og:image`, `og:description`)
      para que los enlaces compartidos en WhatsApp/redes se vean bien —
      relevante porque este sitio se comparte boca a boca entre vecinos.

### 2. Reportes de incidencias (el punto más frágil del piloto)
- [ ] Google Forms no tiene protección anti-spam robusta por defecto — activar
      "Restringir a usuarios de la organización" no aplica aquí (público
      general), así que considerar un captcha o revisar respuestas
      periódicamente.
- [ ] Las respuestas viven solo en Google Sheets — establecer un hábito de
      exportar/respaldar periódicamente, o migrar a un servicio con backups
      automáticos si el volumen de reportes crece.
- [ ] Si el piloto valida la necesidad, evaluar migrar de Google Form a algo
      con mejor seguimiento de estado (abierto/en proceso/resuelto) — p. ej.
      Formspree + una hoja de cálculo, o Google Apps Script como webhook
      ligero. No es necesario para el piloto.
- [ ] Definir y comunicar cuánto tiempo se conservan los datos de contacto
      que los vecinos dejan en el formulario (nombre, teléfono) — ver punto
      de privacidad abajo.

### 3. Privacidad y datos personales
- [ ] El formulario de reporte pide datos opcionales de contacto. Antes de
      escalar esto, agregar una nota breve de privacidad (qué se hace con
      esos datos, quién los ve) — buena práctica incluso para un piloto
      vecinal, y relevante bajo la legislación mexicana de protección de
      datos personales (LFPDPPP) si aplica al tamaño/naturaleza del proyecto.
- [ ] No mostrar públicamente en el sitio ningún dato personal recibido vía
      reportes (nombres, teléfonos, fotos de personas identificables) sin
      consentimiento.

### 4. Gobernanza de contenido
- [ ] Mientras sea un solo administrador, push directo a `main` está bien.
      Si se suman más administradores, considerar Pull Requests (aunque sea
      de un solo revisor) para evitar que alguien publique algo por error.
- [ ] Si la edición de `data/*.json` a mano se vuelve incómoda para
      administradores no técnicos, considerar una CMS ligera basada en Git
      (p. ej. Decap CMS) que sigue siendo compatible con GitHub Pages sin
      backend propio — evaluar solo si de verdad se vuelve fricción real.

### 5. Calidad, accesibilidad y rendimiento
- [ ] Antes de cambios grandes de diseño, correr Lighthouse o axe DevTools
      (accesibilidad, performance, SEO) — el sitio ya sigue buenas prácticas
      base (landmarks semánticos, `aria-current`, `aria-expanded` en el menú,
      skip link, contraste AA en la paleta) pero no ha pasado una auditoría
      automatizada formal.
- [ ] Optimizar/comprimir fotos reales antes de subirlas a
      `assets/images/galeria/` (formato WebP y tamaño razonable) — hoy son
      solo placeholders, pero fotos sin optimizar son la causa más común de
      que un sitio estático se sienta lento.
- [ ] Agregar `sitemap.xml` y `robots.txt` si se quiere que el sitio sea
      indexable/buscable (opcional para un sitio vecinal cerrado a la
      comunidad, pero fácil de agregar).

### 6. Cuándo migrar a un generador de sitios (Eleventy/Astro)
- El header/nav/footer duplicados en 6 archivos HTML es manejable hoy. Si el
  sitio crece a 10+ páginas, o si el header cambia con frecuencia y mantener
  la duplicación se vuelve propenso a errores, es el momento de migrar a un
  generador estático con templates/partials (Eleventy es la opción más
  simple, misma filosofía "sin backend"). No hacerlo prematuramente — es
  trabajo de migración real y el piloto no lo necesita todavía.

### 7. Monitoreo
- [ ] GitHub Pages ya da HTTPS y uptime gestionado, no se necesita
      infraestructura extra para eso.
- [ ] Si se quiere saber cuánta gente visita el sitio, usar una herramienta
      de analítica respetuosa de la privacidad (Plausible, GoatCounter) en
      vez de Google Analytics, dado que es un sitio comunitario con vecinos
      que no esperan ser rastreados.

## Qué NO hacer

- No agregar un framework de build (webpack/vite/etc.) solo por costumbre —
  el "sin build step" es una decisión de producto para este piloto, no un
  descuido a corregir.
- No commitear credenciales, tokens, o IDs de formularios/API keys sensibles
  al repo — es público.
- No romper el flujo `fetch()` de `data/*.json` asumiendo que el sitio se
  abre con `file://`; siempre debe probarse servido por HTTP (ver README).
