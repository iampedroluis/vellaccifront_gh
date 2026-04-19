import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorCarrito } from "./contexto/ContextoCarrito.jsx";
import Encabezado from "./componentes/Encabezado.jsx";
import PiePagina from "./componentes/PiePagina.jsx";
import PaginaInicio from "./paginas/PaginaInicio.jsx";
import PaginaProductos from "./paginas/PaginaProductos.jsx";
import PaginaDetalleProducto from "./paginas/PaginaDetalleProducto.jsx";
import PaginaCarrito from "./paginas/PaginaCarrito.jsx";
import PaginaCheckout from "./paginas/PaginaCheckout.jsx";

function App() {
  return (
    <ProveedorCarrito>
      <BrowserRouter>
        <div className="contenedor-app">
          <Encabezado />
          <main className="contenido-principal">
            <Routes>
              <Route path="/" element={<PaginaInicio />} />
              <Route path="/productos" element={<PaginaProductos />} />
              <Route path="/producto/:id" element={<PaginaDetalleProducto />} />
              <Route path="/carrito" element={<PaginaCarrito />} />
              <Route path="/checkout" element={<PaginaCheckout />} />
            </Routes>
          </main>
          <PiePagina />
        </div>
      </BrowserRouter>
    </ProveedorCarrito>
  );
}

export default App;
