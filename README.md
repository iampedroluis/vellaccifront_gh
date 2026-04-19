# Vellacci - eCommerce Headless

Frontend React + Vite que consume WordPress/WooCommerce como backend headless.

## Estructura del proyecto

```
vellaccifront/
  public/                  # Archivos estaticos
  src/
    componentes/           # Componentes reutilizables (Encabezado, TarjetaProducto, etc.)
    contexto/              # Context API (carrito de compras)
    estilos/               # Estilos globales y variables CSS
    hooks/                 # Hooks personalizados (usePeticionApi)
    paginas/               # Paginas de la aplicacion
    servicios/             # Capa de comunicacion con la API
    utilidades/            # Funciones auxiliares (formato de precio, etc.)
  proxy-server/            # Servidor proxy Express (protege claves de WooCommerce)
```

## Requisitos previos

- Node.js 18+
- WordPress con WooCommerce instalado
- Claves API de WooCommerce (consumer_key y consumer_secret)

## Configuracion

1. Clonar el repositorio
2. Copiar `.env.example` a `.env` y configurar las variables:

```
VITE_WORDPRESS_URL=https://tu-sitio.com
VITE_API_BASE_URL=/api
WORDPRESS_URL=https://tu-sitio.com
WC_CONSUMER_KEY=ck_xxx
WC_CONSUMER_SECRET=cs_xxx
```

3. Instalar dependencias:

```bash
npm install
cd proxy-server && npm install
```

## Desarrollo local

Terminal 1 - Frontend:

```bash
npm run dev
```

Terminal 2 - Proxy backend:

```bash
cd proxy-server && npm run dev
```

El frontend corre en http://localhost:3000
El proxy corre en http://localhost:4000

## Build para produccion

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

## Despliegue

### Frontend (Vercel)

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Ajustar `vercel.json` con la URL real del proxy

### Proxy (Hostinger u otro servidor)

1. Subir la carpeta `proxy-server/` al servidor
2. Configurar las variables de entorno con las claves de WooCommerce
3. Ejecutar `npm start`

## Seguridad

- Las claves de WooCommerce NUNCA se exponen en el frontend
- Todas las peticiones pasan por el servidor proxy
- El proxy valida origenes CORS
- Headers de seguridad configurados en Vercel

## Arquitectura

```
[React Frontend] --> [Proxy Express] --> [WordPress/WooCommerce REST API]
     (Vercel)         (Hostinger)              (Hostinger)
```

El proxy actua como intermediario seguro que:

- Agrega las credenciales de WooCommerce a cada peticion
- Filtra y valida las respuestas
- Protege contra exposicion de datos sensibles
