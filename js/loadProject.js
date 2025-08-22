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
    document.getElementById("project-year").textContent = data.year;
    document.getElementById("project-title").textContent = data.title;
    document.getElementById("project-description").textContent =
      data.description;
    document.getElementById("cliente").textContent = data.cliente;
    document.getElementById("tipologia").textContent = data.tipologia;
    document.getElementById("sector").textContent = data.sector;
    document.getElementById("credits").textContent = data.credits;

    // Imagen de portada
    const coverImage = document.getElementById("cover-image");
    if (coverImage && data.coverImage) {
      coverImage.src = data.coverImage;
      coverImage.alt = data.title;
    }

    // Servicios
    const serviciosList = document.getElementById("servicios-list");
    if (serviciosList && data.servicios) {
      serviciosList.innerHTML = "";
      data.servicios.forEach((s) => {
        const li = document.createElement("li");
        li.textContent = s;
        serviciosList.appendChild(li);
      });
    }

    // Render dinámico de secciones
    renderSections(data.sections, data.title);
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

          // Atributos clave para iOS / Safari
          video.setAttribute("autoplay", "");
          video.setAttribute("loop", "");
          video.setAttribute("muted", "");
          video.setAttribute("playsinline", "");
          video.setAttribute("webkit-playsinline", ""); // soporte Safari antiguo

          video.controls = false; // sin controles visibles

          if (element.full) video.style.width = "100%";
          video.style.display = "block"; // para que no quede inline raro
          video.style.objectFit = "cover"; // ocupa todo el contenedor
          video.style.pointerEvents = "none"; // no interferir con clics/hover

          block.appendChild(video);

          // 🔹 Fix adicional para iOS que bloquea autoplay
          video.play().catch(() => {
            document.addEventListener(
              "touchstart",
              () => {
                video.play();
              },
              { once: true }
            );
          });
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
