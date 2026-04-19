// Servicio para interactuar con las categorias de WooCommerce
import { hacerPeticion } from './clienteApi.js';

// Obtener todas las categorias de productos
async function obtenerCategorias() {
  const resultado = await hacerPeticion('/categorias');
  return resultado.datos;
}

// Obtener una categoria especifica por ID
async function obtenerCategoriaPorId(id) {
  const resultado = await hacerPeticion(`/categorias/${id}`);
  return resultado.datos;
}

export { obtenerCategorias, obtenerCategoriaPorId };
