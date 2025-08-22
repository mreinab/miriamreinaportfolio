// Cargar header.html dinámicamente
function loadHeader() {
  fetch("/components/header.html")
    .then((res) => res.text())
    .then((html) => {
      // Insertar el HTML del header
      document.getElementById("header-placeholder").innerHTML = html;

      // Función para actualizar el logo según el tema activo
      function updateLogoBasedOnTheme() {
        const isLight =
          document.body.classList.contains("white-header") ||
          document.body.classList.contains("dark-mode");

        const logos = isLight
          ? ["/assets/images/logo1-light.png", "/assets/images/logo2-light.png"]
          : ["/assets/images/logo1.png", "/assets/images/logo2.png"];

        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        const logoImg = document.getElementById("logo-img");

        if (logoImg) {
          logoImg.src = randomLogo;
        } else {
          console.warn("No se encontró el <img id='logo-img'> en header.html");
        }
      }

      // Asegurarse de que el DOM está listo antes de buscar el logo
      requestAnimationFrame(() => {
        updateLogoBasedOnTheme();
      });

      // Escuchar clics en el botón de cambio de tema para actualizar el logo al vuelo
      document.addEventListener("click", (e) => {
        const toggle = e.target.closest(".theme-toggle");
        if (toggle) {
          setTimeout(() => {
            updateLogoBasedOnTheme();
          }, 50); // Esperar a que se aplique la clase 'dark-mode'
        }
      });

      // Iniciar funcionalidades del header
      initMenuToggle();
      initThemeToggle();
      initActiveLinkHighlight();
      initBreadcrumbs();

      // Mostrar el contenido principal con animación
      const main = document.getElementById("main-content");
      if (main) {
        main.style.display = "block";
        setTimeout(() => {
          main.classList.add("show");
        }, 100);
      }
    })
    .catch((error) => {
      console.error("Error al cargar el header:", error);
      const main = document.getElementById("main-content");
      if (main) {
        main.style.display = "block";
        main.classList.add("show");
      }
    });
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();

  // Solo cargar projects.html dinámicamente en la raíz
  const path = window.location.pathname;
  if (path === "/" || path === "/index.html") {
    loadContent();
  }
});

// Breadcrumb dinámico
function initBreadcrumbs() {
  const breadcrumbContainer = document.getElementById("breadcrumb-container");
  if (!breadcrumbContainer) return;

  const path = window.location.pathname; // Ejemplo: "/projects/singleproject.html"
  const search = window.location.search; // Ejemplo: "?slug=juan-vidal"

  let crumbs = [];

  if (path === "/" || path === "/index.html") {
    crumbs = [""];
  } else if (path === "fashion.html") {
    crumbs = ["", "moda"];
  } else if (path === "graphic.html") {
    crumbs = ["", "gráfico"];
  } else if (
    path === "/projects/singleproject.html" &&
    search.startsWith("?slug=")
  ) {
    const params = new URLSearchParams(search);
    const slug = params.get("slug") || "";
    crumbs = ["", "moda", slug.replace(/-/g, " ")];
  } else {
    // Si no reconocemos la ruta, ocultamos el breadcrumb
    breadcrumbContainer.style.display = "none";
    return;
  }

  const urlMap = {
    proyectos: "index.html",
    moda: "fashion.html",
    gráfico: "graphic.html",
  };

  let html = `<nav aria-label="breadcrumb" class="breadcrumb">`;

  crumbs.forEach((crumb, index) => {
    const isLast = index === crumbs.length - 1;
    if (!isLast) {
      html += `<a href="${
        urlMap[crumb] || "#"
      }" class="breadcrumb-link">${crumb}</a>`;
      html += `<span class="breadcrumb-separator">&gt;</span>`;
    } else {
      html += `<span class="breadcrumb-current">${crumb}</span>`;
    }
  });

  html += `</nav>`;

  breadcrumbContainer.innerHTML = html;
  breadcrumbContainer.style.display = "block";

  const breadcrumbNav = breadcrumbContainer.querySelector(".breadcrumb");
  if (breadcrumbNav) {
    void breadcrumbNav.offsetWidth;
    breadcrumbNav.classList.add("show");
  }
}

// DARK MODE
function initThemeToggle() {
  const themeToggles = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  themeToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });

  if (themeToggles.length === 0) {
    console.warn("No se encontró ningún botón .theme-toggle");
  }
}

