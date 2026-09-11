# Alexandra Invierte — Landing (El Círculo)

Landing editorial de una sola página: revista financiera de lujo para latinas, con tres productos
(Tu primer plan de inversión · Mi Primer Portafolio · Swing Trading de Amigas) y captura de email.

## Contenido

| Archivo | Qué es |
|---|---|
| `index.html` | **La página. Un solo archivo, todo incluido** (fuentes, imágenes, estilos, JS). Funciona offline y en cualquier hosting. |
| `revista-standalone.html` | Copia idéntica de respaldo. |
| `productos.html`, `productos-standalone.html` | Versiones anteriores de la página de productos. |

No hay build. No hay dependencias. No hace falta Node ni npm.

## Subirlo a GitHub Pages (paso a paso)

### Opción A — desde la web de GitHub (la más simple)

1. Entra a <https://github.com/new>.
2. **Repository name:** `alexandra-invierte-landing`. Ponlo **Public**. No marques "Add a README". → **Create repository**.
3. En la pantalla siguiente pulsa **uploading an existing file**.
4. Arrastra `index.html` (y los demás archivos de esta carpeta si los quieres). → **Commit changes**.
5. Ve a **Settings → Pages**.
6. En *Source* elige **Deploy from a branch**; en *Branch* elige **main** y carpeta **/ (root)**. → **Save**.
7. Espera 1–2 minutos. Tu página queda en:
   `https://TU-USUARIO.github.io/alexandra-invierte-landing/`

### Opción B — desde la terminal

```bash
cd ruta/a/esta/carpeta          # la carpeta deploy/
git init
git add .
git commit -m "Landing El Círculo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/alexandra-invierte-landing.git
git push -u origin main
```

Luego repite los pasos 5–7 de la Opción A para activar Pages.

### Para actualizar más adelante

```bash
git add .
git commit -m "Actualizo la landing"
git push
```

GitHub Pages republica solo en unos segundos.

## Dominio propio (opcional)

1. **Settings → Pages → Custom domain**: escribe `alexandrainvierte.com` → **Save**.
2. En tu proveedor de dominio crea estos registros DNS:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - o un `CNAME` de `www` → `TU-USUARIO.github.io`
3. Vuelve a Pages y marca **Enforce HTTPS** cuando se active.

## Notas

- El archivo pesa ~1,7 MB porque lleva las fuentes y las imágenes incrustadas. Eso es a propósito: carga de una sola vez y nunca se rompe por una ruta mal puesta.
- Si editas el diseño, hazlo en `Revista.dc.html` (en la raíz del proyecto) y vuelve a generar este `index.html`; no edites el archivo compilado a mano.
- Los formularios de email son maqueta: hay que conectarlos a tu proveedor (ConvertKit, Mailchimp, Beehiiv) apuntando el `action` del formulario a su endpoint.
