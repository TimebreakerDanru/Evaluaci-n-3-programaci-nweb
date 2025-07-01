import { mostrarError } from "./utils.js";

const equiposUrl = "http://localhost:8787/equipos";

const form = document.getElementById("equipoForm");
const tabla = document.getElementById("equiposTabla");

async function cargarEquipos() {
  try {
    const res = await fetch(equiposUrl);
    const equipos = await res.json();
    tabla.innerHTML = "";
    equipos.forEach(eq => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${eq.id}</td>
        <td>${eq.name}</td>
        <td>${eq.league}</td>
        <td>
          <button onclick="editarEquipo(${eq.id}, '${eq.name}', '${eq.league}')">Editar</button>
          <button onclick="eliminarEquipo(${eq.id})">Eliminar</button>
        </td>`;
      tabla.appendChild(row);
    });
  } catch {
    mostrarError("Error al cargar equipos.");
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("equipoId").value;
  const name = document.getElementById("equipoNombre").value;
  const league = document.getElementById("liga").value;

  try {
    const res = await fetch(id ? `${equiposUrl}/${id}` : equiposUrl, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, league })
    });

    if (!res.ok) return mostrarError(await res.text());

    form.reset();
    cargarEquipos();
  } catch {
    mostrarError("No se pudo guardar el equipo.");
  }
});

window.editarEquipo = (id, name, league) => {
  document.getElementById("equipoId").value = id;
  document.getElementById("equipoNombre").value = name;
  document.getElementById("liga").value = league;
};

window.eliminarEquipo = async (id) => {
  try {
    const res = await fetch(`${equiposUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) return mostrarError(await res.text());
    cargarEquipos();
  } catch {
    mostrarError("No se pudo eliminar el equipo.");
  }
};

cargarEquipos();
