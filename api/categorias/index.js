// Funcion serverless de Vercel para obtener categorias de WooCommerce

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const { WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  if (!WORDPRESS_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Variables de entorno no configuradas' });
  }

  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/categories?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}&per_page=100`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      return res.status(respuesta.status).json({ message: textoError });
    }

    // Cache de 5 minutos para categorias (cambian poco)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    const datos = await respuesta.json();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener categorias:', error);
    return res.status(500).json({ message: 'Error al obtener categorias' });
  }
}
