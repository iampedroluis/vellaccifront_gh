// Hook reutilizable para hacer peticiones a la API
// Maneja estados de carga, error y datos automaticamente
import { useState, useEffect, useCallback } from 'react';

function usePeticionApi(funcionPeticion, dependencias = []) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState({ totalPaginas: null, totalElementos: null });

  const ejecutar = useCallback(async (...argumentos) => {
    setCargando(true);
    setError(null);

    try {
      const resultado = await funcionPeticion(...argumentos);

      // Si el resultado tiene estructura de paginacion
      if (resultado && resultado.datos !== undefined) {
        setDatos(resultado.datos);
        setPaginacion(resultado.paginacion || {});
      } else {
        setDatos(resultado);
      }
    } catch (err) {
      setError(err.message || 'Ocurrio un error inesperado');
    } finally {
      setCargando(false);
    }
  }, dependencias);

  useEffect(() => {
    ejecutar();
  }, [ejecutar]);

  return { datos, cargando, error, paginacion, recargar: ejecutar };
}

export default usePeticionApi;
