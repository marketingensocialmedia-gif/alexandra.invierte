# Rediseño de la tienda

Súbelo tal cual está estructurado a la raíz del repo, sobreescribiendo lo existente:

- `index.html` — la tienda completa reescrita: mapa de 4 fases, nueva anatomía de ficha, Kit destacado arriba, Inversora con Criterio al final.
- `stripe-links.js` — nuevas keys (6): `kit`, `tu-primer-plan`, `mi-primer-portafolio`, `etfs-sin-miedo`, `reto-7-dias`, `inversora-con-criterio`. Deja vacío lo que no tengas.
- `links-stripe.html` — el panel oculto para pegar los links (`alexandratrumar.com/links-stripe.html`), ya con las 6 keys nuevas.
- `assets/capturas/` — las 6 capturas que me mandaste, optimizadas para web. Van a la carpeta `/assets/capturas/` del repo.
- `acceso-plantilla.html` — plantilla para páginas de acceso post-compra. Duplícala por producto y renombra a `acceso-<slug-secreto>.html`.

## Lo que NO está en el paquete (te lo digo por si acaso)
- **Huecos de testimonio:** en cada ficha (incluidas Kit y Criterio) hay 3 huecos vacíos con el comentario `<!-- pega aquí el testimonio -->`. Cuando tengas testimonios reales, edítalos ahí.
- **Cripto con Cabeza:** eliminado por completo. Si tienes links en Instagram, TikTok o correos apuntando a `#/producto/cripto`, la ruta ya no existe y llevará al home.
- **Order bump y upsell:** eliminados. El checkout es limpio, un solo botón por producto.
- **6 productos "Próximamente"**: cada botón "Avísame" abre el enlace de ManyChat que me pasaste.

## Nota sobre las capturas
Las capturas que me mandaste ya están en la línea crema+rojo+Playfair de la tienda, así que se integran perfectamente en cada ficha. No necesitas cambiar nada.
