/* =========================================================
   DATOS DE PROYECTOS
   Para añadir un proyecto nuevo, copia un bloque { ... } y cámbialo.
   No toques el HTML ni el CSS: la tarjeta se genera sola.

   image    -> captura del proyecto, guardada en la carpeta assets/
               (si el archivo no existe, la tarjeta se ve bien sin imagen)
   tags     -> el filtro se arma solo con las etiquetas que uses
   security -> opcional: nota de seguridad, o null si no aplica
   ========================================================= */
const PROJECTS = [
  {
    title: "Hardening automatizado en Ubuntu",
    description: "Script en Shell que aplica configuraciones de endurecimiento a un servidor Ubuntu de forma automática.",
    image: "assets/proy-hardening.png",
    tags: ["security", "linux", "shell"],
    security: null,
    links: [
      { label: "Ver código", url: "https://github.com/cristianmarti29-jpn/hardening-automatizado-en-ubuntu-" }
    ]
  },
  {
    title: "Pre-commit security scanner",
    description: "Herramienta en Shell que revisa el código antes de cada commit para detectar problemas de seguridad.",
    image: "assets/proy-precommit.png",
    tags: ["security", "devsecops", "shell"],
    security: null,
    links: [
      { label: "Ver código", url: "https://github.com/cristianmarti29-jpn/pre-commit-security-scanner" }
    ]
  },
  {
    title: "Log analyzer",
    description: "Analizador de logs en Python para procesar registros y encontrar eventos relevantes.",
    image: "assets/proy-log-analyzer.png",
    tags: ["security", "python"],
    security: null,
    links: [
      { label: "Ver código", url: "https://github.com/cristianmarti29-jpn/log-analyzer-v-" }
    ]
  },
  {
    title: "Monster Store",
    description: "Sitio web de una tienda maquetado con HTML y CSS.",
    image: "assets/proy-monster-store.png",
    tags: ["web", "frontend"],
    security: null,
    links: [
      { label: "Ver código", url: "https://github.com/cristianmarti29-jpn/moster-store-" }
    ]
  },
  {
    title: "Proyecto SENA",
    description: "Sitio web desarrollado como parte de mi formación en el SENA.",
    image: "assets/proy-sena.png",
    tags: ["web", "frontend"],
    security: null,
    links: [
      { label: "Ver código", url: "https://github.com/cristianmarti29-jpn/my-proyect-sena-" }
    ]
  }
];

/* =========================================================
   DATOS DE CERTIFICADOS
   image -> imagen del certificado en assets/
   url   -> enlace de "Ver certificado" de Coursera, o null
   ========================================================= */
const CERTS = [
  {
    title: "Google Cybersecurity",
    issuer: "Certificado profesional · Google · Coursera",
    year: "Oct 2026",
    image: "assets/cert-google-cybersecurity.jpg",
    url: null
  },
  {
    title: "Preparing for Google Cloud Certification: Cloud DevOps Engineer",
    issuer: "Certificado profesional · Google Cloud · Coursera",
    year: "Oct 2026",
    image: "assets/cert-cloud-devops.jpg",
    url: null
  },
  {
    title: "Architecting with Google Kubernetes Engine (Español)",
    issuer: "Programa especializado · Google Cloud · Coursera",
    year: "Oct 2026",
    image: "assets/cert-gke.jpg",
    url: null
  },
  {
    title: "Microsoft DevOps Engineering (AZ-400)",
    issuer: "Certificado profesional · Microsoft · Coursera",
    year: "Oct 2026",
    image: "assets/cert-az400.jpg",
    url: null
  }
];

/* =========================================================
   STACK, agrupado por área.
   Deja solo lo que puedas explicar en una entrevista.
   ========================================================= */
