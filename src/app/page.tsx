import Link from "next/link";
import { certs, CERT_META, globalStats, totalFee } from "@/lib/content";

export default function Home() {
  const list = certs();
  const s = globalStats();

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p className="label rise" style={{ animationDelay: "0ms" }}>
              Exam guides oficiales v1.0 · Efectivos julio 2026
            </p>

            <h1 className="display rise mt-5 text-[clamp(2.6rem,6.5vw,5.2rem)]" style={{ animationDelay: "70ms" }}>
              Las cuatro certificaciones de Claude,
              <span style={{ color: "var(--clay)" }}> estudiadas a fondo</span> y en español.
            </h1>

            <p
              className="rise mt-7 max-w-2xl text-lg leading-relaxed"
              style={{ animationDelay: "140ms", color: "var(--muted)" }}
            >
              Anthropic publica el blueprint de cada examen y unas pocas preguntas de ejemplo. Aquí está todo lo demás:
              cada objetivo oficial desarrollado, {s.questions - s.official} preguntas de práctica escritas contra esos
              objetivos y verificadas una por una, simulacros con la mezcla real de dominios, y el patrón con el que
              están construidos los distractores.
            </p>

            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "210ms" }}>
              <Link href="/cert/CCAO-F" className="btn no-underline">
                Empezar por Associate
              </Link>
              <Link href="/ruta" className="btn btn-ghost no-underline">
                Ver la ruta completa
              </Link>
            </div>

            <dl
              className="rise mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t pt-8 sm:grid-cols-4"
              style={{ animationDelay: "280ms", borderColor: "var(--rule)" }}
            >
              {[
                { n: s.questions, l: "Preguntas", sub: `${s.official} oficiales` },
                { n: s.domains, l: "Dominios", sub: `${s.objectives} objetivos` },
                { n: Math.round(s.words / 1000) + "k", l: "Palabras", sub: "de temario" },
                { n: "$" + totalFee(), l: "Costo total", sub: "las 4 exámenes" },
              ].map((x) => (
                <div key={x.l}>
                  <dd className="numeral text-[2.6rem]">{x.n}</dd>
                  <dt className="label mt-2.5">{x.l}</dt>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {x.sub}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* ficha del examen */}
          <aside
            className="card rise h-fit p-7 lg:sticky lg:top-24"
            style={{ animationDelay: "350ms" }}
          >
            <p className="label">Lo que hay que saber antes de pagar</p>
            <ul className="mt-5 space-y-4 text-sm">
              {[
                ["Corte", "720 / 1000 escalado — NO es 72% de aciertos. El mapeo raw→escalado no es público."],
                ["Formato", "Multiple choice y multiple response. 120 minutos. Proctored (Pearson VUE, online o centro)."],
                ["Prerrequisitos", "Ninguno. Los cuatro exámenes son independientes: puedes tomarlos en el orden que quieras."],
                ["Reintentos", "Hasta 4 por examen en 12 meses rodantes. Esperas de 14, 30 y 90 días. Cada intento se paga."],
                ["Vigencia", "12 meses. La renovación a tiempo es gratis; si caduca, pagas el examen completo otra vez."],
              ].map(([k, v]) => (
                <li key={k} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: "var(--rule)" }}>
                  <p className="label" style={{ color: "var(--clay)" }}>
                    {k}
                  </p>
                  <p className="mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                    {v}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ---------- las 4 certificaciones ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="flex items-baseline justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.6rem)]">Las cuatro credenciales</h2>
          <p className="label hidden sm:block">Elige por rol, no por prestigio</p>
        </div>

        <div className="mt-10 space-y-5">
          {list.map((c, i) => {
            const m = CERT_META[c.code];
            const heaviest = [...c.domains].sort((a, b) => b.weight - a.weight)[0];
            return (
              <Link
                key={c.code}
                href={`/cert/${c.code}`}
                className="card rise group block p-7 no-underline transition-all duration-300 hover:-translate-y-0.5 sm:p-9"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  {/* numeral gigante */}
                  <div className="flex items-baseline gap-4 lg:w-44 lg:flex-col lg:items-start lg:gap-1">
                    <p
                      className="numeral text-[clamp(3rem,7vw,4.6rem)] transition-colors group-hover:text-[var(--clay)]"
                      style={{ color: "var(--ink)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="label">{c.code}</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="display text-[1.7rem]">{m?.role}</h3>
                      <span
                        className="label rounded px-2 py-0.5"
                        style={{
                          background: m?.level === "Professional" ? "var(--clay-wash)" : "transparent",
                          color: m?.level === "Professional" ? "var(--clay)" : "var(--muted)",
                          border: m?.level === "Professional" ? "none" : "1px solid var(--rule)",
                        }}
                      >
                        {m?.level}
                      </span>
                    </div>
                    <p className="mt-2.5 max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
                      {m?.tagline}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                      {[
                        `${c.items} ítems`,
                        `${c.domains.length} dominios`,
                        `${c.stats.questions} preguntas aquí`,
                        `El más pesado: D${heaviest.n} (${heaviest.weight}%)`,
                      ].map((t) => (
                        <span key={t} className="label">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* blueprint como cinta */}
                    <div className="mt-5 flex h-1.5 w-full max-w-xl overflow-hidden rounded-full">
                      {c.domains.map((d, di) => (
                        <div
                          key={d.n}
                          className="bar-grow h-full"
                          title={`D${d.n} · ${d.titleEs} · ${d.weight}%`}
                          style={{
                            width: `${d.weight}%`,
                            background: "var(--clay)",
                            opacity: 1 - di * 0.12,
                            animationDelay: `${i * 80 + di * 60}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-2">
                    <p className="numeral text-[2.2rem]">${m?.feeNum}</p>
                    <span className="label transition-colors group-hover:text-[var(--clay)]">Estudiar →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- cómo se usa ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="border-b pb-4" style={{ borderColor: "var(--rule)" }}>
          <h2 className="display text-[clamp(1.8rem,3.5vw,2.6rem)]">Cómo usar esto</h2>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Lee el decodificador antes que el temario",
              d: "Cada examen tiene un patrón de construcción. Las preguntas oficiales lo revelan: hay un arquetipo de respuesta correcta y cuatro arquetipos de distractor. Reconocerlos te resuelve los ítems que no sabes de memoria.",
            },
            {
              n: "02",
              t: "Ataca los dominios por peso, no por orden",
              d: "En Associate, tres dominios son la mitad del examen. En Developer, uno solo pesa 33%. Estudiar el dominio 1 primero porque es el primero es desperdiciar horas: el sitio ordena por impacto.",
            },
            {
              n: "03",
              t: "Practica primero, simula al final",
              d: "El modo práctica te da la explicación y el análisis de cada distractor al instante. El simulacro replica el blueprint real con cronómetro y sin feedback, y te devuelve el desglose por dominio.",
            },
          ].map((x, i) => (
            <div key={x.n} className="rise" style={{ animationDelay: `${i * 90}ms` }}>
              <p className="numeral text-[2.4rem]" style={{ color: "var(--clay)" }}>
                {x.n}
              </p>
              <h3 className="display mt-4 text-xl">{x.t}</h3>
              <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- donación ---------- */}
      <section className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8">
        <div className="card p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_auto] lg:items-center">
            <div>
              <p className="label">Gratis, y sin muro de pago</p>
              <h2 className="display mt-3 text-[clamp(1.6rem,3vw,2.2rem)]">
                Si te ahorra una reprobada, te ahorró más de lo que cuesta un café.
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: "var(--muted)" }}>
                Todo el material es gratuito y lo seguirá siendo. Un reintento del examen Architect cuesta $125. Si esta
                guía te evita ese golpe, cinco dólares son un intercambio decente — y financian que el temario siga
                actualizado cuando Anthropic publique la v1.1.
              </p>
            </div>
            <Link href="/donar" className="btn shrink-0 no-underline">
              Donar $5
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
