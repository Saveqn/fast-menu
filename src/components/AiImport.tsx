"use client"

import { useState } from "react"
import type { SchoolMenu } from "@/types/menu"

const AI_PROMPT_TEXT = `You are an assistant that extracts school canteen menus from photos.
Return ONLY valid JSON, no markdown, no extra text before or after.

Required JSON structure:
{
  "weekStart": "YYYY-MM-DD",
  "weekEnd": "YYYY-MM-DD",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "weekday": "monday | tuesday | wednesday | thursday | friday",
      "sopa": "string or null",
      "prato": "string or null",
      "vegetariano": "string or null",
      "sobremesa": "string or null",
      "pao": true | false,
      "closed": true | false,
      "reason": "holiday | vacation | null"
    }
  ]
}

Rules:
- Include only weekdays (Monday to Friday).
- If a day is closed (holiday / vacation): closed: true, food fields may be null.
- pao: true if bread is mentioned, false if not mentioned.
- If unsure about a field, use null.
- Do not include markdown code fences. Do not explain. Return ONLY raw JSON.`

export function AiImport({
  onGenerate,
  onUploadJson,
}: {
  onGenerate: (file: File, adminNote: string) => Promise<void>
  onUploadJson: (file: File) => Promise<void>
}) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [adminNote, setAdminNote] = useState("")
  const [preview, setPreview] = useState<SchoolMenu | null>(null)
  const [rawText, setRawText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGenerate() {
    if (!imageFile) {
      setError("Selecione primeiro uma foto do ementário.")
      return
    }
    setError("")
    setLoading(true)
    try {
      await onGenerate(imageFile, adminNote)
    } catch (err: any) {
      setError(err?.message || "Erro ao gerar JSON com a IA.")
    } finally {
      setLoading(false)
    }
  }

  async function handleJsonUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError("")
    setLoading(true)
    try {
      await onUploadJson(file)
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar ficheiro JSON.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Área de foto + instruções IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">1. Foto do ementário</h2>
          <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors relative group">
            {imageFile ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Pré-visualização da foto"
                  className="max-h-64 mx-auto rounded-lg object-cover shadow"
                />
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute -top-3 -right-3 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">Clique para escolher uma foto</p>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setImageFile(f)
                  }}
                />
                <label className="inline-block mt-2 rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                  Escolher foto
                </label>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 bg-muted/30 rounded-xl p-6 border border-border">
          <h2 className="text-xl font-bold">2. Instruções para a IA</h2>
          <p className="text-sm text-muted-foreground mb-2">
            O prompt abaixo está em inglês e é fixo — o admin não o pode alterar.
          </p>
          <div className="border rounded-lg p-3 font-mono text-xs text-muted-foreground overflow-x-auto bg-background/50 max-h-96 overflow-y-auto">
            {AI_PROMPT_TEXT.split("\n").map((line, i) => (
              <div key={i} className="whitespace-pre break-all">
                {line}
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-border">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Nota do admin (opcional)
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Esta nota é anexada ao prompt com um aviso de que é secundária. O
              prompt principal acima tem prioridade.
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Exemplo: Atenção, esta semana não há sopa na quinta-feira..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            ></textarea>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !imageFile}
            className="w-full py-2.5 rounded-md border border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-70 transition-colors font-medium"
          >
            {loading ? "A gerar com IA..." : "Gerar JSON com IA"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {/* Botão alternativo: upload direto de JSON */}
      <div className="border rounded-xl p-6 bg-secondary/30">
        <h3 className="text-sm font-semibold mb-3">Ou enviar ficheiro .json diretamente</h3>
        <input
          type="file"
          accept=".json"
          onChange={handleJsonUpload}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          O ficheiro deve seguir a estrutura da ementa (semana, dias, sopa,
          prato, vegetariano, sobremesa, pão).
        </p>
      </div>
    </div>
  )
}
