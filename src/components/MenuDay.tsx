import type { MenuDay as MenuDayType } from "@/types/menu"
import { cn } from "@/lib/utils"

const WEEKDAY_LABEL: Record<string, string> = {
  "segunda-feira": "Segunda-feira",
  "terça-feira": "Terça-feira",
  "quarta-feira": "Quarta-feira",
  "quinta-feira": "Quinta-feira",
  "sexta-feira": "Sexta-feira",
}

export function MenuDay({ day }: { day: MenuDayType }) {
  const isClosed = day.closed === true
  const dateLabel = new Date(`${day.date}T00:00:00Z`).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  })

  return (
    <article className={cn(
      "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_8px_28px_-20px_rgba(28,48,36,0.35)] transition-shadow",
      isClosed ? "border-rose-200 bg-rose-50/70" : "border-stone-200/80",
    )}>
      <div className={cn("h-1.5", isClosed ? "bg-rose-300" : "bg-emerald-700/80")} />
      <div className="flex items-start justify-between gap-2 px-4 pb-3 pt-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-stone-900">
            {WEEKDAY_LABEL[day.weekday] || day.weekday}
          </h2>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
            {dateLabel}
          </p>
        </div>
        {isClosed && (
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-800">
            {day.reason === "feriado" ? "Feriado" : day.reason === "ferias" ? "Férias" : "Encerrado"}
          </span>
        )}
      </div>
      <dl className="flex-1 divide-y divide-stone-100 px-4">
        <div className="py-3 first:pt-1">
          <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Sopa</dt>
          <dd className="mt-1 text-sm leading-5 text-stone-800">{day.sopa || "—"}</dd>
        </div>
        <div className="py-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Prato</dt>
          <dd className="mt-1 text-sm font-semibold leading-5 text-stone-900">{day.prato || "—"}</dd>
        </div>
        <div className="py-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">Vegetariano</dt>
          <dd className="mt-1 text-sm leading-5 text-stone-800">{day.vegetariano || "—"}</dd>
        </div>
        <div className="py-3 last:pb-3">
          <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Sobremesa</dt>
          <dd className="mt-1 text-sm leading-5 text-stone-800">{day.sobremesa || "—"}</dd>
        </div>
      </dl>
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs">
          <span className="font-medium text-stone-500">Pão</span>
          <span className={cn("font-bold", day.pao ? "text-emerald-800" : "text-stone-500")}>
            {day.pao ? "Incluído" : "Não incluído"}
          </span>
        </div>
      </div>
    </article>
  )
}
