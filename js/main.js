//Cargar el Header
function loadHeader() {
  const headerFile =
    window.location.pathname === "/about.html"
      ? "/components/headerabout.html"
      : "/components/header.html";

  fetch(headerFile)
    .then((res) => res.text())
    .then((html) => {
      // Insertar el HTML del header
      const headerPlaceholder = document.getElementById("header-placeholder");
      headerPlaceholder.innerHTML = html;

      // ======== INICIO: Header hide/show on scroll ========
      let lastScroll = 0;
      const headerEl =
        headerPlaceholder.querySelector("header") ||
        headerPlaceholder.firstElementChild;
      if (headerEl) {
        window.addEventListener("scroll", () => {
          const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          if (currentScroll > lastScroll && currentScroll > 50) {
            // Scrolling down
            headerEl.style.transform = "translateY(-100%)";
          } else {
            // Scrolling up (mínimo movimiento)
            headerEl.style.transform = "translateY(0)";
          }
          lastScroll = currentScroll <= 0 ? 0 : currentScroll; // Evitar valores negativos
        });
        // Añadir transición suave
        headerEl.style.transition = "transform 0.3s ease";
      }
      // ======== FIN: Header hide/show on scroll ========

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

      requestAnimationFrame(() => {
        updateLogoBasedOnTheme();
      });

      document.addEventListener("click", (e) => {
        const toggle = e.target.closest(".theme-toggle");
        if (toggle) {
          setTimeout(() => {
            updateLogoBasedOnTheme();
          }, 50);
        }
      });

      // Funciones del header
      initMenuToggle();
      initActiveLinkHighlight();
      initBreadcrumbs();

      // Añadir clase project a spans según página
      document.querySelectorAll(".nav-span").forEach((span) => {
        const path = window.location.pathname;
        if (path.startsWith("/projects/") || path === "/about.html") {
          span.classList.add("project");
        } else {
          span.classList.remove("project");
        }
      });

      // Mostrar el contenido principal
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

  const path = window.location.pathname;
  const search = window.location.search;

  let crumbs = [];

  if (path === "/" || path === "/index.html") {
    crumbs = []; // ya tienes "proyectos" en HTML
  } else if (path === "/fashion.html") {
    crumbs = ["fashion"];
  } else if (path === "/graphic.html") {
    crumbs = ["graphic"];
  } else if (path === "/web.html") {
    crumbs = ["web dev"];
  } else if (path === "/projects/singleproject.html") {
    const params = new URLSearchParams(search);
    const type = params.get("type");
    const slug = params.get("slug") || "";

    let categoryName = "";
    if (type === "fashion") categoryName = "moda";
    else if (type === "graphic") categoryName = "gráfico";
    else if (type === "web") categoryName = "web dev";

    crumbs = [categoryName, slug.replace(/-/g, " ")];
  } else {
    breadcrumbContainer.style.display = "none";
    return;
  }

  const urlMap = {
    moda: "/fashion.html",
    gráfico: "/graphic.html",
    "web dev": "/web.html",
  };

  let html = `<nav aria-label="breadcrumb" class="breadcrumb">`;

  crumbs.forEach((crumb, index) => {
    const isLast = index === crumbs.length - 1;
    if (!isLast) {
      html += `<a href="${
        urlMap[crumb] || "#"
      }" class="breadcrumb-link">${crumb}</a>`;
      html += `<span class="breadcrumb-separator">+</span>`;
    } else {
      html += `<span class="breadcrumb-current">${crumb}</span>`;
    }
  });

  html += `</nav>`;

  breadcrumbContainer.innerHTML = html;
  breadcrumbContainer.style.display = "inline"; // no block, para que encaje con tu [ ]
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

  const imgEl = document.getElementById("miImagen");
  if (imgEl) {
    imgEl.src = "imagen.jpg";
  }
  const defaultLeft = Array.from(leftTexts).map((p) => p.textContent);
  const defaultRight = Array.from(rightTexts).map((p) => p.textContent);

  const content = {
    moda: {
      img: "/assets/images/project-2.jpg",
      left: ["", "", "styling"],
      right: ["creative direction", "", ""],
    },
    gráfico: {
      img: "/assets/images/graphicdesign-080barcelonafashionweek-icon.jpg",
      left: ["art direction", "lettering", "branding"],
      right: ["editorial", "web design", "motion graphic"],
    },
    web: {
      img: "/assets/images/web12.png",
      left: ["ux/ui", "design", "prototyping"],
      right: ["frontend", "responsive", "interactive"],
    },
  };

  function fadeTexts(textElements, newTexts) {
    textElements.forEach((p) => p.classList.add("text-fade-out"));

    setTimeout(() => {
      textElements.forEach((p, i) => {
        p.textContent = newTexts[i] || "";
        p.classList.remove("text-fade-out");
        p.classList.add("text-fade-in");
      });

      setTimeout(() => {
        textElements.forEach((p) => p.classList.remove("text-fade-in"));
      }, 100); // duración de la transición
    }, 100); // coincide con fade-out
  }

  function fadeChange(newImg, left, right) {
    img.classList.add("fade-out");
    setTimeout(() => {
      img.src = newImg;
      img.classList.remove("fade-out");
      img.classList.add("fade-in");
      setTimeout(() => img.classList.remove("fade-in"), 250);
    }, 250);

    fadeTexts(leftTexts, left);
    fadeTexts(rightTexts, right);
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const key = link.dataset.section; // "moda", "gráfico", "web"
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
      title: "FITTINGS FOR HANNY",
      tags: ["styling", "post-production"],
    },
    {
      id: "juanvidal",
      img: "/assets/images/juanvidal-00-icon1.jpg",
      type: "fashion",
      slug: "juan-vidal",
      title: "JUAN VIDAL BRIDAL CAMPAIGN",
      tags: ["art direction", "creative direction", "post-production"],
    },
    {
      id: "pablopuche",
      img: "/assets/images/pablopuche-00-icon.jpg",
      type: "fashion",
      slug: "pablopuche",
      title: "MODEL TEST FOR ANNA",
      tags: ["styling"],
    },
    {
      id: "windable",
      img: "/assets/images/windable-icon-00.png",
      type: "fashion",
      slug: "windable",
      title: "WINDABLE COLLECTION",
      tags: ["styling", "post-production"],
    },
    {
      id: "readytoconsume",
      img: "/assets/images/readytoconsume-00-icon.jpg",
      type: "fashion",
      slug: "readytoconsume",
      title: "PRINTED EDITORIAL READY-TO-CONSUME",
      tags: ["styling", "creative direction", "casting"],
    },
    {
      id: "collage",
      img: "/assets/images/collage-mobile.png",
      type: "fashion",
      slug: "collage",
      title: "COLLAGE COLLECTION",
      tags: ["mixed-media", "post-production"],
    },
  ];

  //GRAFICO
  const graphicProjects = [
    {
      id: "080barcelonafashionweek",
      img: "/assets/images/graphicdesign-080barcelonafashionweek-icon.jpg ",
      type: "graphic",
      slug: "barcelonafashionweek",
      title: "080 BARCELONA FASHION WEEK",
      tags: ["brand application", "visual design", "web"],
    },
    {
      id: "thinmagazine",
      img: "/assets/images/graphicdesign-thin-002.png",
      type: "graphic",
      slug: "thinmagazine",
      title: "THIN MAGAZINE · DISEÑO EDITORIAL",
      tags: ["branding", "editorial design", "web"],
    },
    {
      id: "thelab",
      img: "/assets/images/005.png",
      type: "graphic",
      slug: "thelab",
      title: "THE LAB ",
      tags: ["my visual", "playground"],
    },
  ];

  //WEB
  const webProjects = [
    {
      id: "thinmagazine",
      img: "/assets/images/web-thin-icon.png",
      type: "web",
      slug: "thinmagazine",
      title: "TEST FOR ANNE · AMODELS",
      tags: ["styling", "model test"],
    },
    {
      id: "miriamreina",
      img: "/assets/images/web-miriam-icon.png",
      type: "web",
      slug: "miriamreina",
      title: "TEST FOR ANNE · AMODELS",
      tags: ["styling", "model test"],
    },
    {
      id: "thefolder",
      img: "/assets/images/web-miriam-icon2.png",
      type: "web",
      slug: "miriamreina",
      title: "TEST FOR ANNE · AMODELS",
      tags: ["styling", "model test"],
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

  const isMobile = window.innerWidth <= 768;

  // --- FUNCION DE RENDERIZADO ---
  function renderProjects(projectList, targetContainer) {
    if (!targetContainer) return;

    // --- bandera de hover activado ---
    let hoverEnabled = false;

    // Listener para activar hover cuando el usuario mueva el ratón conscientemente
    const mouseMoveHandler = () => {
      hoverEnabled = true;
      targetContainer.removeEventListener("mousemove", mouseMoveHandler);
    };
    targetContainer.addEventListener("mousemove", mouseMoveHandler);

    // Limpiar contenedor
    targetContainer.innerHTML = "";

    // Contenedor principal
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    targetContainer.appendChild(wrapper);

    // Grid
    const grid = document.createElement("div");
    grid.className = "projects-grid";
    wrapper.appendChild(grid);

    // Overlay para los textos
    const overlay = document.createElement("div");
    overlay.className = "projects-overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none"; // que no interfiera con hover
    wrapper.appendChild(overlay);

    projectList.forEach((project, index) => {
      const item = document.createElement("div");
      item.className = "project-grid-item";
      item.dataset.index = index;

      const img = document.createElement("img");
      img.src = project.img;
      img.alt = project.title || project.id;
      img.draggable = false;
      item.appendChild(img);

      // Hover
      item.addEventListener("mouseenter", () => {
        if (!hoverEnabled) return; // <-- NO hacer nada hasta que el usuario mueva el ratón

        // TODO: Aquí va toda tu lógica original de hover sin cambiar nada
        Array.from(grid.children).forEach((child) => {
          if (child !== item) child.style.opacity = "0";
        });

        const titleCol = document.createElement("div");
        titleCol.className = "text-col column-text-title";
        titleCol.textContent = project.title;

        const tagsCol = document.createElement("div");
        tagsCol.className = "text-col column-text-tags";
        tagsCol.textContent = project.tags ? project.tags.join(" + ") : "";

        titleCol.style.position = "absolute";
        tagsCol.style.position = "absolute";

        const col = (index % 3) + 1;

        if (col === 1) {
          titleCol.style.left = "110%";
          tagsCol.style.left = "220%";
        } else if (col === 2) {
          titleCol.style.left = "-110%";
          tagsCol.style.left = "110%";
        } else {
          titleCol.style.left = "-220%";
          tagsCol.style.left = "-110%";
        }

        titleCol.style.top = "0";
        tagsCol.style.top = "50%";
        titleCol.style.transform = "translateY(0)";
        tagsCol.style.transform = "translateY(-50%)";

        item.appendChild(titleCol);
        item.appendChild(tagsCol);

        item._titleCol = titleCol;
        item._tagsCol = tagsCol;
      });

      item.addEventListener("mouseleave", () => {
        Array.from(grid.children).forEach(
          (child) => (child.style.opacity = "1")
        );

        if (item._titleCol) {
          item.removeChild(item._titleCol);
          item.removeChild(item._tagsCol);
          item._titleCol = null;
          item._tagsCol = null;
        }
      });

      // Click
      item.addEventListener("click", () => {
        if (!project.slug || !project.type) return;
        window.location.href = `/projects/singleproject.html?type=${project.type}&slug=${project.slug}`;
      });

      grid.appendChild(item);
    });
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

  // --- RENDER DE MÁS PROYECTOS ---
  function renderMoreProjects(allProjects, currentSlug) {
    const container = document.getElementById("more-projects-scroll");
    if (!container) return;

    allProjects
      .filter((project) => project.slug && project.slug !== currentSlug)
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
    renderMoreProjects(projects, slug);
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
