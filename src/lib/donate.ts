/**
 * Apoyo "invítame un café" — UN solo Stripe Payment Link de tipo
 * "el cliente elige el monto" (pay-what-you-want). Los montos $5/$10/$20
 * son solo sugerencias visuales; el cliente teclea lo que quiera en Stripe.
 * La URL se inyecta por variable de entorno para cambiarla sin tocar código.
 */
export const DONATE_URL =
  process.env.NEXT_PUBLIC_STRIPE_DONATE_URL ??
  process.env.NEXT_PUBLIC_STRIPE_DONATE_URL_5 ??
  "";

export const SUGGESTED: readonly number[] = [5, 10, 20];

export const donateLive = () => DONATE_URL.startsWith("https://");
