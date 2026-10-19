import { notFound } from "next/navigation"
import { MenuWeek } from "@/components/MenuWeek"
import { getMenuByWeek } from "@/lib/storage"

export default async function HistoricoWeekPage({
  params,
}: {
  params: { weekStart: string }
}) {
  const menu = await getMenuByWeek(params.weekStart)
  if (!menu) {
    notFound()
  }

  return (
    <main className="min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Ementa — {params.weekStart}</h1>
      <MenuWeek menu={menu} />
    </main>
  )
}
