// Configuracion central de la API
// Todas las llamadas pasan por el proxy backend para proteger las claves

const URL_BASE_API = import.meta.env.VITE_API_BASE_URL || '/api';

// Tiempo maximo de espera para cada peticion (en milisegundos)
const TIEMPO_ESPERA = 15000;

// Realiza una peticion HTTP con manejo de errores y timeout
async function hacerPeticion(ruta, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_ESPERA);

  try {
    const respuesta = await fetch(`${URL_BASE_API}${ruta}`, {
      ...opciones,
      signal: controlador.signal,
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
    });

    if (!respuesta.ok) {
      const datosError = await respuesta.json().catch(() => ({}));
      throw new Error(datosError.message || `Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    // Extraer headers de paginacion si existen
    const totalPaginas = respuesta.headers.get('X-WP-TotalPages');
    const totalElementos = respuesta.headers.get('X-WP-Total');
    const datos = await respuesta.json();

    return {
      datos,
      paginacion: {
        totalPaginas: totalPaginas ? parseInt(totalPaginas) : null,
        totalElementos: totalElementos ? parseInt(totalElementos) : null,
      },
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La peticion tardo demasiado. Intenta de nuevo.');
    }
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

export { hacerPeticion, URL_BASE_API };
