# Tienda — Alexandra Invierte

Tienda digital estática (un solo HTML + imágenes). No necesita servidor, base de datos ni plugins.

---

## 1 · Dónde van los links de Stripe

Abre **`index.html`**, busca este bloque (está cerca de la mitad del archivo, márcalo con Ctrl+F / Cmd+F escribiendo `LINKS DE STRIPE`):

```js
const STRIPE = {
  "presupuesto":          "https://buy.stripe.com/xxxxxxxxxxxx",
  "primera-inversion":    "",
  ...
  "kit":                  "",   // El Kit de la Inversora ($7)
  "cartera-3-etfs":       ""    // Masterclass upsell ($27)
};
```

Pega el link de cada producto entre las comillas. **Ese es el único sitio que tienes que tocar.**

- Producto con link → el botón grande pasa a ser **"Comprar ahora"** y lleva directo a Stripe.
- Producto con `""` (vacío) → sigue usando el carrito de demostración.

### Cómo se crea cada link en Stripe (2 min por producto)

1. `stripe.com` → **Productos** → **+ Añadir producto**
2. Nombre + precio, tipo **pago único** → Guardar
3. En el producto: **Crear enlace de pago** (Payment Link)
4. Dentro del enlace de pago, configura:
   - **Entrega de producto digital** → sube el PDF / plantilla (Stripe se lo manda a la compradora)
   - **Después del pago** → *Redirigir a una página*: `https://TU-DOMINIO/#/gracias`
   - Activa **recopilar correo** (viene activado por defecto)
5. Copia el link `https://buy.stripe.com/...` y pégalo en `index.html`

> Los Payment Links de Stripe son de **un producto por link**. Por eso el botón de compra directa está en la ficha de cada producto y en el kit; el carrito multi-producto sigue existiendo para navegar, pero lo que convierte es el botón directo.

---

## 2 · Subirla a GitHub

Archivos que tienen que estar en el repositorio (tal cual, respetando carpetas):

```
index.html            ← la tienda
support.js            ← runtime (obligatorio)
.nojekyll             ← obligatorio en GitHub Pages
assets/portadas/*.png ← las 12 portadas + banners
assets/fotos/*        ← las 2 fotos (hero y retrato)
README.md             ← esto
```

Pasos:

1. GitHub → **New repository** → nombre p. ej. `tienda` → Public → Create
2. **Add file → Upload files** → arrastra los archivos y la carpeta `assets` completa → Commit
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / carpeta `/ (root)` → Save
4. En 1–2 minutos la tienda está en `https://TU-USUARIO.github.io/tienda/`

### Dominio propio (opcional)

Settings → Pages → **Custom domain**: escribe `tienda.alexandrainvierte.com` y en tu proveedor de dominio crea un registro `CNAME` apuntando a `TU-USUARIO.github.io`.

---

## 3 · Pendiente antes de publicar

- **Correo.** El formulario de la guía gratis todavía no envía nada: hay que conectarlo a MailerLite (o Kit) para que la guía salga automática.
- **Legales.** Revisa que el correo `hola@alexandrainvierte.com` esté activo — es el que aparece en garantía y privacidad.

---

## 4 · Editar precios, textos o productos

Todo vive en el mismo archivo `index.html`:

| Qué | Búscalo por |
|---|---|
| Links de pago | `LINKS DE STRIPE` |
| Productos (precio, título, qué incluye) | `const P = [` |
| Galería del interior de cada producto | `const GALLERY` |
| Qué entra en el kit de $7 | `const BUNDLE_IDS` |
| Reseñas | `const REVIEWS` |
| Historias de alumnas | `const STORIES` |
| Tutoriales gratis | `const FREE` |
