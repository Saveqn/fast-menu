export type Weekday =
  | "segunda-feira"
  | "terça-feira"
  | "quarta-feira"
  | "quinta-feira"
  | "sexta-feira"

export interface MenuDay {
  date: string // YYYY-MM-DD
  weekday: Weekday
  sopa: string | null
  prato: string | null
  vegetariano: string | null
  sobremesa: string | null
  pao: boolean
  closed?: boolean
  reason?: "feriado" | "ferias" | null
}

export interface SchoolMenu {
  weekStart: string // YYYY-MM-DD (segunda-feira)
  weekEnd: string // YYYY-MM-DD (sexta-feira)
  schoolYear?: string
  days: MenuDay[]
}

export interface StoredMenu extends SchoolMenu {
  updatedAt: string // ISO timestamp
  source: "manual" | "ai" | "upload"
}
