// Encabezado principal con navegacion y contador del carrito
import { Link } from 'react-router-dom';
import { useCarrito } from '../contexto/ContextoCarrito.jsx';
import './Encabezado.css';

function Encabezado() {
  const { totalItems } = useCarrito();

  return (
    <header className="encabezado">
      <div className="encabezado-contenido contenedor">
        <Link to="/" className="encabezado-logo">
          Vellacci
        </Link>

        <nav className="encabezado-nav">
          <Link to="/" className="nav-enlace">Inicio</Link>
          <Link to="/productos" className="nav-enlace">Productos</Link>
          <Link to="/carrito" className="nav-enlace carrito-enlace">
            Carrito
            {totalItems > 0 && (
              <span className="carrito-contador">{totalItems}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Encabezado;
