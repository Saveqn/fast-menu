import { NextResponse } from "next/server"
import { listMenus, getMenuByWeek } from "@/lib/storage"
import { getMonday, getFriday, isDateInWeek } from "@/lib/menus"

// Данные из хранилища на каждый запрос — не кэшировать.
export const dynamic = "force-dynamic"

export async function GET() {
  const menus = await listMenus()

  const today = new Date()
  const weekStart = getMonday(today)
  const weekEnd = getFriday(today)

  // Procura menu da semana corrente
  const current = menus.find((m) => m.weekStart === weekStart)

  if (current) {
    return NextResponse.json({
      menu: current,
      outdated: false,
      weekStart,
      weekEnd,
    })
  }

  // Senão, devolve o mais recente disponível e marca como desatualizado
  const latest = menus[0] || null
  return NextResponse.json({
    menu: latest,
    outdated: !!latest,
    weekStart,
    weekEnd,
  })
}
