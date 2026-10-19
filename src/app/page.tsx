import { MenuWeek } from "@/components/MenuWeek"
import { OutdatedNotice } from "@/components/OutdatedNotice"
import { HistoryList } from "@/components/HistoryList"
import { listMenus } from "@/lib/storage"

export default async function HomePage() {
  const menus = await listMenus()

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setUTCHours(0, 0, 0, 0)
  const day = weekStart.getUTCDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  weekStart.setUTCDate(weekStart.getUTCDate() + mondayOffset)
  const ws = `${weekStart.getUTCFullYear()}-${String(weekStart.getUTCMonth() + 1).padStart(2, "0")}-${String(weekStart.getUTCDate()).padStart(2, "0")}`

  const current = menus.find((m) => m.weekStart === ws)
  const outdated = !current
  const menu = current || menus[0] || null

  return (
    <main className="min-h-screen">
      {menu ? (
        <>
          {outdated && <OutdatedNotice />}
          <MenuWeek menu={menu} />
          <HistoryList menus={menus} />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Ementário Escolar</h1>
            <p className="mt-2 text-muted-foreground">
              Ainda não há ementas disponíveis. Volte em breve.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
