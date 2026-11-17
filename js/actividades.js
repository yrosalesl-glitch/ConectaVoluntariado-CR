document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedorActividades");
  const selectCategoria = document.getElementById("selectCategoria");
  let listaActividades = [];

  // Cargar datos desde el JSON
  fetch("data/actividades.json")
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar los datos");
      return res.json();
    })
    .then((data) => {
      listaActividades = data;
      renderizarActividades(listaActividades);
    })
    .catch((error) => {
      contenedor.innerHTML = `<p style="color:red;">Error al cargar las actividades. Por favor intente más tarde.</p>`;
      console.error(error);
    });

  // Función para renderizar tarjetas en el DOM
  function renderizarActividades(actividades) {
    contenedor.innerHTML = "";

    if (actividades.length === 0) {
      contenedor.innerHTML = `<p>No se encontraron actividades disponibles para este filtro.</p>`;
      return;
    }

    actividades.forEach((act) => {
      const disponible = act.cuposDisponibles > 0;
      const cardHTML = `
        <article class="card">
          <div>
            <span class="badge">${act.categoria}</span>
            <h3>${act.titulo}</h3>
            <p><strong>Organización:</strong> ${act.organizacion}</p>
            <p><strong>Ubicación:</strong> ${act.provincia}</p>
            <p><strong>Fecha:</strong> ${act.fecha} (${act.hora})</p>
            <p>${act.descripcion}</p>
          </div>
          <div style="margin-top: 1rem;">
            <p class="${disponible ? '' : 'no-cupos'}">
              <strong>Cupos disponibles:</strong> ${act.cuposDisponibles}
            </p>
            ${
              disponible 
                ? `<a href="inscripcion.html" class="btn-primary" style="display:block; text-align:center;">Postularse</a>`
                : `<button class="btn-primary" disabled style="background:#ccc; cursor:not-allowed; width:100%;">Cupo Lleno</button>`
            }
          </div>
        </article>
      `;
      contenedor.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  // Filtrado por categoría
  selectCategoria.addEventListener("change", (e) => {
    const categoriaSeleccionada = e.target.value;
    if (categoriaSeleccionada === "todas") {
      renderizarActividades(listaActividades);
    } else {
      const filtradas = listaActividades.filter(
        (act) => act.categoria === categoriaSeleccionada
      );
      renderizarActividades(filtradas);
    }
  });
});