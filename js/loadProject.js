document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const type = params.get("type") || "fashion";

  if (slug) {
    // Cargar proyecto individual
    await loadProject(slug, type);
  } else {
    // Cargar todos los proyectos del tipo
    await loadAllProjects(type);
  }
});

async function loadProject(slug, type) {
  try {
    const response = await fetch(`/projects/${type}/${slug}.json`);
    if (!response.ok)
      throw new Error(
        `No se encontró el proyecto: /projects/${type}/${slug}.json`
      );
    const data = await response.json();

    // Mostrar contenido principal
    const mainContent = document.getElementById("main-content");
    mainContent.style.display = "block";
    mainContent.classList.add(type);
    document.title = `Miriam Reina - ${data.title} [${type}]`;

    // Datos principales
    document.getElementById("project-year").textContent = data.year || "";
    document.getElementById("project-title").textContent = data.title || "";
    document.getElementById("project-description").textContent =
      data.description || "";
    document.getElementById("credits").textContent = data.credits || "";

    // Imagen de portada
    const coverImage = document.getElementById("cover-image");
    if (coverImage && data.coverImage) {
      coverImage.src = data.coverImage;
      coverImage.alt = data.title || "";
    }

    // ----- META SEGÚN TIPO -----
    const projectMeta = document.querySelector(".project-meta");
    const serviceBoxes = projectMeta
      ? projectMeta.querySelectorAll(".service-container")
      : [];
    const clienteBox = serviceBoxes[0];
    const tipologiaBox = serviceBoxes[1];
    const sectorBox = serviceBoxes[2];
    const serviciosBox = serviceBoxes[3]; // este lo dejamos igual

    if (type === "web") {
      // Ocultar Cliente / Tipología / Sector
      if (clienteBox) clienteBox.style.display = "none";
      if (tipologiaBox) tipologiaBox.style.display = "none";
      if (sectorBox) sectorBox.style.display = "none";

      // Crear (o reutilizar) contenedor de enlace externo
      let linkBox = document.getElementById("external-link-box");
      if (!linkBox && projectMeta) {
        linkBox = document.createElement("div");
        linkBox.className = "service-container";
        linkBox.id = "external-link-box";

        const label = document.createElement("p");
        label.innerHTML = "<strong>Link</strong>";

        const a = document.createElement("a");
        a.id = "external-link";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "external-link";

        linkBox.appendChild(label);
        linkBox.appendChild(a);

        // lo insertamos al principio del bloque meta
        projectMeta.insertBefore(linkBox, projectMeta.firstChild);
      }

      // Rellenar el enlace
      const linkEl = document.getElementById("external-link");
      if (linkEl) {
        const url = data.link || data.url || "#";
        linkEl.href = url;

        // Mostrar la URL limpia (sin https:// ni http:// ni www.)
        let displayUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
        linkEl.textContent = displayUrl;

        // Añadir flecha ↗
        linkEl.textContent = `${displayUrl} ↗`;

        // Opcional: abrir en nueva pestaña
        linkEl.target = "_blank";
        linkEl.rel = "noopener noreferrer";

        if (!data.link && !data.url) {
          linkEl.style.pointerEvents = "none";
          linkEl.style.opacity = "0.5";
        }
      }
    } else {
      // Mostrar versión normal (fashion / graphic)
      if (clienteBox) clienteBox.style.display = "";
      if (tipologiaBox) tipologiaBox.style.display = "";
      if (sectorBox) sectorBox.style.display = "";

      document.getElementById("cliente").textContent = data.cliente || "";
      document.getElementById("tipologia").textContent = data.tipologia || "";
      document.getElementById("sector").textContent = data.sector || "";

      // Quitar el bloque de enlace si quedó de un proyecto "web" previo
      const linkBox = document.getElementById("external-link-box");
      if (linkBox) linkBox.remove();
    }

    // Servicios (igual para todos si existe)
    const serviciosList = document.getElementById("servicios-list");
    if (serviciosList) {
      serviciosList.innerHTML = "";
      if (Array.isArray(data.servicios)) {
        data.servicios.forEach((s) => {
          const li = document.createElement("li");
          li.textContent = s;
          serviciosList.appendChild(li);
        });
      }
    }

    // Render dinámico de secciones
    renderSections(data.sections, data.title);

    // 🚀 Cargar más proyectos de la misma tipología
    await loadMoreProjects(slug, type);
  } catch (err) {
    console.error("Error al cargar el proyecto:", err);
  }
}

