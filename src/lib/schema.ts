import { z } from "zod"
import type { MenuDay, SchoolMenu, Weekday } from "@/types/menu"

const weekdayEnum = z.enum([
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
])

export const menuDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weekday: weekdayEnum,
  sopa: z.string().nullable(),
  prato: z.string().nullable(),
  vegetariano: z.string().nullable(),
  sobremesa: z.string().nullable(),
  pao: z.boolean(),
  closed: z.boolean().optional(),
  reason: z.enum(["feriado", "ferias"]).nullable().optional(),
})

export const schoolMenuSchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weekEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  schoolYear: z.string().optional(),
  days: z.array(menuDaySchema).min(1).max(5),
})

export type MenuDayInput = z.infer<typeof menuDaySchema>
export type SchoolMenuInput = z.infer<typeof schoolMenuSchema>

export function validateMenu(data: unknown): SchoolMenu {
  return schoolMenuSchema.parse(data) as SchoolMenu
}
