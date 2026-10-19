import type { MenuDay } from "@/types/menu"
import { cn } from "@/lib/utils"

const WEEKDAY_LABEL: Record<string, string> = {
  "segunda-feira": "Segunda-feira",
  "terça-feira": "Terça-feira",
  "quarta-feira": "Quarta-feira",
  "quinta-feira": "Quinta-feira",
  "sexta-feira": "Sexta-feira",
}

export function MenuDay({ day }: { day: MenuDay }) {
  const isClosed = day.closed === true
  return (
    <div className={cn("border rounded-xl p-4 bg-card shadow-sm", isClosed && "bg-muted/50 border-destructive/20")}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-semibold text-muted-foreground">
          {WEEKDAY_LABEL[day.weekday] || day.weekday}
        </span>
        <span className="text-xs text-muted-foreground">{day.date}</span>
        {isClosed && (
          <span className="px-2 py-0.5 rounded text-xs font-medium border border-destructive text-destructive bg-destructive/10">
            {day.reason === "feriado" ? "Feriado" : day.reason === "ferias" ? "Férias" : "Encerrado"}
          </span>
        )}
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Sopa</dt>
        <dd className="font-medium">{day.sopa || "—"}</dd>
        <dt className="text-muted-foreground">Prato</dt>
        <dd className="font-medium">{day.prato || "—"}</dd>
        <dt className="text-muted-foreground">Vegetariano</dt>
        <dd className="font-medium">{day.vegetariano || "—"}</dd>
        <dt className="text-muted-foreground">Sobremesa</dt>
        <dd className="font-medium">{day.sobremesa || "—"}</dd>
        <dt className="text-muted-foreground">Pão</dt>
        <dd className={cn("font-medium", day.pao ? "text-green-700 dark:text-green-400" : "text-muted-foreground")}>
          {day.pao ? "Sim" : "Não"}
        </dd>
      </dl>
    </div>
  )
}
