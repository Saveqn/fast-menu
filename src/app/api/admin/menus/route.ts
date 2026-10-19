import { NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth"
import { saveMenu, listMenus, deleteMenu } from "@/lib/storage"
import { validateMenu } from "@/lib/schema"

export async function GET() {
  const auth = requireAdminSession(new Headers())
  if (auth) return auth
  const menus = await listMenus()
  return NextResponse.json(menus)
}

export async function POST(req: Request) {
  const auth = requireAdminSession(req.headers)
  if (auth) return auth

  try {
    const body = await req.json()
    const menu = validateMenu(body)
    const weekStart = await saveMenu(menu, "manual")
    return NextResponse.json({ ok: true, weekStart })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Menu inválido" },
      { status: 400 }
    )
  }
}

export async function DELETE(req: Request) {
  const auth = requireAdminSession(req.headers)
  if (auth) return auth

  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get("weekStart")
  if (!weekStart) {
    return NextResponse.json({ error: "weekStart necessário" }, { status: 400 })
  }

  await deleteMenu(weekStart)
  return NextResponse.json({ ok: true })
}
