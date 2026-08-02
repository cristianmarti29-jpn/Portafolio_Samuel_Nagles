/* =========================================================
   DATOS DE PROYECTOS
   Para añadir un proyecto nuevo, agrega un objeto aquí.
   No toques el HTML ni el CSS: la tarjeta se genera sola.

   tags        -> usa las mismas etiquetas para que el filtro las agrupe
   security    -> opcional. Si el proyecto tiene una nota de seguridad
                  (headers, hardening, dependencias auditadas, etc.),
                  ponla aquí. Si no aplica, usa null.
   ========================================================= */
const PROJECTS = [
  {
    title: "Proyecto de ejemplo — Landing responsive",
    description: "Landing page construida con HTML y CSS puro, maquetada mobile-first y desplegada en Netlify.",
    tags: ["web", "frontend"],
    security: null,
    links: [
      { label: "Ver código", url: "https://github.com/tu-usuario/tu-repo" },
      { label: "Ver demo", url: "https://tu-proyecto.netlify.app" }
    ]
  },
  {
    title: "Proyecto de ejemplo — App con JavaScript",
    description: "Aplicación interactiva en JavaScript vanilla que consume una API pública y guarda estado en el navegador.",
    tags: ["web", "javascript"],
    security: "Validé y saneé las entradas del usuario antes de renderizarlas para evitar inyección de HTML.",
    links: [
      { label: "Ver código", url: "https://github.com/tu-usuario/tu-repo-2" },
      { label: "Ver demo", url: "https://tu-proyecto-2.netlify.app" }
    ]
  },
  {
    title: "Proyecto de ejemplo — Writeup CTF",
    description: "Resolución documentada de una máquina/reto de TryHackMe, con el razonamiento paso a paso.",
    tags: ["security", "ctf"],
    security: "Incluye el vector de entrada explotado y cómo se habría mitigado.",
    links: [
      { label: "Leer writeup", url: "https://github.com/tu-usuario/writeups" }
    ]
  }
];

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

function renderProjects(activeTag = "todos") {
  const filtered = activeTag === "todos"
    ? PROJECTS
    : PROJECTS.filter(p => p.tags.includes(activeTag));

  emptyState.hidden = filtered.length !== 0;

  grid.innerHTML = filtered.map(project => `
    <article class="project-card">
      <div class="project-card__head">
        <h3>${project.title}</h3>
      </div>
      <p class="project-card__desc">${project.description}</p>
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
}

function initFilters() {
  renderFilters();
  renderProjects();

  filtersBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filtersBar.querySelectorAll(".filter-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");

    renderProjects(btn.dataset.tag);
  });
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
  initTypedSubtitle();
  initMobileNav();
  initYear();
});