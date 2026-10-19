import { compare, hash } from "bcryptjs"
import { sign, verify, type Secret, SignOptions, VerifyOptions } from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const SESSION_SECRET = (process.env.ADMIN_SESSION_SECRET as Secret) || "dev-secret-change-me"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

const COOKIE_NAME = "admin_session"
const TOKEN_TTL_SECONDS = 60 * 60 * 8 // 8 horas

export interface AdminSession {
  admin: boolean
  iat: number
  exp: number
}

/**
 * Compara a palavra-passe enviada com o hash armazenado na variável de ambiente.
 * Retorna true se corresponder.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) {
    return false
  }
  try {
    return await compare(password, ADMIN_PASSWORD_HASH)
  } catch {
    return false
  }
}

/**
 * Gera um hash bcrypt para uma palavra-passe em texto simples.
 * Útil para criar o valor inicial de ADMIN_PASSWORD_HASH.
 */
export async function makePasswordHash(password: string): Promise<string> {
  return await hash(password, 10)
}

/**
 * Assina um JWT de sessão do admin.
 */
export function signAdminSession(): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = {
    admin: true,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  }
  return sign(payload, SESSION_SECRET, { expiresIn: TOKEN_TTL_SECONDS } as SignOptions)
}

/**
 * Lê o cookie de sessão e valida o JWT.
 */
export function getAdminSession(): AdminSession | null {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    const decoded = verify(token, SESSION_SECRET, {
      complete: false,
    } as VerifyOptions) as AdminSession
    return decoded
  } catch {
    return null
  }
}

/**
 * Middleware de API: exige sessão de admin válida.
 * Retorna NextResponse com 401 se não houver sessão, ou null se estiver tudo bem.
 */
export function requireAdminSession(req: NextRequest): NextResponse | null {
  const session = getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }
  return null
}

/**
 * Remove o cookie de sessão (logout).
 */
export function clearAdminSession(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return response
}

/**
 * Define o cookie de sessão (login).
 */
export function setAdminSession(response: NextResponse): NextResponse {
  const token = signAdminSession()
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return response
}
