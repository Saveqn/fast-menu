"use client"

import { useState } from "react"
import { AiImport } from "@/components/AiImport"
import { JsonPreview } from "@/components/JsonPreview"
import type { SchoolMenu } from "@/types/menu"

export default function AdminImportPage() {
  const [preview, setPreview] = useState<SchoolMenu | null>(null)
  const [step, setStep] = useState<"import" | "preview">("import")
  const [saveError, setSaveError] = useState("")

  async function handleGenerate(file: File | Blob, adminNote: string) {
    const res = await fetch("/api/admin/ai/import", {
      method: "POST",
      body: (() => {
        const fd = new FormData()
        fd.append("image", file, "ementario.jpg")
        if (adminNote) fd.append("adminNote", adminNote)
        return fd
      })(),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || "Erro na IA")
    }
    const data = await res.json()
    setPreview(data.menu as SchoolMenu)
    setStep("preview")
  }

  async function handleUploadJson(file: File) {
    const res = await fetch("/api/admin/upload-json", {
      method: "POST",
      body: (() => {
        const fd = new FormData()
        fd.append("json", file)
        return fd
      })(),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || "Erro no upload")
    }
    const data = await res.json()
    setPreview(data.menu as SchoolMenu)
    setStep("preview")
  }

  async function handleConfirm() {
    if (!preview) return
    setSaveError("")
    fetch("/api/admin/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preview),
    }).then(async (res) => {
      if (res.ok) {
        setStep("import")
        setPreview(null)
        window.location.href = "/"
      } else {
        // Mostra o erro real do servidor (zod, Blob, etc.)
        const data = await res.json().catch(() => ({}))
        setSaveError(data.error || `Erro ao guardar menu (${res.status})`)
      }
    })
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel de Admin</h1>
          <a
            href="/"
            className="text-sm text-primary hover:underline"
            title="Voltar ao site principal"
          >
            ← Voltar ao site principal
          </a>
        </div>

        {step === "import" ? (
          <AiImport
            onGenerate={handleGenerate}
            onUploadJson={handleUploadJson}
          />
        ) : (
          <>
            {saveError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 mb-6 whitespace-pre-wrap">
                {saveError}
              </div>
            )}
            <JsonPreview
              menu={preview!}
              onConfirm={handleConfirm}
              onCancel={() => {
                setSaveError("")
                setStep("import")
              }}
            />
          </>
        )}
      </div>
    </main>
  )
}
