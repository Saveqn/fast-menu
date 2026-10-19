import type { StoredMenu } from "@/types/menu"
import Link from "next/link"

export function HistoryList({ menus }: { menus: StoredMenu[] }) {
  const recent = menus.slice(0, 10)
  if (recent.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 text-center py-8 text-muted-foreground">
        Sem ementas no arquivo.
      </div>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-bold mb-4">Arquivo — últimas semanas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="border rounded-xl p-4 hover:bg-accent transition-colors"
            >
              <div className="font-semibold">{start}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {m.days.length} dia(s) • atualizado em{" "}
                {new Date(m.updatedAt).toLocaleString("pt-PT")}
              </div>
            </Link>
          )
        })}
      </div>
      {menus.length > 10 && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Apenas as últimas 10 semanas estão disponíveis. As mais antigas são
          removidas.
        </p>
      )}
    </section>
  )
}
