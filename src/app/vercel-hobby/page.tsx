import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Why Fast-menu Uses Vercel Hobby",
  description: "Information about the educational, non-commercial purpose of Fast-menu and its use of Vercel Hobby.",
}

export default function VercelHobbyPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10 text-stone-800 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-emerald-800">Fast-menu · Project information</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Why this site uses Vercel Hobby
        </h1>

        <div className="mt-8 space-y-6 leading-7 text-stone-700">
          <p>
            Fast-menu is a small, student-made project created for a school presentation by two students in 3.º TGPSI at Escola Secundária Henrique Medina, in Esposende, Portugal. The school has not hired us to build or operate this website.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-stone-950">What the site does</h2>
            <p className="mt-2">
              It displays the school canteen menu by day of the week. We photograph the menu schedule and enter the information manually so students can quickly see what food is planned for each day. The data is informational and the site does not provide a paid service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-950">Why we consider it non-commercial</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 marker:text-emerald-700">
              <li>No one pays us to build, update, or host Fast-menu.</li>
              <li>The site does not sell products or services, accept payments, show advertisements, or use affiliate links.</li>
              <li>We receive no income or other financial benefit from the project.</li>
              <li>Its purpose is educational and to make the school menu easier for students to check.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-950">Traffic and availability</h2>
            <p className="mt-2">
              More students visiting the site would mean that the information is useful; it would not, by itself, create revenue or make the project commercial. We understand that Vercel Hobby usage limits still apply. We are not asking for those limits to be bypassed or for unlimited capacity. We ask that Fast-menu be assessed by its actual purpose and use, rather than blocked solely because many students access it.
            </p>
          </section>

          <p className="border-t border-stone-200 pt-5 text-sm leading-6 text-stone-500">
            This page explains our project and our understanding of its use. Vercel determines how its plans and policies apply. If usage reaches a plan limit, availability may be affected under Vercel’s published terms.
          </p>

          <p className="text-sm">
            References: <a className="text-emerald-800 underline underline-offset-4 hover:text-emerald-950" href="https://vercel.com/docs/limits/fair-use-guidelines" target="_blank" rel="noreferrer">Vercel Fair Use Guidelines</a> · <a className="text-emerald-800 underline underline-offset-4 hover:text-emerald-950" href="https://vercel.com/legal/terms" target="_blank" rel="noreferrer">Vercel Terms of Service</a>
          </p>
        </div>
      </article>
    </main>
  )
}
