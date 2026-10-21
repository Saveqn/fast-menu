import { MenuWeek } from "@/components/MenuWeek"
import { OutdatedNotice } from "@/components/OutdatedNotice"
import { HistoryList } from "@/components/HistoryList"
import { listMenus } from "@/lib/storage"

// Страница читает хранилище (Blob/fs) на каждый запрос — рендерим динамически.
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const menus = await listMenus()

  const today = new Date()
  const lisbonDateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(today)
  const currentDate = `${lisbonDateParts.find((part) => part.type === "year")?.value}-${lisbonDateParts.find((part) => part.type === "month")?.value}-${lisbonDateParts.find((part) => part.type === "day")?.value}`
  const weekStart = new Date(`${currentDate}T12:00:00Z`)
  const day = weekStart.getUTCDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  weekStart.setUTCDate(weekStart.getUTCDate() + mondayOffset)
  const ws = `${weekStart.getUTCFullYear()}-${String(weekStart.getUTCMonth() + 1).padStart(2, "0")}-${String(weekStart.getUTCDate()).padStart(2, "0")}`

  const current = menus.find((m) => m.weekStart === ws)
  const outdated = !current
  const menu = current || menus[0] || null

  return (
    <main className="min-h-screen bg-[#faf9f6] py-8 sm:py-12">
      {menu ? (
        <>
          {outdated && <div className="mx-auto mb-6 max-w-[1500px] px-4 sm:px-6 lg:px-8"><OutdatedNotice /></div>}
          <MenuWeek menu={menu} currentDate={current ? currentDate : undefined} />
          <div className="mx-auto mt-12 max-w-[1500px] border-t border-stone-200 pt-8 sm:mt-16 sm:pt-10">
            <HistoryList menus={menus} />
          </div>
        </>
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-stone-950">Ementário escolar</h1>
            <p className="mt-2 text-stone-600">
              Ainda não há ementas disponíveis. Volte em breve.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
