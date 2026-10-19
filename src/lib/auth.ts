import { SignJWT, jwtVerify } from "jose"
import { NextResponse } from "next/server"

/**
 * jose работает и в Node runtime, и в Edge runtime (middleware).
 * jsonwebtoken в middleware не работает (не поддерживает Edge), поэтому используем jose везде.
 */
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me"
const SESSION_KEY = new TextEncoder().encode(SESSION_SECRET)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

const COOKIE_NAME = "admin_session"
const TOKEN_TTL_SECONDS = 60 * 60 * 8 // 8 часов
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

export async function signAdminSession(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(SESSION_KEY)
}

export function getTokenFromRequest(headers: Headers): string | null {
  const cookie = headers.get("cookie")
  if (!cookie) return null
  const match = cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  )
  return match ? match[1] : null
}

export async function validateSession(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_KEY)
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

export async function requireAdminSession(
  reqHeaders: Headers
): Promise<NextResponse | null> {
  const token = getTokenFromRequest(reqHeaders)
  if (!token || !(await validateSession(token))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }
  return null
}

export async function setSessionCookieHeader(): Promise<string> {
  const token = await signAdminSession()
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}
