// Pagina de inicio - muestra productos destacados
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../servicios/servicioProductos.js';
import usePeticionApi from '../hooks/usePeticionApi.js';
import TarjetaProducto from '../componentes/TarjetaProducto.jsx';
import './PaginaInicio.css';

function PaginaInicio() {
  const { datos: productos, cargando, error } = usePeticionApi(
    () => obtenerProductos({ porPagina: 8 }),
    []
  );

  return (
    <div className="pagina-inicio">
      {/* Hero section */}
      <section className="hero">
        <div className="hero-contenido">
          <h1 className="hero-titulo">Bienvenido a Vellacci</h1>
          <p className="hero-subtitulo">
            Descubre nuestra coleccion exclusiva de productos de alta calidad
          </p>
          <Link to="/productos" className="boton boton-primario hero-boton">
            Ver todos los productos
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="seccion-destacados">
        <h2 className="seccion-titulo">Productos destacados</h2>

        {cargando && (
          <div className="cargando-contenedor">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="error-contenedor">
            <h2>Algo salio mal</h2>
            <p>{error}</p>
          </div>
        )}

        {productos && productos.length > 0 && (
          <div className="grilla-productos">
            {productos.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        )}

        {productos && productos.length === 0 && !cargando && (
          <p className="texto-centro">No hay productos disponibles en este momento.</p>
        )}

        <div className="texto-centro" style={{ marginTop: '2rem' }}>
          <Link to="/productos" className="boton boton-secundario">
            Ver todos los productos
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PaginaInicio;
