# Guia de Despliegue - Vellacci en Vercel

## Arquitectura de produccion

```
Usuario visita vellaccistore.com
        |
   [Vercel CDN]
        |
   React Frontend (SPA)
        |
   /api/* (Vercel Serverless Functions)
        |
   WordPress REST API (Hostinger)
   https://vellaccistore.com o subdominio
```

## Paso 1: Preparar el repositorio

1. Inicializar git si no lo tienes:

```bash
git init
git add .
git commit -m "primera version del frontend headless"
```

2. Crear un repositorio en GitHub y subir el codigo:

```bash
git remote add origin https://github.com/tu-usuario/vellaccifront.git
git push -u origin main
```

## Paso 2: Desplegar en Vercel

1. Ir a https://vercel.com y crear una cuenta (o iniciar sesion con GitHub)
2. Clic en "New Project"
3. Importar el repositorio de GitHub
4. Vercel detectara automaticamente que es un proyecto Vite

### Configurar variables de entorno en Vercel

En la seccion "Environment Variables" agregar:

| Variable             | Valor                       | Descripcion                       |
| -------------------- | --------------------------- | --------------------------------- |
| `WORDPRESS_URL`      | `https://vellaccistore.com` | URL de tu WordPress               |
| `WC_CONSUMER_KEY`    | `ck_xxxx...`                | Clave de consumidor WooCommerce   |
| `WC_CONSUMER_SECRET` | `cs_xxxx...`                | Secreto de consumidor WooCommerce |
| `VITE_WORDPRESS_URL` | `https://vellaccistore.com` | URL para el frontend              |
| `VITE_API_BASE_URL`  | `/api`                      | Ruta base de la API               |

5. Clic en "Deploy"

## Paso 3: Configurar el dominio

### Opcion A: Usar vellaccistore.com para el frontend (recomendado)

1. En Vercel, ir a Settings > Domains
2. Agregar `vellaccistore.com`
3. Vercel te dara los registros DNS necesarios
4. En Hostinger DNS, cambiar los registros A o CNAME:
   - Tipo A: apuntar a la IP de Vercel (76.76.21.21)
   - O CNAME: apuntar a `cname.vercel-dns.com`

5. Mover WordPress a un subdominio:
   - En Hostinger, crear subdominio `wp.vellaccistore.com`
   - Mover la instalacion de WordPress ahi
   - Actualizar las variables de entorno en Vercel:
     - `WORDPRESS_URL` = `https://wp.vellaccistore.com`

### Opcion B: Mantener WordPress en el dominio principal

Si prefieres no mover WordPress:

1. Desplegar en Vercel con un subdominio temporal (ej: vellacci.vercel.app)
2. Apuntar un subdominio como `tienda.vellaccistore.com` a Vercel
3. Las variables de entorno de Vercel usarian:
   - `WORDPRESS_URL` = `https://vellaccistore.com`

## Paso 4: Verificar el despliegue

1. Visitar tu URL de Vercel
2. Verificar que los productos se cargan
3. Probar el carrito y la navegacion
4. Verificar que las imagenes cargan (vienen de WordPress)

## Notas importantes

- Las claves de WooCommerce NUNCA quedan expuestas al visitante
- Las funciones serverless en `/api/` actuan como proxy seguro
- El cache esta configurado: 60s para productos, 5min para categorias
- Vercel ofrece HTTPS automatico
- Si las imagenes tardan en cargar, considera usar un CDN para WordPress

## Problemas comunes

### Las imagenes no cargan

Las imagenes vienen de WordPress. Si WordPress esta en un subdominio diferente,
asegurate de que CORS este habilitado en WordPress:

- Agregar al archivo functions.php de WordPress:

```php
add_action('init', function() {
    header('Access-Control-Allow-Origin: *');
});
```

### Error 500 en las funciones API

Verificar que las variables de entorno esten correctas en Vercel.
Ir a Vercel > tu proyecto > Settings > Environment Variables.

### Las rutas no funcionan al recargar

Esto esta resuelto con la configuracion de rewrites en vercel.json.
Todas las rutas que no son /api/ se redirigen a index.html.
