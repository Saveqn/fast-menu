import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth"
import { imageToMenu } from "@/lib/ai"
import { validateMenu } from "@/lib/schema"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const auth = requireAdminSession(req)
  if (auth) return auth

  try {
    const formData = await req.formData()
    const file = formData.get("image") as File | null
    const adminNote = (formData.get("adminNote") as string) || undefined

    if (!file) {
      return NextResponse.json({ error: "Imagem necessária" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    const { json, rawText } = await imageToMenu(base64, file.type, adminNote)

    // Valida a estrutura antes de devolver ao frontend
    const menu = validateMenu(json)

    return NextResponse.json({
      ok: true,
      menu,
      rawText,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao processar imagem com a IA" },
      { status: 400 }
    )
  }
}
