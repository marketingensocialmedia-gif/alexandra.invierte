# Tienda · Alexandra Invierte

Tienda estática (HTML + imágenes) publicada con GitHub Pages en **alexandratrumar.com**. No necesita servidor ni base de datos.

## Poner los links de Stripe (lo más fácil)

1. Abre **https://alexandratrumar.com/links-stripe.html**
2. Pega el link de cada producto en su casilla (`https://buy.stripe.com/...`).
3. Pulsa **1 · Copiar**, luego **2 · Abrir en GitHub**, pega (Cmd + A, Cmd + V) y confirma con **Commit changes**.

Los productos sin link usan el carrito de demostración.

## Qué hace cada archivo

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda: textos, precios y productos |
| `support.js` | Motor que dibuja la tienda. No se toca |
| `stripe-links.js` | Los links de Stripe. Lo genera `links-stripe.html` |
| `links-stripe.html` | Página para pegar los links de Stripe |
| `assets/` | Imágenes: `hero.png`, `alexandra.jpeg` y una portada por producto (`presupuesto.png`, `etfs.png`, ...) |
| `CNAME`, `.nojekyll` | Configuración de GitHub Pages. No borrar |

## Pendiente antes de vender

- Links de Stripe de los 14 productos.
- Conectar el formulario de la guía gratis (MailerLite o Kit).
- Definir cómo se entregan los archivos después del pago.