async function loadAllProjects(type) {
  try {
    const response = await fetch(`/projects/${type}/index.json`);
    if (!response.ok)
      throw new Error(`No se pudo cargar index.json para ${type}`);
    const projects = await response.json();

    const container = document.getElementById(`${type}-projects`);
    if (!container) return;

    projects.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("project-card");
      div.innerHTML = `
        <a href="?slug=${p.slug}&type=${type}">
          <img src="${p.coverImage}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>${p.year}</p>
        </a>
      `;
      container.appendChild(div);
    });

    container.style.display = "grid"; // o el estilo que tengas para tu grid
  } catch (err) {
    console.error("Error al cargar proyectos:", err);
  }
}

function renderSections(sections, title) {
  const container = document.getElementById("dynamic-content");
  if (!container || !sections) return;

  container.innerHTML = "";

  function renderElements(elements) {
    const fragment = document.createDocumentFragment();

    elements.forEach((element) => {
      if (element.layout && element.elements) {
        const layoutDiv = document.createElement("div");

        switch (element.layout) {
          case "column":
            layoutDiv.classList.add("section-column");
            break;
          case "column-text":
            layoutDiv.classList.add("section-column-text");
            break;
          case "row":
          default:
            layoutDiv.classList.add("section-row");
            break;
        }

        if (element.class) layoutDiv.classList.add(element.class);
        if (element.full) layoutDiv.classList.add("full");

        const children = renderElements(element.elements);
        layoutDiv.appendChild(children);

        fragment.appendChild(layoutDiv);
      } else {
        const block = document.createElement("div");
        if (element.class) block.classList.add(element.class);
        if (element.full) block.classList.add("full");

        if (
          element.type === "video" ||
          (element.type === "image" && element.src?.endsWith(".mp4"))
        ) {
          const video = document.createElement("video");
          video.src = element.src;
          video.alt = element.alt || title;

          // Reproducción automática tipo GIF
          video.autoplay = true; // reproducir automáticamente
          video.loop = true; // repetir infinitamente
          video.muted = true; // obligatorio para autoplay
          video.playsInline = true; // evitar pantalla completa en móviles
          video.controls = false; // ocultar controles

          if (element.class) video.className = element.class;
          if (element.full) video.style.width = "100%";

          block.appendChild(video);
        } else if (element.type === "image") {
          const img = document.createElement("img");
          img.src = element.src;
          img.alt = element.alt || title;
          if (element.class) img.className = element.class;
          if (element.full) img.style.width = "100%";
          block.appendChild(img);
        } else if (element.type === "text") {
          const p = document.createElement("p");
          p.textContent = element.content;
          block.appendChild(p);
        }

        fragment.appendChild(block);
      }
    });

    return fragment;
  }

  sections.forEach((section) => {
    const sectionDiv = document.createElement("div");

    switch (section.layout) {
      case "column":
        sectionDiv.classList.add("section-column");
        break;
      case "column-text":
        sectionDiv.classList.add("section-column-text");
        break;
      case "row":
      default:
        sectionDiv.classList.add("section-row");
        break;
    }

    if (section.class) sectionDiv.classList.add(section.class);
    if (section.full) sectionDiv.classList.add("full");

    const content = renderElements(section.elements);
    sectionDiv.appendChild(content);

    container.appendChild(sectionDiv);
  });
}
async function loadMoreProjects(currentSlug, type) {
  try {
    // Seleccionamos el array correcto según el type
    let projectsArray = [];
    if (type === "fashion") projectsArray = projects;
    if (type === "graphic") projectsArray = graphicProjects;
    if (type === "web") projectsArray = webProjects;

    const container = document.getElementById("more-projects-scroll");
    if (!container) return;

    container.innerHTML = "";

    projectsArray
      .filter((p) => p.slug !== currentSlug) // no repetimos el actual
      .forEach((p) => {
        const div = document.createElement("div");
        div.classList.add("project-card");
        div.innerHTML = `
          <a href="?slug=${p.slug}&type=${type}">
            <img src="${p.img}" alt="${p.title}">
          </a>
        `;
        container.appendChild(div);
      });
  } catch (err) {
    console.error("Error al cargar más proyectos:", err);
  }
}
