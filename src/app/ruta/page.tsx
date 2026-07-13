import Link from "next/link";
import type { Metadata } from "next";
import { certs, CERT_META, totalFee } from "@/lib/content";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export const metadata: Metadata = {
  title: "Ruta de estudio",
  description:
    "En qué orden atacar las cuatro certificaciones de Claude, cuánto cuesta el camino completo, y un plan de estudio por semanas basado en el peso real de cada dominio.",
};

const PLAN = [
  {
    code: "CCAO-F",
    weeks: "Semanas 1–3",
    why: "Es la puerta barata ($99) y la única que no exige código. Su temario —evaluación del output, selección de modelo, riesgo— reaparece en las otras tres, así que estudiarla primero abarata todo lo que viene.",
    focus: "Empieza por D2 (Output Evaluation), que solo él es el 21% del examen.",
  },
  {
    code: "CCDV-F",
    weeks: "Semanas 4–7",
    why: "Aquí se paga la deuda técnica: Messages API, batches, prompt caching, streaming, tools, MCP. Un solo dominio —Applications and Integration— vale un tercio del examen; si lo dominas, ya tienes la mitad del camino andado.",
    focus: "D2 (33.1%) + D5 (16.8%) = la mitad del examen en dos dominios.",
  },
  {
    code: "CCAR-F",
    weeks: "Semanas 8–12",
    why: "El examen más denso: 29 task statements y preguntas basadas en escenarios de producción largos. También el mejor documentado — su exam guide trae 12 preguntas de ejemplo y 4 ejercicios de preparación, más que las otras tres juntas.",
    focus: "D1 (Agentic Architecture, 27%) es el eje. Practica leyendo escenarios completos sin saltar al final.",
  },
  {
    code: "CCAR-P",
    weeks: "Semanas 13–17",
    why: "El nivel Professional cambia el lente: ya no es cómo construirlo, sino cómo defenderlo ante un cliente — integración, evaluación, governance, stakeholders. Déjalo al final: es el más caro ($175) y el que más se apoya en lo anterior.",
    focus: "Los tres dominios blandos (Governance, Stakeholders, Lifecycle) suman 35%. No los subestimes por ser 'no técnicos'.",
  },
];

export default function RoutePage() {
  const list = certs();

  return (
    <div className="mx-auto max-w-[84rem] px-5 py-14 sm:px-8">
      <header className="rise max-w-3xl">
        <p className="label">El camino completo</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5.5vw,4rem)]">
          Cuatro exámenes, ${totalFee()}, y un orden que no es el obvio.
        </h1>
        <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          Los cuatro exámenes son independientes: no hay prerrequisitos y puedes tomarlos en cualquier orden. Pero el
          contenido sí se acumula. Este orden —barato a caro, Foundations antes que Professional— hace que cada examen
          pague parte del siguiente.
        </p>
      </header>

      {/* dashboard personal */}
      <ProgressDashboard />

      {/* la ruta */}
      <section className="mt-20">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.4rem)]">El orden recomendado</h2>
        </div>

        <div className="mt-10 space-y-4">
          {PLAN.map((p, i) => {
            const c = list.find((x) => x.code === p.code);
            const m = CERT_META[p.code];
            if (!c || !m) return null;
            return (
              <div key={p.code} className="card rise p-6 sm:p-9" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
                  <div className="lg:w-40">
                    <p className="numeral text-[clamp(3rem,6vw,4.4rem)]" style={{ color: "var(--clay)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="label mt-2">{p.weeks}</p>
                    <p className="label mt-1">${m.feeNum} · {c.items} ítems</p>
                  </div>

                  <div>
                    <Link href={`/cert/${c.code}`} className="no-underline">
                      <h3 className="display text-[1.7rem] transition-colors hover:text-[var(--clay)]">
                        {m.role} — {m.level}
                        <span className="label ml-3">{c.code}</span>
                      </h3>
                    </Link>
                    <p className="mt-3 max-w-2xl leading-relaxed">{p.why}</p>
                    <p
                      className="mt-4 border-l-2 py-1 pl-3.5 text-sm"
                      style={{ borderColor: "var(--clay)", color: "var(--muted)" }}
                    >
                      <strong style={{ color: "var(--clay)" }}>Dónde poner las horas: </strong>
                      {p.focus}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Link href={`/cert/${c.code}`} className="btn btn-ghost no-underline">
                        Temario
                      </Link>
                      <Link href={`/cert/${c.code}/decodificador`} className="btn btn-ghost no-underline">
                        Decodificador
                      </Link>
                      <Link href={`/cert/${c.code}/simulacro`} className="btn btn-ghost no-underline">
                        Simulacro
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* verdades incómodas */}
      <section className="mt-20">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.4rem)]">Cinco cosas que conviene saber antes de pagar</h2>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {[
            {
              t: "720/1000 no es 72%",
              d: "Es una escala. Anthropic no publica cómo convierte aciertos crudos en puntos escalados, así que nadie —ni este sitio— puede decirte cuántas preguntas necesitas acertar. La única estrategia segura es apuntar a ≥80% crudo en los simulacros.",
            },
            {
              t: "Cada intento se paga",
              d: "Reprobar el Architect Professional cuesta $175 otra vez. Y hay ventana de espera: 14 días tras el primer fallo, 30 tras el segundo, 90 tras el tercero. Cuatro intentos por examen en 12 meses rodantes.",
            },
            {
              t: "La credencial caduca en 12 meses",
              d: "Y la renovación a tiempo es gratis (evaluación no proctored). Si la dejas caducar, vuelves a pagar el examen completo. Pon un recordatorio al mes 11, no al 12.",
            },
            {
              t: "El examen es en inglés",
              d: "El material de este sitio está en español, pero los enunciados de práctica están en inglés a propósito: el día del examen no habrá traducción. Cada dominio trae su glosario EN↔ES.",
            },
            {
              t: "No hay curso obligatorio",
              d: "Anthropic no exige ningún curso y no garantiza que ninguno te haga aprobar. Los cursos de preparación de Partner Academy son un recurso más, no un pase.",
            },
            {
              t: "El blueprint es el contrato",
              d: "Los ítems se escriben contra los objetivos publicados. Todo lo que no esté en el blueprint no se pregunta — y todo lo que esté, sí. Es la lista de lo que hay que saber, literalmente.",
            },
          ].map((x, i) => (
            <div key={x.t} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
              <h3 className="display text-xl" style={{ color: "var(--clay)" }}>
                {x.t}
              </h3>
              <p className="mt-2.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
