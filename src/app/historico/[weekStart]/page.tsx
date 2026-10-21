import { notFound } from "next/navigation"
import { MenuWeek } from "@/components/MenuWeek"
import { getMenuByWeek } from "@/lib/storage"

export const dynamic = "force-dynamic"

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
    <main className="min-h-screen bg-[#faf9f6] py-8 sm:py-12">
      <MenuWeek menu={menu} />
    </main>
  )
}
