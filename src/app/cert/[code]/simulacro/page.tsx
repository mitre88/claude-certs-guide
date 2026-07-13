import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert } from "@/lib/content";
import { MockClient } from "@/components/MockClient";

export const dynamicParams = false;
export const generateStaticParams = () => certs().map((c) => ({ code: c.code }));

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const c = cert(code);
  return c
    ? {
        title: `Simulacro — ${c.code}`,
        description: `Simulacro cronometrado de ${c.name}: ${c.items} ítems en ${c.minutes} minutos, con la mezcla de dominios del blueprint oficial.`,
      }
    : {};
}

export default async function MockPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = cert(code);
  if (!c) notFound();

  return (
    <MockClient
      cert={c.code}
      certName={c.nameEs}
      items={c.items}
      minutes={c.minutes}
      passScaled={c.passScaled}
      questions={c.questions}
      blueprint={c.blueprint}
      domains={c.domains.map((d) => ({ n: d.n, titleEs: d.titleEs, weight: d.weight }))}
    />
  );
}
