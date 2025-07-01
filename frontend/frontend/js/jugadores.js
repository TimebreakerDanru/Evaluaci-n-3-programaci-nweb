import { mostrarError } from "./utils.js";

const jugadoresUrl = "http://localhost:8787/jugadores";
const equiposUrl = "http://localhost:8787/equipos";

const form = document.getElementById("jugadorForm");
const tabla = document.getElementById("jugadoresTabla");
const selectEquipos = document.getElementById("equipoId");

async function cargarEquipos() {
  try {
    const res = await fetch(equiposUrl);
    const equipos = await res.json();
    selectEquipos.innerHTML = "<option disabled selected>Seleccione un equipo</option>";
    equipos.forEach(eq => {
      const opt = document.createElement("option");
      opt.value = eq.name; // porque team es un string (nombre del equipo)
      opt.textContent = eq.name;
      selectEquipos.appendChild(opt);
    });
  } catch {
    mostrarError("Error al cargar equipos.");
  }
}

async function cargarJugadores() {
  try {
    const res = await fetch(jugadoresUrl);
    const jugadores = await res.json();
    tabla.innerHTML = "";
    jugadores.forEach(j => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${j.id}</td>
        <td>${j.name}</td>
        <td>${j.country}</td>
        <td>${j.birth_at}</td>
        <td>${j.team || "Sin equipo"}</td>
        <td>
          <button onclick="editarJugador(${j.id}, '${j.name}', '${j.country}', '${j.birth_at}', '${j.team}')">Editar</button>
          <button onclick="eliminarJugador(${j.id})">Eliminar</button>
        </td>`;
      tabla.appendChild(row);
    });
  } catch {
    mostrarError("Error al cargar jugadores.");
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("jugadorId").value;
  const name = document.getElementById("nombre").value;
  const country = document.getElementById("pais").value;
  const birth_at = document.getElementById("nacimiento").value;
  const team = document.getElementById("equipoId").value;

  try {
    const res = await fetch(id ? `${jugadoresUrl}/${id}` : jugadoresUrl, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, country, birth_at, team })
    });

    if (!res.ok) return mostrarError(await res.text());

    form.reset();
    cargarJugadores();
  } catch {
    mostrarError("No se pudo guardar el jugador.");
  }
});

window.editarJugador = (id, name, country, birth_at, team) => {
  document.getElementById("jugadorId").value = id;
  document.getElementById("nombre").value = name;
  document.getElementById("pais").value = country;
  document.getElementById("nacimiento").value = birth_at;
  document.getElementById("equipoId").value = team;
};

window.eliminarJugador = async (id) => {
  try {
    const res = await fetch(`${jugadoresUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) return mostrarError(await res.text());
    cargarJugadores();
  } catch {
    mostrarError("No se pudo eliminar el jugador.");
  }
};

cargarEquipos();
cargarJugadores();
