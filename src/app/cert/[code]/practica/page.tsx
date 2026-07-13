import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert } from "@/lib/content";
import { PracticeClient } from "@/components/PracticeClient";

export const dynamicParams = false;
export const generateStaticParams = () => certs().map((c) => ({ code: c.code }));

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const c = cert(code);
  return c
    ? {
        title: `Práctica — ${c.code}`,
        description: `${c.stats.questions} preguntas de práctica para ${c.name}, con explicación y análisis de cada distractor.`,
      }
    : {};
}

export default async function PracticePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = cert(code);
  if (!c) notFound();

  return (
    <PracticeClient
      cert={c.code}
      certName={c.nameEs}
      questions={c.questions}
      domains={c.domains.map((d) => ({ n: d.n, titleEs: d.titleEs, weight: d.weight }))}
    />
  );
}
