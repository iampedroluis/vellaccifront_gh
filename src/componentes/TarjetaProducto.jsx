// Tarjeta individual de producto para el listado
import { Link } from 'react-router-dom';
import { useCarrito } from '../contexto/ContextoCarrito.jsx';
import { formatearPrecio } from '../utilidades/formato.js';
import './TarjetaProducto.css';

function TarjetaProducto({ producto }) {
  const { agregarAlCarrito, estaEnCarrito } = useCarrito();
  const yaEnCarrito = estaEnCarrito(producto.id);

  const imagenProducto = producto.images?.[0]?.src || '/placeholder.svg';
  const precio = parseFloat(producto.price);
  const precioRegular = producto.regular_price ? parseFloat(producto.regular_price) : null;
  const tieneDescuento = precioRegular && precioRegular > precio;

  const manejarAgregar = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    if (!yaEnCarrito) {
      agregarAlCarrito(producto);
    }
  };

  return (
    <Link to={`/producto/${producto.id}`} className="tarjeta-producto">
      <div className="tarjeta-imagen-contenedor">
        <img
          src={imagenProducto}
          alt={producto.name}
          className="tarjeta-imagen"
          loading="lazy"
        />
        {tieneDescuento && <span className="etiqueta-descuento">Oferta</span>}
      </div>

      <div className="tarjeta-info">
        <h3 className="tarjeta-nombre">{producto.name}</h3>

        <div className="tarjeta-precios">
          {tieneDescuento && (
            <span className="precio-tachado">{formatearPrecio(precioRegular)}</span>
          )}
          <span className="precio-actual">{formatearPrecio(precio)}</span>
        </div>

        <button
          className={`boton ${yaEnCarrito ? 'boton-secundario' : 'boton-primario'} boton-agregar`}
          onClick={manejarAgregar}
          disabled={yaEnCarrito}
        >
          {yaEnCarrito ? 'En el carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </Link>
  );
}

export default TarjetaProducto;