const STACK = [
  { group: "Desarrollo web",    items: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git / GitHub", "Netlify"] },
  { group: "Linux y scripting", items: ["Linux (Ubuntu)", "Bash / Shell", "Python", "SQL"] },
  { group: "Cloud y DevOps",    items: ["Google Cloud", "Kubernetes (GKE)", "Docker", "CI/CD", "Azure DevOps"] },
  { group: "Seguridad",         items: ["Hardening", "Análisis de logs", "SIEM", "Gestión de riesgos", "Pre-commit scanning"] }
];

/* =========================================================
   UTILIDAD: si una imagen no existe, la quitamos en vez de
   mostrar el ícono de imagen rota.
   ========================================================= */
function hideBrokenImages(container) {
  container.querySelectorAll("img[data-optional]").forEach(img => {
    img.addEventListener("error", () => {
      const link = img.closest("a.cert-card__imglink");
      (link || img).remove();
    });
  });
}

/* =========================================================
   RENDER DE PROYECTOS
   ========================================================= */
const grid = document.getElementById("projectsGrid");
const filtersBar = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");

function allTags(projects) {
  const set = new Set();
  projects.forEach(p => p.tags.forEach(t => set.add(t)));
  return ["todos", ...Array.from(set).sort()];
}

function renderFilters() {
  const tags = allTags(PROJECTS);
  filtersBar.innerHTML = tags.map((tag, i) => `
    <button class="filter-btn" data-tag="${tag}" role="tab" aria-pressed="${i === 0}">
      ${tag}
    </button>
  `).join("");
}

/* Cuántos proyectos se muestran por página (3 = una fila en escritorio) */
const PROJECTS_PER_PAGE = 3;
let currentTag = "todos";
let currentPage = 1;

function renderProjects() {
  const filtered = currentTag === "todos"
    ? PROJECTS
    : PROJECTS.filter(p => p.tags.includes(currentTag));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PROJECTS_PER_PAGE;
  const visible = filtered.slice(start, start + PROJECTS_PER_PAGE);

  emptyState.hidden = filtered.length !== 0;

  grid.innerHTML = visible.map(project => `
    <article class="project-card">
      ${project.image ? `<img class="project-card__img" data-optional src="${project.image}" alt="Captura de ${project.title}" loading="lazy">` : ""}
      <div class="project-card__head">
        <h3>${project.title}</h3>
      </div>
      <p class="project-card__desc">${project.description}</p>
      ${project.highlights ? `<ul class="project-card__highlights">${project.highlights.map(h => `<li>${h}</li>`).join("")}</ul>` : ""}
      ${project.security ? `
        <p class="project-card__security">
          <strong>Nota de seguridad:</strong> ${project.security}
        </p>` : ""}
      <ul class="project-card__tags">
        ${project.tags.map(t => `<li>${t}</li>`).join("")}
      </ul>
      <div class="project-card__links">
        ${project.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label} →</a>`).join("")}
      </div>
    </article>
  `).join("");

  hideBrokenImages(grid);
  renderPagination(totalPages);
}

/* Qué números mostrar: 1 2 3 4 5 … 10, como en un paginador clásico */
function pageList(total, current) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

const ICON_PREV = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_NEXT = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function renderPagination(totalPages) {
  const nav = document.getElementById("pagination");
  if (!nav) return;

  if (totalPages <= 1) {
    nav.innerHTML = "";
    nav.hidden = true;
    return;
  }
  nav.hidden = false;

  const numbers = pageList(totalPages, currentPage).map(p => p === "…"
    ? '<span class="page-gap" aria-hidden="true">…</span>'
    : `<button type="button" class="page-btn" data-page="${p}" aria-label="Página ${p}"${p === currentPage ? ' aria-current="page"' : ""}>${p}</button>`
  ).join("");

  nav.innerHTML = `
    <button type="button" class="page-btn page-btn--prev" data-page="${currentPage - 1}" aria-label="Página anterior"${currentPage === 1 ? " disabled" : ""}>${ICON_PREV}</button>
    ${numbers}
    <button type="button" class="page-btn page-btn--next" data-page="${currentPage + 1}" aria-label="Página siguiente"${currentPage === totalPages ? " disabled" : ""}>${ICON_NEXT}</button>
  `;
}

function initFilters() {
  renderFilters();
  renderProjects();

  filtersBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filtersBar.querySelectorAll(".filter-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");

    currentTag = btn.dataset.tag;
    currentPage = 1;
    renderProjects();
  });

  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.addEventListener("click", (e) => {
      const btn = e.target.closest(".page-btn");
      if (!btn || btn.disabled) return;
      currentPage = Number(btn.dataset.page);
      renderProjects();
    });
  }
}

/* =========================================================
   RENDER DE CERTIFICADOS
   ========================================================= */
function renderCerts() {
  const certsGrid = document.getElementById("certsGrid");
  if (!certsGrid) return;

  certsGrid.innerHTML = CERTS.map(c => `
    <article class="cert-card">
      ${c.image ? `<a class="cert-card__imglink" href="${c.url || c.image}" target="_blank" rel="noopener noreferrer"><img class="cert-card__img" data-optional src="${c.image}" alt="Certificado: ${c.title}" loading="lazy"></a>` : ""}
      <span class="cert-card__meta">${c.issuer} · ${c.year}</span>
      <h3>${c.title}</h3>
      ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">Verificar →</a>` : ""}
    </article>
  `).join("");

  hideBrokenImages(certsGrid);
}

/* =========================================================
   RENDER DEL STACK
   ========================================================= */
function renderStack() {
  const el = document.getElementById("stackGroups");
  if (!el) return;

  el.innerHTML = STACK.map(g => `
    <div class="stack-group">
      <h4>${g.group}</h4>
      <ul class="tags">${g.items.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>
  `).join("");
}

/* =========================================================
   EFECTO DE ESCRITURA EN EL SUBTÍTULO DEL HERO
   Respeta prefers-reduced-motion.
   ========================================================= */
function initTypedSubtitle() {
  const el = document.getElementById("typedSubtitle");
  const phrase = "Aprendiendo a construir seguro, no solo a construir rápido.";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    el.textContent = phrase;
    return;
  }

  let i = 0;
  function type() {
    el.textContent = phrase.slice(0, i);
    i++;
    if (i <= phrase.length) {
      setTimeout(type, 28);
    }
  }
  type();
}

/* =========================================================
   MENÚ MÓVIL
   ========================================================= */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   AÑO EN EL FOOTER
   ========================================================= */
function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  renderCerts();
  renderStack();
  initTypedSubtitle();
  initMobileNav();
  initYear();
});
