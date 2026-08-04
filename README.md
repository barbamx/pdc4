# PDC4 — Sitio del sector Paseo de Cumbres 4

Sitio piloto, estático (HTML/CSS/JS sin build), para informar a los vecinos sobre
proyectos en curso, anuncios y para recibir reportes de incidencias. Pensado para
alojarse en GitHub Pages.

**Sitio en vivo**: https://barbamx.github.io/pdc4/

## Estructura

```
pdc4/
├── index.html         Página de inicio
├── proyectos.html      Lista completa de proyectos actuales
├── anuncios.html        Lista completa de anuncios
├── galeria.html          Galería de fotos
├── reportar.html         Formulario de reporte (Google Form embebido)
├── contacto.html         Datos de contacto del administrador
├── css/styles.css        Estilos del sitio
├── js/main.js             Menú móvil + carga de proyectos/anuncios desde /data
├── data/
│   ├── proyectos.json     Contenido editable: proyectos actuales
│   └── anuncios.json       Contenido editable: anuncios
└── assets/images/galeria/  Fotos de la galería
```

## Cómo previsualizar el sitio localmente

Los datos de proyectos y anuncios se cargan con `fetch()`, lo cual requiere servir
el sitio por HTTP (no funciona abriendo el archivo directamente con doble clic).
Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador. (Alternativa: la extensión
"Live Server" de VS Code.)

## Cómo actualizar el contenido

### Proyectos actuales

Edita `data/proyectos.json`. Cada proyecto tiene esta forma:

```json
{
  "titulo": "Nombre del proyecto",
  "estado": "En progreso",
  "fecha": "2026-08-01",
  "descripcion": "Descripción breve del proyecto."
}
```

`estado` acepta: `"En progreso"`, `"Planeado"` o `"Completado"` (cambia el color
de la etiqueta automáticamente). Los proyectos se muestran ordenados por fecha,
del más reciente al más antiguo.

### Anuncios

Edita `data/anuncios.json` con el mismo formato (sin el campo `estado`):

```json
{
  "titulo": "Título del anuncio",
  "fecha": "2026-08-01",
  "descripcion": "Contenido del anuncio."
}
```

Después de editar cualquiera de los dos archivos, solo haz commit y push — no
se necesita ningún paso de compilación.

### Formulario de reporte (Google Form)

1. Crea un formulario en [Google Forms](https://forms.google.com) con, como
   mínimo, estos campos (ya sugeridos también en `reportar.html`):
   - **Tipo de reporte** (desplegable: Seguridad, Mantenimiento, Ruido, Otro)
   - **Ubicación / referencia** (texto corto)
   - **Descripción** (texto largo)
   - **Foto** (carga de archivo, opcional)
   - **Nombre y contacto** (opcional, para dar seguimiento)
   - **Urgencia** (Baja, Media, Alta)
2. En el formulario: **Enviar → pestaña Insertar (`<>`)** y copia la URL que
   aparece dentro del `src="..."` del `<iframe>`.
3. Abre `reportar.html` y reemplaza las dos ocurrencias de
   `TODO_REEMPLAZAR_CON_TU_FORMULARIO` (una en el `src` del `<iframe>`, otra en
   el enlace de respaldo) con tu URL real.
4. Las respuestas se guardan automáticamente en una hoja de Google Sheets
   vinculada al formulario (Respuestas → ícono de Sheets).

### Datos de contacto

Abre `contacto.html` y reemplaza los valores marcados con `TODO` (correo,
WhatsApp, ubicación) con la información real. Los recuadros rojos
"TODO: reemplazar…" son solo una guía visual para el administrador — bórralos
una vez actualizado cada dato.

### Galería de fotos

1. Coloca las imágenes en `assets/images/galeria/`.
2. En `galeria.html`, reemplaza cada `<div class="gallery-item">…</div>` de
   ejemplo por:
   ```html
   <div class="gallery-item">
     <img src="assets/images/galeria/tu-foto.jpg" alt="Descripción de la foto" />
   </div>
   ```

## Cómo publicar en GitHub Pages

1. Si aún no existe el repositorio:
   ```bash
   git init
   git add .
   git commit -m "Sitio inicial PDC4"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/pdc4.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Source: Deploy from a branch**, elige la
   rama `main` y la carpeta `/ (root)`.
3. El sitio quedará disponible en `https://<tu-usuario>.github.io/pdc4/`.
4. Si más adelante consigues un dominio propio, agrega un archivo `CNAME` en
   la raíz del proyecto con el dominio, y configura el DNS correspondiente.

El archivo `.nojekyll` ya está incluido para que GitHub Pages sirva el sitio
tal cual, sin procesarlo con Jekyll.
