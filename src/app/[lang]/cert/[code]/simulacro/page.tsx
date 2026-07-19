import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certs, cert } from "@/lib/content";
import { MockClient } from "@/components/MockClient";
import { isLang, t, type Lang } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => certs("es").map((c) => ({ code: c.code }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}): Promise<Metadata> {
  const { lang, code } = await params;
  if (!isLang(lang)) return {};
  const c = cert(lang, code);
  const S = t(lang);
  return c
    ? { title: S.mock.metaTitle(c.code), description: S.mock.metaDescription(c.name, c.items, c.minutes) }
    : {};
}

export default async function MockPage({ params }: { params: Promise<{ lang: string; code: string }> }) {
  const { lang: raw, code } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const c = cert(lang, code);
  if (!c) notFound();

  return (
    <MockClient
      lang={lang}
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
