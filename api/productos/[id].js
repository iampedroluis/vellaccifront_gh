// Funcion serverless de Vercel para obtener un producto especifico por ID

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const { id } = req.query;
  const { WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  if (!WORDPRESS_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Variables de entorno no configuradas' });
  }

  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/products/${id}?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      return res.status(respuesta.status).json({ message: textoError });
    }

    // Cache de 60 segundos para producto individual
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    const datos = await respuesta.json();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ message: 'Error al obtener el producto' });
  }
}