// Resaltar link activo
function initActiveLinkHighlight() {
  const allLinks = document.querySelectorAll(".selector a, .mobile-nav a");
  const currentPage = location.pathname;

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Hover gifs
function initHoverImages() {
  const gifImages = document.querySelectorAll(".hover-gif");

  gifImages.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      img.src = img.dataset.gif;
    });
    img.addEventListener("mouseleave", () => {
      img.src = img.dataset.static;
    });
  });
}

// Index HOVER cambio imágenes con animación de textos
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".img-index");
  const leftTexts = document.querySelectorAll(".container-index-p.end p");
  const rightTexts = document.querySelectorAll(".container-index-p.start p");
  const links = document.querySelectorAll(".nav-index a");

  const defaultImg = img.src;
  const defaultLeft = Array.from(leftTexts).map((p) => p.textContent);
  const defaultRight = Array.from(rightTexts).map((p) => p.textContent);

  const content = {
    moda: {
      img: "/assets/images/collage-mobile.png",
      left: ["", "", "estilismo"],
      right: ["dirección creativa", "", ""],
    },
    gráfico: {
      img: "/assets/images/graphic.png",
      left: ["", "lettering", "diseño editorial"],
      right: ["branding", "diseño visual", ""],
    },
    web: {
      img: "/assets/images/web.png",
      left: ["UX/UI", "desarrollo", "prototipado"],
      right: ["frontend", "responsive", "accesible"],
    },
  };

  function fadeTexts(textElements, newTexts) {
    // fade out
    textElements.forEach((p) => p.classList.add("text-fade-out"));

    setTimeout(() => {
      // cambiar texto
      textElements.forEach((p, i) => {
        p.textContent = newTexts[i] || "";
        p.classList.remove("text-fade-out");
        p.classList.add("text-fade-in");
      });

      // quitar fade-in después para permitir repetir animación
      setTimeout(() => {
        textElements.forEach((p) => p.classList.remove("text-fade-in"));
      }, 2); // duración de la transición
    }, 2); // coincide con la duración de fade-out
  }

  function fadeChange(newImg, left, right) {
    // Imagen
    img.classList.add("fade-out");
    setTimeout(() => {
      img.src = newImg;
      img.classList.remove("fade-out");
      img.classList.add("fade-in");
      setTimeout(() => img.classList.remove("fade-in"), 250);
    }, 250);

    // Textos
    fadeTexts(leftTexts, left);
    fadeTexts(rightTexts, right);
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const key = link.textContent.trim().toLowerCase();
      if (content[key]) {
        fadeChange(content[key].img, content[key].left, content[key].right);
      }
    });

    link.addEventListener("mouseleave", () => {
      fadeChange(defaultImg, defaultLeft, defaultRight);
    });
  });
});

