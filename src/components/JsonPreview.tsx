"use client"

import type { SchoolMenu, MenuDay } from "@/types/menu"
import { MenuWeek } from "@/components/MenuWeek"

export function JsonPreview({
  menu,
  onConfirm,
  onCancel,
}: {
  menu: SchoolMenu
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Pré-visualização antes de aplicar</h2>
        <p className="text-sm text-muted-foreground">
          Confirme que tudo está correto antes de atualizar para todos.
        </p>
      </div>

      <MenuWeek menu={menu} />

      <div className="border rounded-xl p-4 bg-muted/30">
        <h3 className="text-sm font-semibold mb-3">Dados brutos (JSON)</h3>
        <pre className="font-mono text-xs overflow-x-auto bg-background p-3 rounded border border-border">
          {JSON.stringify(menu, null, 2)}
        </pre>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary text-sm font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors shadow-sm"
        >
          Atualizar para todos
        </button>
      </div>
    </div>
  )
}
