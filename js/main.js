/**
 * PDC4 — Paseo de Cumbres 4
 * Navegación móvil + render de proyectos y anuncios desde /data/*.json
 */

(function () {
  "use strict";

  function initNavToggle() {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav__toggle");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    // Cierra el menú al navegar (mejor experiencia en móvil)
    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var BADGE_CLASS = {
    "En progreso": "card__badge--en-progreso",
    "Planeado": "card__badge--planeado",
    "Completado": "card__badge--completado",
  };

  function formatDate(isoDate) {
    if (!isoDate) return "";
    var d = new Date(isoDate + "T00:00:00");
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function renderProjectCard(item) {
    var badgeClass = BADGE_CLASS[item.estado] || "card__badge--planeado";
    return (
      '<article class="card">' +
      '<span class="card__badge ' + badgeClass + '">' + escapeHtml(item.estado || "") + "</span>" +
      "<h3>" + escapeHtml(item.titulo || "") + "</h3>" +
      '<p class="card__meta">Actualizado: ' + escapeHtml(formatDate(item.fecha)) + "</p>" +
      '<p class="card__desc">' + escapeHtml(item.descripcion || "") + "</p>" +
      "</article>"
    );
  }

  function renderAnnouncementCard(item) {
    return (
      '<article class="card">' +
      '<span class="card__badge">' + escapeHtml(formatDate(item.fecha)) + "</span>" +
      "<h3>" + escapeHtml(item.titulo || "") + "</h3>" +
      '<p class="card__desc">' + escapeHtml(item.descripcion || "") + "</p>" +
      "</article>"
    );
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealObserver = !prefersReducedMotion && "IntersectionObserver" in window
    ? new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      )
    : null;

  function revealOnScroll(elements) {
    if (!revealObserver) return;
    elements.forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  function loadInto(containerId, jsonPath, renderFn, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var limit = (opts && opts.limit) || null;
    var emptyMessage = (opts && opts.emptyMessage) || "Aún no hay contenido para mostrar.";
    var errorMessage = (opts && opts.errorMessage) ||
      "No se pudo cargar el contenido. Si estás previsualizando el sitio localmente, asegúrate de servirlo con un servidor HTTP (ver README).";

    fetch(jsonPath)
      .then(function (res) {
        if (!res.ok) throw new Error("Respuesta no válida: " + res.status);
        return res.json();
      })
      .then(function (items) {
        if (!Array.isArray(items) || items.length === 0) {
          container.innerHTML = '<p class="state-msg">' + emptyMessage + "</p>";
          return;
        }
        var sorted = items.slice().sort(function (a, b) {
          return (b.fecha || "").localeCompare(a.fecha || "");
        });
        var toRender = limit ? sorted.slice(0, limit) : sorted;
        container.innerHTML = toRender.map(renderFn).join("");
        revealOnScroll(container.querySelectorAll(".card"));
      })
      .catch(function (err) {
        console.error(err);
        container.innerHTML = '<p class="state-msg">' + errorMessage + "</p>";
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    revealOnScroll(document.querySelectorAll(".contact-card, .gallery-item, .report-panel"));

    loadInto("proyectos-destacados", "data/proyectos.json", renderProjectCard, {
      limit: 3,
      emptyMessage: "Pronto publicaremos los proyectos en curso.",
    });
    loadInto("proyectos-lista", "data/proyectos.json", renderProjectCard, {
      emptyMessage: "Pronto publicaremos los proyectos en curso.",
    });
    loadInto("anuncios-destacados", "data/anuncios.json", renderAnnouncementCard, {
      limit: 3,
      emptyMessage: "Aún no hay anuncios publicados.",
    });
    loadInto("anuncios-lista", "data/anuncios.json", renderAnnouncementCard, {
      emptyMessage: "Aún no hay anuncios publicados.",
    });
  });
})();
