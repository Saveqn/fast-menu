import type { StoredMenu } from "@/types/menu"
import Link from "next/link"

export function HistoryList({ menus }: { menus: StoredMenu[] }) {
  const recent = menus.slice(0, 10)
  if (recent.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center text-stone-500">
        Sem ementas no arquivo.
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-stone-900">Arquivo — últimas semanas</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recent.map((m) => {
          const start = new Date(m.weekStart + "T00:00:00Z").toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          return (
            <Link
              key={m.weekStart}
              href={`/historico/${m.weekStart}`}
              className="rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm transition-colors hover:border-emerald-700/40 hover:bg-emerald-50/50"
            >
              <div className="font-semibold text-stone-900">Semana de {start}</div>
              <div className="mt-1 text-xs text-stone-500">
                {m.days.length} dia(s) • atualizado em{" "}
                {new Date(m.updatedAt).toLocaleString("pt-PT")}
              </div>
            </Link>
          )
        })}
      </div>
      {menus.length > 10 && (
        <p className="mt-4 text-center text-xs text-stone-500">
          Apenas as últimas 10 semanas estão disponíveis. As mais antigas são
          removidas.
        </p>
      )}
    </section>
  )
}
