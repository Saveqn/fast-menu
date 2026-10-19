import type { SchoolMenu, Weekday } from "@/types/menu"

const WEEKDAYS_PT: Weekday[] = [
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
]

/**
 * Devolve a data da segunda-feira da semana da data dada (YYYY-MM-DD).
 */
export function getMonday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getUTCDay() // 0 = domingo
  const mondayOffset = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + mondayOffset)
  return formatDate(d)
}

/**
 * Devolve a data da sexta-feira da semana da data dada.
 */
export function getFriday(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getUTCDay()
  const fridayOffset = day === 0 ? 5 : 5 - day
  d.setUTCDate(d.getUTCDate() + fridayOffset)
  return formatDate(d)
}

function formatDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * Verifica se uma data (YYYY-MM-DD) está dentro da semana [start, end].
 */
export function isDateInWeek(dateStr: string, weekStart: string, weekEnd: string): boolean {
  return dateStr >= weekStart && dateStr <= weekEnd
}

/**
 * Gera os objetos de dia da semana para um intervalo segunda-sexta.
 */
export function generateWeekDays(weekStart: string, weekEnd: string): MenuDayInput[] {
  const days: MenuDayInput[] = []
  const start = new Date(weekStart + "T00:00:00Z")
  const end = new Date(weekEnd + "T00:00:00Z")
  let cursor = new Date(start)
  while (cursor <= end) {
    const iso = formatDate(cursor)
    const weekdayIndex = cursor.getUTCDay()
    const weekday: Weekday = WEEKDAYS_PT[(weekdayIndex + 6) % 7] // domingo=6 -> segunda=0 no nosso array? ajustado
    days.push({
      date: iso,
      weekday,
      sopa: null,
      prato: null,
      vegetariano: null,
      sobremesa: null,
      pao: true,
    })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return days
}

export interface MenuDayInput {
  date: string
  weekday: Weekday
  sopa: string | null
  prato: string | null
  vegetariano: string | null
  sobremesa: string | null
  pao: boolean
  closed?: boolean
  reason?: "feriado" | "ferias" | null
}
