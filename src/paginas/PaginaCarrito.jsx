// Pagina del carrito de compras
import { Link } from "react-router-dom";
import { useCarrito } from "../contexto/ContextoCarrito.jsx";
import { formatearPrecio } from "../utilidades/formato.js";
import "./PaginaCarrito.css";

function PaginaCarrito() {
  const {
    items,
    totalItems,
    precioTotal,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
  } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h1>Tu carrito esta vacio</h1>
        <p>Agrega productos para comenzar tu compra</p>
        <Link to="/productos" className="boton boton-primario">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="pagina-carrito">
      <div className="carrito-encabezado">
        <h1>Carrito de compras</h1>
        <button
          className="boton boton-secundario boton-pequeno"
          onClick={vaciarCarrito}
        >
          Vaciar carrito
        </button>
      </div>

      <div className="carrito-contenido">
        {/* Lista de items */}
        <div className="carrito-items">
          {items.map((item) => (
            <div key={item.id} className="carrito-item">
              <div className="item-imagen-contenedor">
                {item.imagen ? (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="item-imagen"
                  />
                ) : (
                  <div className="item-sin-imagen">Sin imagen</div>
                )}
              </div>

              <div className="item-detalles">
                <Link to={`/producto/${item.id}`} className="item-nombre">
                  {item.nombre}
                </Link>
                <p className="item-precio-unitario">
                  {formatearPrecio(item.precio)} c/u
                </p>
              </div>

              <div className="item-cantidad">
                <button
                  className="boton-cantidad-mini"
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                >
                  -
                </button>
                <span>{item.cantidad}</span>
                <button
                  className="boton-cantidad-mini"
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                {formatearPrecio(item.precio * item.cantidad)}
              </div>

              <button
                className="item-eliminar"
                onClick={() => eliminarDelCarrito(item.id)}
                title="Eliminar del carrito"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="carrito-resumen">
          <h2>Resumen del pedido</h2>

          <div className="resumen-linea">
            <span>Productos ({totalItems})</span>
            <span>{formatearPrecio(precioTotal)}</span>
          </div>

          <div className="resumen-linea">
            <span>Envio</span>
            <span>Por calcular</span>
          </div>

          <div className="resumen-total">
            <span>Total</span>
            <span>{formatearPrecio(precioTotal)}</span>
          </div>

          <Link to="/checkout" className="boton boton-primario boton-checkout">
            Proceder al pago
          </Link>

          <Link to="/productos" className="enlace-seguir-comprando">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaginaCarrito;
