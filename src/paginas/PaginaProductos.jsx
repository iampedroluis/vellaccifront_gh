// Pagina de listado de productos con filtros y paginacion
import { useState, useCallback } from 'react';
import { obtenerProductos } from '../servicios/servicioProductos.js';
import { obtenerCategorias } from '../servicios/servicioCategorias.js';
import usePeticionApi from '../hooks/usePeticionApi.js';
import TarjetaProducto from '../componentes/TarjetaProducto.jsx';
import './PaginaProductos.css';

function PaginaProductos() {
  const [pagina, setPagina] = useState(1);
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Obtener categorias para el filtro
  const { datos: categorias } = usePeticionApi(
    () => obtenerCategorias(),
    []
  );

  // Obtener productos con los filtros actuales
  const { datos: productos, cargando, error, paginacion } = usePeticionApi(
    useCallback(
      () => obtenerProductos({ pagina, categoria: categoriaActiva, busqueda: terminoBusqueda }),
      [pagina, categoriaActiva, terminoBusqueda]
    ),
    [pagina, categoriaActiva, terminoBusqueda]
  );

  const manejarBusqueda = (evento) => {
    evento.preventDefault();
    setTerminoBusqueda(busqueda);
    setPagina(1);
  };

  const manejarCambioCategoria = (idCategoria) => {
    setCategoriaActiva(idCategoria);
    setPagina(1);
  };

  const irAPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pagina-productos">
      <h1 className="pagina-titulo">Nuestros Productos</h1>

      {/* Barra de busqueda */}
      <form className="barra-busqueda" onSubmit={manejarBusqueda}>
        <input
          type="text"
          className="campo-busqueda"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit" className="boton boton-primario">
          Buscar
        </button>
      </form>

      {/* Filtro por categorias */}
      {categorias && categorias.length > 0 && (
        <div className="filtro-categorias">
          <button
            className={`boton-categoria ${categoriaActiva === '' ? 'activa' : ''}`}
            onClick={() => manejarCambioCategoria('')}
          >
            Todas
          </button>
          {categorias
            .filter((cat) => cat.count > 0)
            .map((categoria) => (
              <button
                key={categoria.id}
                className={`boton-categoria ${categoriaActiva === String(categoria.id) ? 'activa' : ''}`}
                onClick={() => manejarCambioCategoria(String(categoria.id))}
              >
                {categoria.name} ({categoria.count})
              </button>
            ))}
        </div>
      )}

      {/* Estado de carga */}
      {cargando && (
        <div className="cargando-contenedor">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-contenedor">
          <h2>Algo salio mal</h2>
          <p>{error}</p>
          <button className="boton boton-primario" onClick={() => irAPagina(1)}>
            Reintentar
          </button>
        </div>
      )}

      {/* Grilla de productos */}
      {productos && productos.length > 0 && (
        <div className="grilla-productos">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {productos && productos.length === 0 && !cargando && (
        <p className="texto-centro sin-resultados">
          No se encontraron productos con los filtros seleccionados.
        </p>
      )}

      {/* Paginacion */}
      {paginacion.totalPaginas && paginacion.totalPaginas > 1 && (
        <div className="paginacion">
          <button
            className="boton boton-secundario boton-pequeno"
            disabled={pagina <= 1}
            onClick={() => irAPagina(pagina - 1)}
          >
            Anterior
          </button>

          <span className="paginacion-info">
            Pagina {pagina} de {paginacion.totalPaginas}
          </span>

          <button
            className="boton boton-secundario boton-pequeno"
            disabled={pagina >= paginacion.totalPaginas}
            onClick={() => irAPagina(pagina + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginaProductos;
