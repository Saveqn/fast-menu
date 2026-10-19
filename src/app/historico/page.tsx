import { HistoryList } from "@/components/HistoryList"
import { listMenus } from "@/lib/storage"
import { MenuWeek } from "@/components/MenuWeek"

export const dynamic = "force-dynamic"

export default async function HistoricoPage() {
  const menus = await listMenus()
  const latest = menus[0]

  return (
    <main className="min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-6">Arquivo de Ementas</h1>
      {latest ? (
        <>
          <MenuWeek menu={latest} />
          <HistoryList menus={menus} />
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma ementa disponível.
        </div>
      )}
    </main>
  )
}
