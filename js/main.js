// Cargar header.html dinámicamente o headerabout.html
function loadHeader() {
  const headerFile =
    window.location.pathname === "/about.html"
      ? "/components/headerabout.html"
      : "/components/header.html";

  fetch(headerFile)
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
    crumbs = ["moda"];
  } else if (path === "/graphic.html") {
    crumbs = ["gráfico"];
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

  const defaultImg = img.src;
  const defaultLeft = Array.from(leftTexts).map((p) => p.textContent);
  const defaultRight = Array.from(rightTexts).map((p) => p.textContent);

  const content = {
    moda: {
      img: "/assets/images/project-2.jpg",
      left: ["", "", "estilismo"],
      right: ["dirección creativa", "", ""],
    },
    gráfico: {
      img: "/assets/images/graphicdesign-080barcelonafashionweek-icon.jpg",
      left: ["", "lettering", "diseño editorial"],
      right: ["branding", "diseño visual", ""],
    },
    web: {
      img: "/assets/images/web12.png",
      left: ["UI Design", "Frontend", "Prototyping"],
      right: ["UX", "Responsive", "Webflow"],
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
      title: "BTS - Hanny Pineiro",
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
      img: "/assets/images/graphicdesign-080barcelonafashionweek-icon.jpg ",
      type: "graphic",
      slug: "barcelonafashionweek",
      title: "080 BARCELONA FASHION WEEK",
      tags: ["brand application", "visual design"],
      top: "5%",
      left: "25%",
    },
    {
      id: "thinmagazine",
      img: "/assets/images/graphicdesign-thin-002.png",
      type: "graphic",
      slug: "thinmagazine",
      title: "THIN MAGAZINE · DISEÑO EDITORIAL",
      tags: ["branding", "editorial design"],
      top: "5%",
      left: "2%",
    },
    {
      id: "thelab",
      img: "/assets/images/005.png",
      type: "graphic",
      slug: "thelab",
      title: "THE LAB · RECOPILATORY",
      tags: ["styling", "model test"],
      top: "0%",
      left: "5%",
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
      top: "5%",
      left: "25%",
    },
    {
      id: "miriamreina",
      img: "/assets/images/web-miriam-icon.png",
      type: "web",
      slug: "miriamreina",
      title: "TEST FOR ANNE · AMODELS",

      tags: ["styling", "model test"],
      top: "15%",
      left: "25%",
    },
    {
      id: "thefolder",
      img: "/assets/images/web-miriam-icon2.png",
      type: "web",
      slug: "miriamreina",
      title: "TEST FOR ANNE · AMODELS",

      tags: ["styling", "model test"],
      top: "15%",
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

  const isMobile = window.innerWidth <= 768;

  // --- FUNCION DE RENDERIZADO ---
  function renderProjects(projectList, targetContainer) {
    if (!targetContainer) return;

    // Limpiar contenedor
    targetContainer.innerHTML = "";

    // Crear grid
    const grid = document.createElement("div");
    grid.className = "projects-grid"; // lo estilamos en CSS
    targetContainer.appendChild(grid);

    projectList.forEach((project) => {
      const item = document.createElement("div");
      item.className = "project-grid-item";

      const img = document.createElement("img");
      img.src = project.img;
      img.alt = project.title || project.id;
      img.draggable = false;

      item.appendChild(img);

      // Columnas de texto ocultas
      const textOverlay = document.createElement("div");
      textOverlay.className = "text-columns";
      textOverlay.innerHTML = `
      <div class="text-col">${project.title || ""}</div>
      <div class="text-col">${project.tags ? project.tags.join(", ") : ""}</div>
    `;
      item.appendChild(textOverlay);

      // Hover: mostrar solo esta imagen y su texto
      item.addEventListener("mouseenter", () => {
        Array.from(grid.children).forEach((child) => {
          if (child !== item) child.style.opacity = "0"; // desaparecen
        });
        textOverlay.style.opacity = "1"; // mostrar columnas
      });

      item.addEventListener("mouseleave", () => {
        Array.from(grid.children).forEach((child) => {
          child.style.opacity = "1"; // vuelven
        });
        textOverlay.style.opacity = "0"; // ocultar columnas
      });

      // Tooltip
      item.addEventListener("mouseenter", () => {
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
      item.addEventListener("mouseleave", () =>
        tooltip.classList.remove("show")
      );

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
