import { sign, verify, type Secret } from "jsonwebtoken"
import { NextResponse } from "next/server"

const SESSION_SECRET: Secret =
  (process.env.ADMIN_SESSION_SECRET as Secret) || "dev-secret-change-me"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

const COOKIE_NAME = "admin_session"
const TOKEN_TTL_SECONDS = 60 * 60 * 8 // 8 horas
const COOKIE_MAX_AGE = TOKEN_TTL_SECONDS

export interface AdminSession {
  admin: boolean
  iat: number
  exp: number
}

/**
 * Compara a palavra-passe enviada com o valor armazenado em base64.
 */
export function verifyAdminPassword(password: string): boolean {
  if (!ADMIN_PASSWORD_HASH) {
    return false
  }
  const encoded = Buffer.from(password).toString("base64")
  return encoded === ADMIN_PASSWORD_HASH
}

/**
 * Кодирует пароль в base64 для сохранения в переменную окружения.
 */
export function makePasswordHash(password: string): string {
  return Buffer.from(password).toString("base64")
}

export function signAdminSession(): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = {
    admin: true,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  }
  return sign(payload, SESSION_SECRET)
}

export function getTokenFromRequest(headers: Headers): string | null {
  const cookie = headers.get("cookie")
  if (!cookie) return null
  const match = cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  )
  return match ? match[1] : null
}

export function validateSession(token: string): AdminSession | null {
  try {
    return verify(token, SESSION_SECRET) as AdminSession
  } catch {
    return null
  }
}

export function requireAdminSession(
  reqHeaders: Headers
): NextResponse | null {
  const token = getTokenFromRequest(reqHeaders)
  if (!token || !validateSession(token)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }
  return null
}

export function setSessionCookieHeader(): string {
  const token = signAdminSession()
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}
