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

  const path = window.location.pathname; // Ejemplo: "/views/singleproject.html"
  const search = window.location.search; // Ejemplo: "?slug=juan-vidal"

  let crumbs = [];

  if (path === "/" || path === "/index.html") {
    crumbs = ["proyectos"];
  } else if (path === "/views/fashion.html") {
    crumbs = ["proyectos", "moda"];
  } else if (path === "/views/graphic.html") {
    crumbs = ["proyectos", "gráfico"];
  } else if (
    path === "/views/singleproject.html" &&
    search.startsWith("?slug=")
  ) {
    const params = new URLSearchParams(search);
    const slug = params.get("slug") || "";
    crumbs = ["proyectos", "moda", slug.replace(/-/g, " ")];
  } else {
    // Si no reconocemos la ruta, ocultamos el breadcrumb
    breadcrumbContainer.style.display = "none";
    return;
  }

  const urlMap = {
    proyectos: "/index.html",
    moda: "/views/fashion.html",
    gráfico: "/views/graphic.html",
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

//FASHION

document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      id: "juanvidal",
      img: "/assets/images/juanvidal.jpg",
      link: "/views/singleproject.html?slug=juan-vidal",
      title: "JUAN VIDAL · BRIDAL CAMPAIGN ",
      description: "Diseño inspirado en formas naturales...",
      tags: ["editorial", "creative direction"],
      top: "20%",
      left: "80%",
    },
    {
      id: "s2smagazine",
      img: "/assets/images/s2smagazine.png",
      link: "/views/singleproject.html?slug=s2s-magazine",
      title: "Look 2",
      description: "Exploración textil contemporánea.",
      tags: ["Sostenible", "Urbano", "2025"],
      top: "40%",
      left: "30%",
    },
    {
      id: "collage",
      img: "/assets/images/collage.png",
      link: "/views/singleproject.html?slug=collage",
      title: "COLLAGE COLLECTION",
      description: "Inspirado en geometría urbana.",
      tags: ["Minimalismo", "Estructura", "2025"],
      top: "15%",
      left: "55%",
    },
    {
      id: "look4",
      img: "/assets/images/project-4.png",
      link: "/views/projects/look4.html",
      title: "Look 4",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["Color", "Juventud", "Experimental"],
      top: "5%",
      left: "25%",
    },
    {
      id: "pablopuche",
      img: "/assets/images/pablopuche-anne.png",
      link: "/views/singleproject.html?slug=pablopuche",
      title: "TEST FOR ANNE · AMODELS",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["styling", "model test"],
      top: "5%",
      left: "25%",
    },
    {
      id: "readytoconsume",
      img: "/assets/images/icon-readytoconsume.jpg",
      link: "/views/singleproject.html?slug=readytoconsume",
      title: "PRINTED EDITORIAL · READY TO CONSUME",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["styling", "model test", "editorial"],
      top: "95",
      left: "15%",
    },
    {
      id: "issue 1",
      img: "/assets/images/icon-issue1.png",
      link: "/views/singleproject.html?slug=readytoconsume",
      title: "PRINTED EDITORIAL · READY TO CONSUME",
      description: "Colores vibrantes y energía juvenil.",
      tags: ["styling", "model test"],
      top: "95",
      left: "15%",
    },
    {
      id: "circle1",
      img: "/assets/images/circle-yellow.png",
      top: "5%",
      left: "25%",
    },
    {
      id: "circle2",
      img: "/assets/images/circle-yellow.png",
      top: "35%",
      left: "75%",
    },
  ];

  const container = document.getElementById("fashion-projects");
  if (!container) {
    console.error("No se encontró el contenedor #fashion-projects");
    return;
  }

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
  let mobilePatternCounter = 0; // para controlar el patrón

  // Renderizar proyectos
  projects.forEach((project) => {
    const a = document.createElement("a");
    a.href = project.link || "#";
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

    if (!project.link) {
      a.classList.add("decorative");
      img.style.width = "12px";
      img.style.height = "12px";
    }

    if (isMobile) {
      // Asignar patrón: dos medios, uno completo
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
    container.appendChild(a);

    // Tooltip en desktop
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

    if (!isMobile) {
      enableDrag(a, project.id);
    }
  });

  // Función de drag (solo desktop)
  function enableDrag(element, id) {
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
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      let x = e.clientX - offsetX - containerRect.left;
      let y = e.clientY - offsetY - containerRect.top;
      if (x < margin) x = margin;
      if (y < margin) y = margin;
      if (x > containerRect.width - elementRect.width - margin)
        x = containerRect.width - elementRect.width - margin;
      if (y > containerRect.height - elementRect.height - margin)
        y = containerRect.height - elementRect.height - margin;
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
        const containerRect = container.getBoundingClientRect();
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
});

// CARGAR PLANTILLAS SINGLE PROJECT
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) return;

  try {
    const response = await fetch(`/views/projects/${slug}.json`);
    const data = await response.json();

    // TEXTOS BASE
    document.getElementById("project-year").textContent = data.year;
    document.getElementById("project-title").textContent = data.title;
    document.getElementById("project-description").textContent =
      data.description;
    document.getElementById("cliente").textContent = data.cliente;
    document.getElementById("tipologia").textContent = data.tipologia;
    document.getElementById("sector").textContent = data.sector;

    // COVER IMAGE
    const coverImage = document.getElementById("cover-image");
    if (coverImage && data.coverImage) {
      coverImage.src = data.coverImage;
      coverImage.alt = data.title;
    }

    // SERVICIOS
    const serviciosList = document.getElementById("servicios-list");
    if (serviciosList) {
      serviciosList.innerHTML = "";
      data.servicios.forEach((s) => {
        const li = document.createElement("li");
        li.textContent = s;
        serviciosList.appendChild(li);
      });
    }

    // PRIMERA GALERÍA (images)
    const gallery = document.getElementById("image-gallery");
    if (gallery && Array.isArray(data.images)) {
      gallery.innerHTML = "";
      data.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = data.title;
        gallery.appendChild(img);
      });
    }

    // BLOQUE DE TEXTO ADICIONAL (info-1)
    const infoBlock = document.getElementById("info-1");
    if (infoBlock && data["info-1"]) {
      infoBlock.textContent = data["info-1"];
    }

    // SEGUNDA GALERÍA (images2)
    const gallery2 = document.getElementById("image-gallery-2");
    if (gallery2 && Array.isArray(data.images2)) {
      gallery2.innerHTML = "";
      data.images2.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = data.title;
        gallery2.appendChild(img);
      });
    }

    // TERCERA GALERÍA (images3)
    const gallery3 = document.getElementById("image-gallery-3");
    if (gallery3 && Array.isArray(data.images3)) {
      gallery3.innerHTML = "";
      data.images3.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = data.title;
        gallery3.appendChild(img);
      });
    }
  } catch (err) {
    console.error("Error al cargar el proyecto:", err);
  }
});

// Footer cargar
fetch("/components/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  })
  .catch((error) => console.error("Error cargando el footer:", error));
