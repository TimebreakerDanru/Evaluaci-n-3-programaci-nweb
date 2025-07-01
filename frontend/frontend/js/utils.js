export function mostrarError(mensaje) {
  const errorDiv = document.getElementById("error");
  errorDiv.textContent = mensaje;
  errorDiv.style.display = "block";
  setTimeout(() => errorDiv.style.display = "none", 4000);
}