// Menu móvil
function initMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  if (!menuToggle || !mobileMenu) {
    console.warn("No se encontró el menú móvil o el toggle");
    return;
  }

  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    menuToggle.classList.toggle("active-menu");
    mobileMenu.classList.toggle("active");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuToggle.classList.remove("active-menu");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // --- LISTADO DE PROYECTOS ---

  //MODA
  const projects = [
    {
      id: "hanyucoruna",
      img: "/assets/images/hanycoruna.gif",
      type: "fashion",
      slug: "hanycoruna",
      title: "BTS - Hanny Pineiro",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["Color", "Juventud", "Experimental"],
      top: "5.5%",
      left: "6%",
    },
    {
      id: "juanvidal",
      img: "/assets/images/juanvidal-00-icon1.jpg",
      type: "fashion",
      slug: "juan-vidal",
      title: "JUAN VIDAL · CAMPAÑA DE NOVIA",
      description:
        "Campaña de lanzamiento de la primera colección de vestidos de novia de Juan Vidal, firma madrileña reconocida…",
      tags: ["dirección de arte", "dirección creativa"],
      top: "5%",
      left: "40%",
    },
    {
      id: "pablopuche",
      img: "/assets/images/pablopuche-00-icon.jpg",
      type: "fashion",
      slug: "pablopuche",
      title: "TEST PARA ANNA E. · CARMEN DURAN",
      description:
        " Fotos de book/test realizadas en estudio por el fotógrafo valenciano Pablo Puche para la modelo...",
      tags: ["estilismo", "model test"],
      top: "5%",
      left: "73%",
    },
    {
      id: "windable",
      img: "/assets/images/windable-icon-00.png",
      type: "fashion",
      slug: "windable",
      title: "COLECCIÓN WINDABLE",
      description: "  ",
      tags: ["Estilismo", "Post-producción"],
      top: "20%",
      left: "6%",
    },
    {
      id: "readytoconsume",
      img: "/assets/images/readytoconsume-00-icon.jpg",
      type: "fashion",
      slug: "readytoconsume",
      title: "PRINTED EDITORIAL · READY-TO-CONSUME",
      description:
        "Editorial publicado en una revista indie que da visibilidad a graduados en diseño de moda...",
      tags: ["estilismo", "dirección"],
      top: "20%",
      left: "40%",
    },
    {
      id: "collage",
      img: "/assets/images/collage-mobile.png",
      type: "fashion",
      slug: "collage",
      title: "COLECCIÓN DE COLLAGES",
      description:
        "El collage forma parte de mi proceso como creativa, pero sobre todo como estilista, y ha termina...",
      tags: ["mixed-media", "post-producción"],
      top: "21.5%",
      left: "71%",
    },
    {
      id: "circle1",
      img: "/assets/images/circle-yellow.png",
      top: "75vh",
      left: "46%",
    },
    {
      id: "circle2",
      img: "/assets/images/circle-yellow.png",
      top: "50vh",
      left: "76%",
    },
  ];

  //GRAFICO
  const graphicProjects = [
    {
      id: "080barcelonafashionweek",
      img: "/assets/images/graphicdesign-080barcelonafashionweek-icon.png",
      type: "graphic",
      slug: "080fbarcelonafashionweek",
      title: "080 BARCELONA FASHION WEEK",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["", "model test"],
      top: "5%",
      left: "25%",
    },
    {
      id: "pablopuche-graphic",
      img: "/assets/images/graphic.png",
      type: "graphic",
      slug: "080fbarcelonafashionweek",
      title: "LETTERING",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["styling", "model test"],
      top: "0%",
      left: "5%",
    },
    {
      id: "thinmagazine",
      img: "/assets/images/portada4.png",
      type: "graphic",
      slug: "thinmagazine",
      title: "LETTERING",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["styling", "model test"],
      top: "5%",
      left: "2%",
    },
  ];

  //WEB
  const webProjects = [
    {
      id: "pablopuche-web",
      img: "/assets/images/pablopuche-anne.png",
      type: "web",
      slug: "flower",
      title: "TEST FOR ANNE · AMODELS",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["styling", "model test"],
      top: "5%",
      left: "25%",
    },
  ];

  // --- CONTENEDORES ---
  const fashionContainer = document.getElementById("fashion-projects");
  const graphicContainer = document.getElementById("graphic-projects");
  const webContainer = document.getElementById("web-projects");

  const tooltip = document.getElementById("project-description");
  const tooltipTitle = document.getElementById("tooltip-title");
  const tooltipDescription = document.getElementById("tooltip-description");
  const tooltipTags = document.getElementById("tooltip-tags");
  const tooltipCTA = document.getElementById("tooltip-cta");

  const margin = 0;
  const savedPositions = JSON.parse(
    localStorage.getItem("projectPositions") || "{}"
  );
  const isMobile = window.innerWidth <= 768;
  let mobilePatternCounter = 0;

  // --- FUNCION DE RENDERIZADO ---
  function renderProjects(projectList, targetContainer) {
    if (!targetContainer) return;

    projectList.forEach((project) => {
      const a = document.createElement("a");
      a.href =
        project.slug && project.type
          ? `/projects/singleproject.html?type=${project.type}&slug=${project.slug}`
          : "#";
      a.className = "project-item";
      a.style.position = isMobile ? "static" : "absolute";
      a.style.cursor = isMobile ? "default" : "grab";
      a.setAttribute("data-id", project.id);
      a.setAttribute(
        "data-tags",
        project.tags ? project.tags.map((t) => t.toLowerCase()).join(",") : ""
      );

      const img = document.createElement("img");
      img.src = project.img;
      img.alt = project.id;
      img.draggable = false;

      if (!project.slug) {
        a.classList.add("decorative");
        img.style.width = "12px";
        img.style.height = "12px";
      }

      if (isMobile) {
        if (mobilePatternCounter % 3 === 2) {
          a.classList.add("span-full");
        } else {
          a.classList.add("span-half");
        }
        mobilePatternCounter++;
      } else {
        const saved = savedPositions[project.id];
        if (saved) {
          a.style.top = saved.top;
          a.style.left = saved.left;
        } else {
          a.style.top = project.top;
          a.style.left = project.left;
        }
      }

      a.appendChild(img);
      targetContainer.appendChild(a);

      if (project.description && !isMobile) {
        a.addEventListener("mouseenter", () => {
          tooltipTitle.textContent = project.title || "";
          tooltipDescription.textContent = project.description || "";
          tooltipTags.innerHTML = project.tags
            ? project.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join(" ")
            : "";
          tooltipCTA.textContent = project.cta || "";
          tooltipCTA.href = project.link || "#";
          tooltip.classList.add("show");
        });
        a.addEventListener("mouseleave", () => {
          tooltip.classList.remove("show");
        });
      }

      if (!isMobile) enableDrag(a, project.id, targetContainer);
    });
  }

  // --- FUNCION DE DRAG ---
  function enableDrag(element, id, containerRef) {
    let isDragging = false;
    let offsetX = 0,
      offsetY = 0;
    let moved = false;

    element.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      isDragging = true;
      moved = false;
      element.style.zIndex = 1000;
      element.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      moved = true;
      const containerRect = containerRef.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      let x = e.clientX - offsetX - containerRect.left;
      let y = e.clientY - offsetY - containerRect.top;
      if (x < margin) x = margin;
      if (y < margin) y = margin;
      if (x > containerRect.width - elementRect.width - margin)
        x = containerRect.width - elementRect.width - margin;
      if (y > containerRef.offsetHeight - elementRect.height - margin)
        y = containerRef.offsetHeight - elementRect.height - margin;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      element.style.cursor = "grab";
      if (moved) {
        e.preventDefault();
        element.addEventListener(
          "click",
          function preventClick(clickEvent) {
            clickEvent.preventDefault();
            element.removeEventListener("click", preventClick);
          },
          { once: true }
        );

        const containerRect = containerRef.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const leftPercent =
          ((elementRect.left - containerRect.left) / containerRect.width) * 100;
        const topPercent =
          ((elementRect.top - containerRect.top) / containerRect.height) * 100;

        const currentPositions = JSON.parse(
          localStorage.getItem("projectPositions") || "{}"
        );
        currentPositions[id] = {
          top: `${topPercent.toFixed(2)}%`,
          left: `${leftPercent.toFixed(2)}%`,
        };
        localStorage.setItem(
          "projectPositions",
          JSON.stringify(currentPositions)
        );
        element.style.top = `${topPercent.toFixed(2)}%`;
        element.style.left = `${leftPercent.toFixed(2)}%`;
      }
    });

    element.addEventListener("dragstart", (e) => e.preventDefault());
  }

  // --- RENDERIZADO ---
  renderProjects(projects, fashionContainer);
  renderProjects(graphicProjects, graphicContainer);
  renderProjects(webProjects, webContainer);

  // --- CARGAR SINGLE PROJECT ---
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const type = params.get("type") || "fashion";

  if (slug) {
    fetch(`/projects/${type}/${slug}.json`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`No se encontró /projects/${type}/${slug}.json`);
        return res.json();
      })
      .then((data) => {
        document.getElementById("project-title").textContent = data.title || "";
        document.getElementById("project-description").textContent =
          data.description || "";
        document.getElementById("project-image").src = data.img || "";
      })
      .catch((err) => console.error(err));
  }

  function renderMoreProjects(allProjects, currentSlug) {
    const container = document.getElementById("more-projects-scroll");
    if (!container) return;

    allProjects
      .filter((project) => project.slug && project.slug !== currentSlug) // <-- solo proyectos con slug
      .forEach((project) => {
        const img = document.createElement("img");
        img.src = project.img;
        img.alt = project.title || project.id;
        img.addEventListener("click", () => {
          window.location.href = `/projects/singleproject.html?type=${project.type}&slug=${project.slug}`;
        });
        container.appendChild(img);
      });
  }

  // --- Ejecutar la función ---
  if (slug) {
    renderMoreProjects(projects, slug); // si quieres solo moda
    // si quieres todos los tipos:
    // renderMoreProjects([...projects, ...graphicProjects, ...webProjects], slug);
  }
});

// Footer cargar
fetch("/components/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  })
  .catch((error) => console.error("Error cargando el footer:", error));
