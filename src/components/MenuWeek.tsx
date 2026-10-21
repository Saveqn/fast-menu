import type { SchoolMenu } from "@/types/menu"
import { MenuDay } from "@/components/MenuDay"
import { ScrollToToday } from "@/components/ScrollToToday"

export function MenuWeek({ menu, currentDate }: { menu: SchoolMenu; currentDate?: string }) {
  const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
  const start = formatDate(menu.weekStart)
  const end = formatDate(menu.weekEnd)

  return (
    <section className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
      <header className="mb-7 flex flex-col gap-3 border-b border-stone-200 pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Ementário escolar</p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Ementa da semana</h1>
          <p className="mt-2 text-sm text-stone-600">De {start} a {end}</p>
        </div>
        <p className="text-sm text-stone-500">Almoços de segunda a sexta-feira</p>
      </header>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {currentDate && <ScrollToToday />}
        {menu.days.map((day) => {
          const isToday = currentDate === day.date
          return (
            <div
              key={day.date}
              id={isToday ? "today-menu-day" : undefined}
              className={isToday ? "scroll-mt-4 rounded-[18px] bg-emerald-100 p-1.5 ring-1 ring-emerald-700/20 shadow-[0_12px_32px_-20px_rgba(6,78,59,0.5)]" : ""}
            >
              {isToday && (
                <p className="px-3 pb-1.5 pt-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-900">Hoje</p>
              )}
              <MenuDay day={day} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
