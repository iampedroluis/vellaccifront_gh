// Pagina de checkout - redirige al checkout de WooCommerce
// Opcion A (recomendada): Redirigir al checkout nativo de WooCommerce
// Opcion B: Formulario basico que crea la orden via API
import { useState } from "react";
import { useCarrito } from "../contexto/ContextoCarrito.jsx";
import { formatearPrecio } from "../utilidades/formato.js";
import { hacerPeticion } from "../servicios/clienteApi.js";
import "./PaginaCheckout.css";

const URL_WORDPRESS = import.meta.env.VITE_WORDPRESS_URL || "";

function PaginaCheckout() {
  const { items, precioTotal, vaciarCarrito } = useCarrito();
  const [metodo, setMetodo] = useState("redireccion"); // 'redireccion' o 'formulario'
  const [procesando, setProcesando] = useState(false);
  const [ordenCreada, setOrdenCreada] = useState(null);
  const [error, setError] = useState(null);

  // Estado del formulario de facturacion
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    pais: "",
  });

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  // Opcion A: Redirigir al checkout de WooCommerce
  const redirigirAWooCommerce = () => {
    if (URL_WORDPRESS) {
      window.location.href = `${URL_WORDPRESS}/checkout/`;
    } else {
      setError(
        "URL de WordPress no configurada. Revisa las variables de entorno.",
      );
    }
  };

  // Opcion B: Crear orden via API
  const crearOrden = async (evento) => {
    evento.preventDefault();
    setProcesando(true);
    setError(null);

    try {
      const datosOrden = {
        payment_method: "cod",
        payment_method_title: "Pago contra entrega",
        set_paid: false,
        billing: {
          first_name: formulario.nombre,
          last_name: formulario.apellido,
          email: formulario.email,
          phone: formulario.telefono,
          address_1: formulario.direccion,
          city: formulario.ciudad,
          state: formulario.estado,
          postcode: formulario.codigoPostal,
          country: formulario.pais || "US",
        },
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.cantidad,
        })),
      };

      const resultado = await hacerPeticion("/ordenes", {
        method: "POST",
        body: JSON.stringify(datosOrden),
      });

      setOrdenCreada(resultado.datos);
      vaciarCarrito();
    } catch (err) {
      setError(err.message || "Error al procesar la orden");
    } finally {
      setProcesando(false);
    }
  };

  // Si no hay items, mostrar mensaje
  if (items.length === 0 && !ordenCreada) {
    return (
      <div className="checkout-vacio">
        <h1>No hay productos en tu carrito</h1>
        <p>Agrega productos antes de proceder al pago.</p>
        <a href="/productos" className="boton boton-primario">
          Ver productos
        </a>
      </div>
    );
  }

  // Orden creada exitosamente
  if (ordenCreada) {
    return (
      <div className="orden-exitosa">
        <h1>Orden creada exitosamente</h1>
        <p>
          Tu numero de orden es: <strong>#{ordenCreada.id}</strong>
        </p>
        <p>
          Te enviaremos un email con los detalles a {ordenCreada.billing?.email}
        </p>
        <a href="/" className="boton boton-primario">
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="pagina-checkout">
      <h1 className="checkout-titulo">Finalizar compra</h1>

      {/* Selector de metodo */}
      <div className="metodo-selector">
        <button
          className={`metodo-opcion ${metodo === "redireccion" ? "activo" : ""}`}
          onClick={() => setMetodo("redireccion")}
        >
          Pagar en WooCommerce (recomendado)
        </button>
        <button
          className={`metodo-opcion ${metodo === "formulario" ? "activo" : ""}`}
          onClick={() => setMetodo("formulario")}
        >
          Checkout personalizado
        </button>
      </div>

      {error && (
        <div className="checkout-error">
          <p>{error}</p>
        </div>
      )}

      {/* Opcion A: Redireccion */}
      {metodo === "redireccion" && (
        <div className="checkout-redireccion">
          <h2>Resumen del pedido</h2>
          <div className="checkout-items-resumen">
            {items.map((item) => (
              <div key={item.id} className="checkout-item-linea">
                <span>
                  {item.nombre} x {item.cantidad}
                </span>
                <span>{formatearPrecio(item.precio * item.cantidad)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total:</span>
            <span>{formatearPrecio(precioTotal)}</span>
          </div>
          <button
            className="boton boton-primario boton-pagar"
            onClick={redirigirAWooCommerce}
          >
            Ir a pagar en WooCommerce
          </button>
          <p className="nota-redireccion">
            Seras redirigido al checkout seguro de WooCommerce para completar tu
            pago.
          </p>
        </div>
      )}

      {/* Opcion B: Formulario */}
      {metodo === "formulario" && (
        <form className="checkout-formulario" onSubmit={crearOrden}>
          <div className="formulario-seccion">
            <h2>Datos de facturacion</h2>

            <div className="campo-grupo">
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={formulario.nombre}
                  onChange={(e) => actualizarCampo("nombre", e.target.value)}
                />
              </div>
              <div className="campo">
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  type="text"
                  required
                  value={formulario.apellido}
                  onChange={(e) => actualizarCampo("apellido", e.target.value)}
                />
              </div>
            </div>

            <div className="campo-grupo">
              <div className="campo">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formulario.email}
                  onChange={(e) => actualizarCampo("email", e.target.value)}
                />
              </div>
              <div className="campo">
                <label htmlFor="telefono">Telefono</label>
                <input
                  id="telefono"
                  type="tel"
                  value={formulario.telefono}
                  onChange={(e) => actualizarCampo("telefono", e.target.value)}
                />
              </div>
            </div>

            <div className="campo">
              <label htmlFor="direccion">Direccion</label>
              <input
                id="direccion"
                type="text"
                required
                value={formulario.direccion}
                onChange={(e) => actualizarCampo("direccion", e.target.value)}
              />
            </div>

            <div className="campo-grupo campo-grupo-tres">
              <div className="campo">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  required
                  value={formulario.ciudad}
                  onChange={(e) => actualizarCampo("ciudad", e.target.value)}
                />
              </div>
              <div className="campo">
                <label htmlFor="estado">Estado/Provincia</label>
                <input
                  id="estado"
                  type="text"
                  value={formulario.estado}
                  onChange={(e) => actualizarCampo("estado", e.target.value)}
                />
              </div>
              <div className="campo">
                <label htmlFor="codigoPostal">Codigo postal</label>
                <input
                  id="codigoPostal"
                  type="text"
                  value={formulario.codigoPostal}
                  onChange={(e) =>
                    actualizarCampo("codigoPostal", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="checkout-resumen-lateral">
            <h2>Tu pedido</h2>
            <div className="checkout-items-resumen">
              {items.map((item) => (
                <div key={item.id} className="checkout-item-linea">
                  <span>
                    {item.nombre} x {item.cantidad}
                  </span>
                  <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Total:</span>
              <span>{formatearPrecio(precioTotal)}</span>
            </div>

            <button
              type="submit"
              className="boton boton-primario boton-pagar"
              disabled={procesando}
            >
              {procesando ? "Procesando..." : "Crear orden"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PaginaCheckout;
