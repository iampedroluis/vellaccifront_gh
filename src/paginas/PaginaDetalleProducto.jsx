// Pagina de detalle completo de un producto
import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerProductoPorId } from "../servicios/servicioProductos.js";
import usePeticionApi from "../hooks/usePeticionApi.js";
import { useCarrito } from "../contexto/ContextoCarrito.jsx";
import { formatearPrecio, limpiarHtml } from "../utilidades/formato.js";
import "./PaginaDetalleProducto.css";

function PaginaDetalleProducto() {
  const { id } = useParams();
  const { agregarAlCarrito, estaEnCarrito } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [agregado, setAgregado] = useState(false);

  const {
    datos: producto,
    cargando,
    error,
  } = usePeticionApi(
    useCallback(() => obtenerProductoPorId(id), [id]),
    [id],
  );

  const yaEnCarrito = producto ? estaEnCarrito(producto.id) : false;

  const manejarAgregar = () => {
    if (producto && !yaEnCarrito) {
      agregarAlCarrito(producto, cantidad);
      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
    }
  };

  const cambiarCantidad = (delta) => {
    setCantidad((prev) => Math.max(1, prev + delta));
  };

  if (cargando) {
    return (
      <div className="cargando-contenedor">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-contenedor">
        <h2>Error al cargar el producto</h2>
        <p>{error}</p>
        <Link to="/productos" className="boton boton-primario">
          Volver a productos
        </Link>
      </div>
    );
  }

  if (!producto) return null;

  const precio = parseFloat(producto.price);
  const precioRegular = producto.regular_price
    ? parseFloat(producto.regular_price)
    : null;
  const tieneDescuento = precioRegular && precioRegular > precio;
  const imagenes = producto.images || [];
  const enStock = producto.stock_status === "instock";

  return (
    <div className="pagina-detalle">
      <Link to="/productos" className="enlace-volver">
        Volver a productos
      </Link>

      <div className="detalle-contenido">
        {/* Galeria de imagenes */}
        <div className="detalle-galeria">
          <div className="imagen-principal-contenedor">
            {imagenes.length > 0 ? (
              <img
                src={imagenes[imagenActiva]?.src}
                alt={imagenes[imagenActiva]?.alt || producto.name}
                className="imagen-principal"
              />
            ) : (
              <div className="sin-imagen">Sin imagen</div>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="miniaturas">
              {imagenes.map((img, indice) => (
                <button
                  key={img.id}
                  className={`miniatura ${indice === imagenActiva ? "activa" : ""}`}
                  onClick={() => setImagenActiva(indice)}
                >
                  <img src={img.src} alt={img.alt || `Imagen ${indice + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informacion del producto */}
        <div className="detalle-info">
          <h1 className="detalle-nombre">{producto.name}</h1>

          <div className="detalle-precios">
            {tieneDescuento && (
              <span className="precio-tachado">
                {formatearPrecio(precioRegular)}
              </span>
            )}
            <span className="precio-actual precio-grande">
              {formatearPrecio(precio)}
            </span>
            {tieneDescuento && (
              <span className="porcentaje-descuento">
                -{Math.round(((precioRegular - precio) / precioRegular) * 100)}%
              </span>
            )}
          </div>

          <div className={`estado-stock ${enStock ? "en-stock" : "sin-stock"}`}>
            {enStock ? "En stock" : "Agotado"}
          </div>

          {producto.short_description && (
            <p className="detalle-descripcion-corta">
              {limpiarHtml(producto.short_description)}
            </p>
          )}

          {/* Selector de cantidad y boton agregar */}
          {enStock && (
            <div className="detalle-acciones">
              <div className="selector-cantidad">
                <button
                  className="boton-cantidad"
                  onClick={() => cambiarCantidad(-1)}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="cantidad-valor">{cantidad}</span>
                <button
                  className="boton-cantidad"
                  onClick={() => cambiarCantidad(1)}
                >
                  +
                </button>
              </div>

              <button
                className={`boton ${yaEnCarrito || agregado ? "boton-secundario" : "boton-primario"} boton-agregar-detalle`}
                onClick={manejarAgregar}
                disabled={yaEnCarrito}
              >
                {agregado
                  ? "Agregado"
                  : yaEnCarrito
                    ? "Ya esta en el carrito"
                    : "Agregar al carrito"}
              </button>
            </div>
          )}

          {/* Descripcion completa */}
          {producto.description && (
            <div className="detalle-descripcion-completa">
              <h3>Descripcion</h3>
              <div dangerouslySetInnerHTML={{ __html: producto.description }} />
            </div>
          )}

          {/* Categorias */}
          {producto.categories && producto.categories.length > 0 && (
            <div className="detalle-categorias">
              <strong>Categorias: </strong>
              {producto.categories.map((cat) => cat.name).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaginaDetalleProducto;
