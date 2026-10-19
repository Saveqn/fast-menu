export function OutdatedNotice() {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-900/10 dark:text-yellow-200">
        <h2 className="font-bold flex items-center gap-2">
          ⚠️ Atenção: Ementa não atualizada esta semana
        </h2>
        <p className="mt-1 text-sm">
          Não há ementa para a semana corrente. Está a ser mostrada a última
          ementa disponível. Pode estar desatualizada.
        </p>
      </div>
    </div>
  )
}
