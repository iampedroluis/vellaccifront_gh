// Servicio para interactuar con los productos de WooCommerce
import { hacerPeticion } from './clienteApi.js';

// Obtener lista de productos con paginacion y filtros opcionales
async function obtenerProductos({ pagina = 1, porPagina = 12, categoria = '', busqueda = '', orden = 'date', direccion = 'desc' } = {}) {
  const parametros = new URLSearchParams({
    page: pagina.toString(),
    per_page: porPagina.toString(),
    orderby: orden,
    order: direccion,
  });

  if (categoria) parametros.set('category', categoria);
  if (busqueda) parametros.set('search', busqueda);

  const resultado = await hacerPeticion(`/productos?${parametros.toString()}`);
  return resultado;
}

// Obtener un producto por su ID
async function obtenerProductoPorId(id) {
  const resultado = await hacerPeticion(`/productos/${id}`);
  return resultado.datos;
}

// Obtener productos relacionados a un producto dado
async function obtenerProductosRelacionados(idsRelacionados) {
  if (!idsRelacionados || idsRelacionados.length === 0) return [];

  const ids = idsRelacionados.slice(0, 4).join(',');
  const resultado = await hacerPeticion(`/productos?include=${ids}`);
  return resultado.datos;
}

export { obtenerProductos, obtenerProductoPorId, obtenerProductosRelacionados };
