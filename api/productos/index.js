// Funcion serverless de Vercel para obtener productos de WooCommerce
// Las claves API se guardan como variables de entorno en Vercel (nunca en el codigo)

export default async function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const { WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  if (!WORDPRESS_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Variables de entorno no configuradas' });
  }

  try {
    // Pasar todos los query params al API de WooCommerce
    const parametros = new URLSearchParams(req.query).toString();
    const separador = parametros ? '&' : '';
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}${separador}${parametros}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      return res.status(respuesta.status).json({ message: textoError });
    }

    // Pasar headers de paginacion
    const totalPaginas = respuesta.headers.get('X-WP-TotalPages');
    const totalElementos = respuesta.headers.get('X-WP-Total');

    if (totalPaginas) res.setHeader('X-WP-TotalPages', totalPaginas);
    if (totalElementos) res.setHeader('X-WP-Total', totalElementos);

    // Headers de cache - 60 segundos para productos
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    const datos = await respuesta.json();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error al obtener productos' });
  }
}
