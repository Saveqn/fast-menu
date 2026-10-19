import { NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword, setAdminSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body as { password?: string }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Palavra-passe necessária" }, { status: 400 })
    }

    const ok = await verifyAdminPassword(password)
    if (!ok) {
      return NextResponse.json({ error: "Palavra-passe incorreta" }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    setAdminSession(res)
    return res
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
