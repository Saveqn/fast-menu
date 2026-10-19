import type { SchoolMenu } from "@/types/menu"
import { MenuDay } from "@/components/MenuDay"

export function MenuWeek({ menu }: { menu: SchoolMenu }) {
  const start = new Date(menu.weekStart + "T00:00:00Z").toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  const end = new Date(menu.weekEnd + "T00:00:00Z").toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <section className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ementa da Semana</h1>
        <p className="text-muted-foreground">
          De {start} até {end}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menu.days.map((day) => (
          <MenuDay key={day.date} day={day} />
        ))}
      </div>
    </section>
  )
}
