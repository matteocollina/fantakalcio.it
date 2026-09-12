import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="space-y-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        About
      </p>
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="shrink-0">
          <Image
            src="/mc.png"
            alt="Matteo Collina"
            width={160}
            height={160}
            className="rounded-2xl border border-[var(--border)] object-cover"
            priority
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Chi sono
          </h1>
          <div className="max-w-3xl space-y-4 text-lg leading-8 text-[var(--text-secondary)]">
            <p>
              Sono Matteo Collina, vivo a Cervia (RA) e sono appassionato di
              informatica, calcio e musica elettronica.
            </p>
            <p>
              Questo é il mio blog con contenuti in italiano dedicati al
              frontend, dove raccolgo pensieri, esperienze e risorse utili.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-base text-[var(--text-secondary)]">
        <a
          href="https://github.com/matteocollina"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-md px-3 py-2 font-semibold underline decoration-[var(--text-muted)] underline-offset-4 transition-colors hover:bg-[var(--accent-bg)] hover:text-[var(--accent-fg)] hover:decoration-[var(--accent-fg)]"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/matteo-collina"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-md px-3 py-2 font-semibold underline decoration-[var(--text-muted)] underline-offset-4 transition-colors hover:bg-[var(--accent-bg)] hover:text-[var(--accent-fg)] hover:decoration-[var(--accent-fg)]"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
