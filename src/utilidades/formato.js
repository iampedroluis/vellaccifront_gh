// Funciones de formato reutilizables

// Formatear precio en formato de moneda colombiana (COP)
function formatearPrecio(precio, moneda = "COP") {
  if (isNaN(precio)) return "$0";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

// Limpiar HTML de las descripciones de WooCommerce
function limpiarHtml(html) {
  if (!html) return "";
  const elemento = document.createElement("div");
  elemento.innerHTML = html;
  return elemento.textContent || "";
}

export { formatearPrecio, limpiarHtml };
