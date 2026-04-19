// Funcion serverless de Vercel para crear ordenes en WooCommerce

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const { WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  if (!WORDPRESS_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Variables de entorno no configuradas' });
  }

  try {
    const url = `${WORDPRESS_URL}/wp-json/wc/v3/orders?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      return res.status(respuesta.status).json({ message: textoError });
    }

    const datos = await respuesta.json();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al crear orden:', error);
    return res.status(500).json({ message: 'Error al procesar la orden' });
  }
}
