// Servidor proxy que protege las claves de WooCommerce
// El frontend NUNCA tiene acceso directo a las credenciales
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PUERTO = process.env.PROXY_PORT || 4000;

// Configuracion de CORS - ajustar dominios en produccion
const origenesPermitidos = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());

// Credenciales de WooCommerce (solo viven en el servidor)
const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

// Verificar que las variables de entorno estan configuradas
if (!WORDPRESS_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.error('Faltan variables de entorno. Revisa el archivo .env');
  process.exit(1);
}

// Construir URL autenticada para WooCommerce
function construirUrlWooCommerce(ruta, parametrosExtra = '') {
  const separador = parametrosExtra ? '&' : '';
  return `${WORDPRESS_URL}/wp-json/wc/v3${ruta}?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}${separador}${parametrosExtra}`;
}

// Funcion auxiliar para hacer peticiones a WooCommerce
async function peticionWooCommerce(ruta, parametrosQuery = '') {
  const url = construirUrlWooCommerce(ruta, parametrosQuery);
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    const textoError = await respuesta.text();
    throw new Error(`WooCommerce respondio con error ${respuesta.status}: ${textoError}`);
  }

  // Pasar headers de paginacion
  const totalPaginas = respuesta.headers.get('X-WP-TotalPages');
  const totalElementos = respuesta.headers.get('X-WP-Total');
  const datos = await respuesta.json();

  return { datos, totalPaginas, totalElementos };
}

// ===== RUTAS DE PRODUCTOS =====

// Listar productos con filtros opcionales
app.get('/api/productos', async (req, res) => {
  try {
    const parametros = new URLSearchParams(req.query).toString();
    const { datos, totalPaginas, totalElementos } = await peticionWooCommerce('/products', parametros);

    // Pasar headers de paginacion al frontend
    if (totalPaginas) res.setHeader('X-WP-TotalPages', totalPaginas);
    if (totalElementos) res.setHeader('X-WP-Total', totalElementos);

    res.json(datos);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Obtener un producto especifico
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { datos } = await peticionWooCommerce(`/products/${req.params.id}`);
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener producto:', error.message);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// ===== RUTAS DE CATEGORIAS =====

// Listar categorias
app.get('/api/categorias', async (req, res) => {
  try {
    const { datos } = await peticionWooCommerce('/products/categories', 'per_page=100');
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener categorias:', error.message);
    res.status(500).json({ message: 'Error al obtener categorias' });
  }
});

// Obtener una categoria especifica
app.get('/api/categorias/:id', async (req, res) => {
  try {
    const { datos } = await peticionWooCommerce(`/products/categories/${req.params.id}`);
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener categoria:', error.message);
    res.status(500).json({ message: 'Error al obtener la categoria' });
  }
});

// ===== RUTA DE CHECKOUT =====

// Crear orden en WooCommerce
app.post('/api/ordenes', async (req, res) => {
  try {
    const url = construirUrlWooCommerce('/orders');
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      throw new Error(`Error al crear orden: ${textoError}`);
    }

    const orden = await respuesta.json();
    res.json(orden);
  } catch (error) {
    console.error('Error al crear orden:', error.message);
    res.status(500).json({ message: 'Error al procesar la orden' });
  }
});

// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PUERTO}`);
  console.log(`Conectado a WordPress: ${WORDPRESS_URL}`);
});
