import { NextResponse } from "next/server"
import {
  verifyAdminPassword,
  setSessionCookieHeader,
} from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password } = body as { password?: string }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Palavra-passe necessária" },
        { status: 400 }
      )
    }

    const ok = await verifyAdminPassword(password)
    if (!ok) {
      return NextResponse.json(
        { error: "Palavra-passe incorreta" },
        { status: 401 }
      )
    }

    return NextResponse.json({ ok: true }, {
      headers: {
        "Set-Cookie": setSessionCookieHeader(),
      },
    })
  } catch (err: any) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
