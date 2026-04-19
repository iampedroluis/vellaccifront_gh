// Contexto global del carrito de compras
// Usa localStorage para persistir el carrito entre sesiones
import { createContext, useContext, useReducer, useEffect } from 'react';

const ContextoCarrito = createContext(null);

// Acciones disponibles para el carrito
const ACCIONES = {
  AGREGAR: 'AGREGAR_AL_CARRITO',
  ELIMINAR: 'ELIMINAR_DEL_CARRITO',
  ACTUALIZAR_CANTIDAD: 'ACTUALIZAR_CANTIDAD',
  VACIAR: 'VACIAR_CARRITO',
  CARGAR: 'CARGAR_CARRITO',
};

// Leer el carrito guardado en localStorage
function obtenerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem('vellacci_carrito');
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

// Guardar el carrito en localStorage
function guardarCarrito(items) {
  try {
    localStorage.setItem('vellacci_carrito', JSON.stringify(items));
  } catch {
    // Si localStorage no esta disponible, ignorar silenciosamente
  }
}

// Reducer que maneja todas las acciones del carrito
function reductorCarrito(estado, accion) {
  switch (accion.type) {
    case ACCIONES.AGREGAR: {
      const productoExistente = estado.find((item) => item.id === accion.producto.id);

      if (productoExistente) {
        // Si ya existe, aumentar cantidad
        return estado.map((item) =>
          item.id === accion.producto.id
            ? { ...item, cantidad: item.cantidad + (accion.cantidad || 1) }
            : item
        );
      }

      // Si no existe, agregarlo con los datos necesarios
      return [
        ...estado,
        {
          id: accion.producto.id,
          nombre: accion.producto.name,
          precio: parseFloat(accion.producto.price),
          imagen: accion.producto.images?.[0]?.src || '',
          cantidad: accion.cantidad || 1,
          slug: accion.producto.slug,
        },
      ];
    }

    case ACCIONES.ELIMINAR:
      return estado.filter((item) => item.id !== accion.id);

    case ACCIONES.ACTUALIZAR_CANTIDAD: {
      if (accion.cantidad <= 0) {
        return estado.filter((item) => item.id !== accion.id);
      }
      return estado.map((item) =>
        item.id === accion.id ? { ...item, cantidad: accion.cantidad } : item
      );
    }

    case ACCIONES.VACIAR:
      return [];

    case ACCIONES.CARGAR:
      return accion.items;

    default:
      return estado;
  }
}

// Proveedor que envuelve la aplicacion y da acceso al carrito
function ProveedorCarrito({ children }) {
  const [items, dispatch] = useReducer(reductorCarrito, [], obtenerCarritoGuardado);

  // Persistir en localStorage cada vez que cambie el carrito
  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  // Calcular totales
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);
  const precioTotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0);

  // Funciones publicas del carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    dispatch({ type: ACCIONES.AGREGAR, producto, cantidad });
  };

  const eliminarDelCarrito = (id) => {
    dispatch({ type: ACCIONES.ELIMINAR, id });
  };

  const actualizarCantidad = (id, cantidad) => {
    dispatch({ type: ACCIONES.ACTUALIZAR_CANTIDAD, id, cantidad });
  };

  const vaciarCarrito = () => {
    dispatch({ type: ACCIONES.VACIAR });
  };

  const estaEnCarrito = (id) => {
    return items.some((item) => item.id === id);
  };

  const valor = {
    items,
    totalItems,
    precioTotal,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    estaEnCarrito,
  };

  return <ContextoCarrito.Provider value={valor}>{children}</ContextoCarrito.Provider>;
}

// Hook para usar el carrito en cualquier componente
function useCarrito() {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de ProveedorCarrito');
  }
  return contexto;
}

export { ProveedorCarrito, useCarrito };
