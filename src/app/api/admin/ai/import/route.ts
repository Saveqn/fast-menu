import { NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth"
import { imageToMenu } from "@/lib/ai"
import { validateMenu } from "@/lib/schema"
import { MAX_UPLOAD_BYTES } from "@/lib/image"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const auth = await requireAdminSession(req.headers)
  if (auth) return auth

  try {
    const formData = await req.formData()
    const file = formData.get("image") as File | null
    const adminNote = (formData.get("adminNote") as string) || undefined

    if (!file) {
      return NextResponse.json({ error: "Imagem necessária" }, { status: 400 })
    }

    // Защита от запросов мимо клиента: Vercel Functions ограничивают
    // body запроса в 4.5 MB (413). Клиент сжимает фото, но endpoint
    // тоже валидирует размер напрямую.
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          error:
            "A imagem é demasiado grande (máx. 4.5 MB). Reduza a resolução da foto e tente novamente.",
        },
        { status: 413 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    const { json, rawText } = await imageToMenu(base64, file.type, adminNote)

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
