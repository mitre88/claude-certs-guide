import Link from "next/link";
import type { Metadata } from "next";
import { globalStats, totalFee, DONATE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donar $5",
  description:
    "Este material es gratuito y sin registro. Si te sirvió, cinco dólares ayudan a mantenerlo actualizado cuando Anthropic publique nuevas versiones de los exam guides.",
};

export default function DonatePage() {
  const s = globalStats();
  const live = DONATE_URL.startsWith("https://");

  return (
    <div className="mx-auto max-w-[52rem] px-5 py-16 sm:px-8">
      <header className="rise">
        <p className="label">Sin muro de pago, sin registro, sin anuncios</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5.5vw,3.8rem)]">
          Cinco dólares, si te sirvió.
        </h1>
        <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          Nada de este sitio está detrás de un pago. Los cuatro temarios, las {s.questions} preguntas, los simulacros y
          los decodificadores son gratis y lo van a seguir siendo, hayas donado o no.
        </p>
      </header>

      {/* la propuesta */}
      <section className="card rise mt-12 p-8 sm:p-10" style={{ animationDelay: "80ms" }}>
        <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="label" style={{ color: "var(--clay)" }}>
              La aritmética
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              Un reintento del examen Architect cuesta{" "}
              <strong style={{ color: "var(--clay)" }}>$125</strong>. El camino completo, ${totalFee()}. Si esta guía te
              evita <em>una</em> reprobada, te ahorró 25 veces lo que pide esta página.
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              Y si no te lo puedes permitir, o simplemente no quieres: usa todo el material igual. En serio. Está aquí
              para que apruebes, no para cobrarte.
            </p>
          </div>

          <div className="text-center sm:w-44">
            <p className="numeral text-[clamp(4rem,12vw,6rem)]" style={{ color: "var(--clay)" }}>
              $5
            </p>
            <p className="label mt-2">Pago único · Stripe</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
          {live ? (
            <a href={DONATE_URL} target="_blank" rel="noreferrer" className="btn w-full justify-center no-underline sm:w-auto">
              Donar $5 con Stripe ↗
            </a>
          ) : (
            <div
              className="border-l-2 p-4"
              style={{ borderColor: "var(--clay)", background: "var(--clay-wash)" }}
            >
              <p className="label" style={{ color: "var(--clay)" }}>
                Enlace de pago pendiente
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                El enlace de Stripe todavía no está configurado. Se activa poniendo{" "}
                <code
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{ background: "var(--surface)", fontFamily: "var(--font-mono)", color: "var(--clay)" }}
                >
                  NEXT_PUBLIC_STRIPE_DONATE_URL
                </code>{" "}
                en las variables de entorno del proyecto.
              </p>
            </div>
          )}

          <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            El pago lo procesa Stripe. Este sitio no ve ni almacena tus datos de tarjeta — de hecho, no almacena nada: no
            hay servidor, no hay cuentas, no hay analítica. Tu progreso de estudio vive solo en tu navegador.
          </p>
        </div>
      </section>

      {/* a dónde va */}
      <section className="mt-16">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[1.8rem]">A dónde va</h2>
        </div>
        <ul className="mt-8 space-y-6">
          {[
            [
              "Mantener el temario vivo",
              "Los exam guides son v1.0, efectivos julio 2026. Cuando Anthropic publique la v1.1 —y lo hará— hay que releer los cuatro guides, detectar qué objetivos cambiaron, reescribir los capítulos afectados y revisar cada pregunta que colgaba de ellos.",
            ],
            [
              "Más preguntas, mejor verificadas",
              "Cada pregunta de este banco pasó por un revisor adversarial que intentó tumbarla: buscar el dato falso, la doble respuesta defendible, el distractor de paja. Ese proceso es lo caro, y es lo que separa un banco útil de mil preguntas de relleno.",
            ],
            [
              "Cubrir lo que Partner Academy no cubre en español",
              "El material oficial de preparación está en inglés y detrás del Partner Network. Este sitio es el intento de que eso no sea la barrera entre alguien y una credencial.",
            ],
          ].map(([t, d]) => (
            <li key={t}>
              <p className="display text-lg" style={{ color: "var(--clay)" }}>
                {t}
              </p>
              <p className="mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                {d}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t pt-8" style={{ borderColor: "var(--rule)" }}>
        <p className="label mb-4">Otras formas de ayudar que no cuestan nada</p>
        <ul className="space-y-2.5">
          {[
            "Encontraste una pregunta con un error factual: dilo. Corregirla vale más que los cinco dólares.",
            "Compártelo con alguien que esté por presentar. El costo marginal de un lector más es cero.",
            "Si aprobaste con esto, cuéntalo — y di qué faltó.",
          ].map((x) => (
            <li key={x} className="flex gap-3">
              <span className="label shrink-0 pt-1" style={{ color: "var(--clay)" }}>
                ◆
              </span>
              <span style={{ color: "var(--muted)" }}>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14">
        <Link href="/" className="btn btn-ghost no-underline">
          ← Volver al material
        </Link>
      </div>
    </div>
  );
}
