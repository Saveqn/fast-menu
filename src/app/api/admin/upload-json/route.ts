import { NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth"
import { validateMenu } from "@/lib/schema"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const auth = requireAdminSession(req.headers)
  if (auth) return auth

  try {
    const formData = await req.formData()
    const file = formData.get("json") as File | null

    if (!file) {
      return NextResponse.json({ error: "Ficheiro JSON necessário" }, { status: 400 })
    }

    const text = await file.text()
    const data = JSON.parse(text)

    const menu = validateMenu(data)

    return NextResponse.json({ ok: true, menu })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Ficheiro JSON inválido" },
      { status: 400 }
    )
  }
}
