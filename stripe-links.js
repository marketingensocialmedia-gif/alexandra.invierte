// ─────────────────────────────────────────────────────────────────
// STRIPE LINKS · Alexandra Invierte
// ─────────────────────────────────────────────────────────────────
// Aquí pegas los enlaces de pago de Stripe. Uno por producto.
// Mientras estén vacíos, el botón "Comprar" lleva al carrito interno.
// En cuanto pegues el link, empieza a ir a Stripe.
//
// Cómo obtener el link (Stripe Dashboard):
//   Payment Links → Nuevo → Precio en USD → Guardar
//   → En "Después del pago" pega: https://alexandratrumar.com/#/gracias
//   → Copia el link (empieza con https://buy.stripe.com/...)
//   → Pégalo abajo entre las comillas.
//
// Para editar en el navegador, abre:
//   https://alexandratrumar.com/links-stripe.html
// (esa página guarda los cambios y te da el archivo listo para subir a GitHub)
// ─────────────────────────────────────────────────────────────────

window.STRIPE_LINKS = {
  "sistema-gastos":       "",   // $37 · Fase 1 · Sistema de Gastos
  "fondo-emergencia":     "",   // $37 · Fase 1 · Fondo de Emergencia
  "curso-cartera":        "",   // $47 · Fase 2 · Curso de Cartera
  "plan-pension":         "",   // $47 · Fase 1 · Plan de Pensión
  "finanzas-pareja":      "",   // $37 · Fase 1 · Finanzas en Pareja
  "mercado-en-rojo":      "",   // $27 · Fase 4 · Protocolo del Mercado en Rojo
  "finanzas-familiares":  ""    // $37 · Fase 1 · Finanzas Familiares
};
