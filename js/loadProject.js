document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) return;

  try {
    const response = await fetch(`/views/projects/${slug}.json`);
    const data = await response.json();

    // Mostrar contenido
    document.getElementById("main-content").style.display = "block";
    document.title = `Miriam Reina - ${data.title}`;

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

    // Render dinámico de secciones con soporte para layouts anidados
    renderSections(data.sections, data.title);
  } catch (err) {
    console.error("Error al cargar el proyecto:", err);
  }
});

function renderSections(sections, title) {
  const container = document.getElementById("dynamic-content");
  if (!container || !sections) return;

  container.innerHTML = "";

  // Función recursiva para renderizar elementos (y layouts anidados)
  function renderElements(elements) {
    const fragment = document.createDocumentFragment();

    elements.forEach((element) => {
      if (element.layout && element.elements) {
        // Crear contenedor con clase según el layout (row, column, column-text)
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

        if (element.class) {
          layoutDiv.classList.add(element.class);
        }

        if (element.full) {
          layoutDiv.classList.add("full");
        }

        const children = renderElements(element.elements);
        layoutDiv.appendChild(children);

        fragment.appendChild(layoutDiv);
      } else {
        // Elemento simple: imagen o texto
        const block = document.createElement("div");

        if (element.class) {
          block.classList.add(element.class);
        }

        if (element.full) {
          block.classList.add("full");
        }

        if (element.type === "image") {
          const img = document.createElement("img");
          img.src = element.src;
          img.alt = element.alt || title;
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

    if (section.class) {
      sectionDiv.classList.add(section.class);
    }

    if (section.full) {
      sectionDiv.classList.add("full");
    }

    const content = renderElements(section.elements);
    sectionDiv.appendChild(content);

    container.appendChild(sectionDiv);
  });
}
