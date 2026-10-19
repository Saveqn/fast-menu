"use client"

import { useState } from "react"
import { AiImport } from "@/components/AiImport"
import { JsonPreview } from "@/components/JsonPreview"
import type { SchoolMenu } from "@/types/menu"

export default function AdminImportPage() {
  const [preview, setPreview] = useState<SchoolMenu | null>(null)
  const [step, setStep] = useState<"import" | "preview">("import")

  async function handleGenerate(file: File, adminNote: string) {
    const res = await fetch("/api/admin/ai/import", {
      method: "POST",
      body: (() => {
        const fd = new FormData()
        fd.append("image", file)
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

  function handleConfirm() {
    if (!preview) return
    fetch("/api/admin/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preview),
    }).then((res) => {
      if (res.ok) {
        setStep("import")
        setPreview(null)
        window.location.href = "/"
      } else {
        alert("Erro ao guardar menu")
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
          <JsonPreview
            menu={preview!}
            onConfirm={handleConfirm}
            onCancel={() => setStep("import")}
          />
        )}
      </div>
    </main>
  )
}
