import { BrandLogo } from "@/components/BrandLogo"

const creators = [
  { name: "Dmytro Honcharenko", number: 6, email: "a22400@eshm.edu.pt" },
  { name: "Cláudio Barros", number: 3, email: "a21923@eshm.edu.pt" },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-emerald-950/10 bg-[#163a32] text-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr] md:items-center md:py-10">
        <a
          href="https://www.escolahenriquemedina.org/"
          target="_blank"
          rel="noreferrer"
          aria-label="Escola Secundária Henrique Medina"
          className="flex w-fit items-center gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <BrandLogo
            src="/images/logos/eshm_logo.jpeg"
            alt="Logótipo da Escola Henrique Medina"
            className="h-14 w-14"
          />
          <span className="flex max-w-48 flex-col text-sm leading-5">
            <span className="font-semibold text-emerald-50">Escola Secundária Henrique Medina</span>
            <span className="mt-1 text-xs text-emerald-100/80">Esposende, Portugal</span>
          </span>
        </a>

        <div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm font-bold tracking-wide">Fast-menu</p>
            <a
              href="https://github.com/Saveqn/fast-menu"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-emerald-100 underline decoration-emerald-100/40 underline-offset-4 transition-colors hover:text-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.75-1.31-3.75-1.31-.51-1.29-1.25-1.63-1.25-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1 1.72 2.62 1.22 3.26.93.1-.73.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.1-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.16 1.77 1.16 2.99 0 4.29-2.61 5.24-5.1 5.51.4.34.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>
              Projeto no GitHub
            </a>
            <a
              href="https://vercel.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Obrigado pelo hosting, Vercel — vercel.com"
              className="inline-flex items-center gap-2 text-xs text-emerald-100 underline decoration-emerald-100/40 underline-offset-4 transition-colors hover:text-white"
            >
              <span>Obrigado pelo hosting, Vercel</span>
            </a>
            <a
              href="/vercel-hobby"
              className="inline-flex items-center text-xs text-emerald-100 underline decoration-emerald-100/40 underline-offset-4 transition-colors hover:text-white"
            >
              Why this site uses Hobby
            </a>
          </div>
        </div>

        <div className="md:justify-self-end">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
            Feito por
          </p>
          <ul className="space-y-1.5 text-sm">
            {creators.map((creator) => (
              <li key={creator.email} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-white">{creator.name} · N.º {creator.number}</span>
                <a
                  href={`mailto:${creator.email}`}
                  className="text-xs text-emerald-100 underline decoration-emerald-100/40 underline-offset-4 transition-colors hover:text-white"
                >
                  {creator.email}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-emerald-100/80">3.º TGPSI (2026/2027)</p>
        </div>
      </div>
      <p className="mx-auto max-w-[1500px] px-5 pb-5 text-[10px] leading-4 text-emerald-100/65 sm:px-8">
        Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.
      </p>
    </footer>
  )
}

