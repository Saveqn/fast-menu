import { HistoryList } from "@/components/HistoryList"
import { listMenus } from "@/lib/storage"
import { MenuWeek } from "@/components/MenuWeek"

export const dynamic = "force-dynamic"

export default async function HistoricoPage() {
  const menus = await listMenus()
  const latest = menus[0]

  return (
    <main className="min-h-screen bg-[#faf9f6] py-8 sm:py-12">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Arquivo de ementas</h1>
      </div>
      {latest ? (
        <>
          <MenuWeek menu={latest} />
          <div className="mx-auto mt-12 max-w-[1500px] border-t border-stone-200 pt-8 sm:mt-16 sm:pt-10">
            <HistoryList menus={menus} />
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-stone-500">
          Nenhuma ementa disponível.
        </div>
      )}
    </main>
  )
}
