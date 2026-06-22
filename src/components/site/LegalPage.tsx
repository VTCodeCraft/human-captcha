import { PageShell } from "@/components/site/PageShell";

export interface LegalSection {
  heading: string;
  /** One or more paragraphs of body copy for the section. */
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  /** Human-readable "last updated" date, e.g. "June 23, 2026". */
  updated: string;
  intro?: string;
  sections: LegalSection[];
}

/** Shared renderer for long-form legal documents (Privacy, Terms). */
export function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-xs font-medium uppercase tracking-wider text-[#00dbe9]">
          Last updated {updated}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 text-base leading-relaxed text-zinc-400">{intro}</p>
        )}

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-white">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-3 text-sm leading-relaxed text-zinc-400"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
