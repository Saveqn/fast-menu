import { put, del, list } from "@vercel/blob"
import type { SchoolMenu, StoredMenu } from "@/types/menu"
import { validateMenu } from "@/lib/schema"

const MENUS_DIR = "menus"
const LOCAL_DATA_DIR = "./data"
const LOCAL_FILE = `${LOCAL_DATA_DIR}/menus.json`

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

interface BlobMenuItem {
  pathname: string
  url: string
  uploadedAt: string
}

/**
 * Lista todos os menus armazenados (mais recentes primeiro).
 */
export async function listMenus(): Promise<StoredMenu[]> {
  if (USE_BLOB) {
    return listBlobMenus()
  }
  return listLocalMenus()
}

/**
 * Lê um menu específico pelo identificador da semana (weekStart).
 */
export async function getMenuByWeek(weekStart: string): Promise<StoredMenu | null> {
  if (USE_BLOB) {
    return getBlobMenuByWeek(weekStart)
  }
  return getLocalMenuByWeek(weekStart)
}

/**
 * Guarda um menu. Retorna o identificador (weekStart).
 */
export async function saveMenu(menu: SchoolMenu, source: StoredMenu["source"] = "manual"): Promise<string> {
  const validated = validateMenu(menu)
  const stored: StoredMenu = {
    ...validated,
    updatedAt: new Date().toISOString(),
    source,
  }
  if (USE_BLOB) {
    return await saveBlobMenu(stored)
  }
  return saveLocalMenu(stored)
}

/**
 * Remove um menu pelo weekStart.
 */
export async function deleteMenu(weekStart: string): Promise<void> {
  if (USE_BLOB) {
    await deleteBlobMenu(weekStart)
  } else {
    await deleteLocalMenu(weekStart)
  }
}

/* ------------------------------------------------------------------ */
/* Implementação local (desenvolvimento / fallback)                   */
/* ------------------------------------------------------------------ */

import fs from "fs/promises"
import path from "path"

async function ensureLocalDir() {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true })
  } catch {
    // já existe
  }
}

async function readLocalMenusRaw(): Promise<StoredMenu[]> {
  await ensureLocalDir()
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf-8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalMenusRaw(menus: StoredMenu[]): Promise<void> {
  await ensureLocalDir()
  await fs.writeFile(LOCAL_FILE, JSON.stringify(menus, null, 2), "utf-8")
}

async function listLocalMenus(): Promise<StoredMenu[]> {
  const menus = await readLocalMenusRaw()
  return menus.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

async function getLocalMenuByWeek(weekStart: string): Promise<StoredMenu | null> {
  const menus = await readLocalMenusRaw()
  return menus.find((m) => m.weekStart === weekStart) || null
}

async function saveLocalMenu(stored: StoredMenu): Promise<string> {
  const menus = await readLocalMenusRaw()
  const idx = menus.findIndex((m) => m.weekStart === stored.weekStart)
  if (idx >= 0) {
    menus[idx] = stored
  } else {
    menus.push(stored)
  }
  await writeLocalMenusRaw(menus)
  return stored.weekStart
}

async function deleteLocalMenu(weekStart: string): Promise<void> {
  const menus = await readLocalMenusRaw()
  const filtered = menus.filter((m) => m.weekStart !== weekStart)
  await writeLocalMenusRaw(filtered)
}

/* ------------------------------------------------------------------ */
/* Implementação Vercel Blob (produção)                               */
/* ------------------------------------------------------------------ */

async function listBlobMenus(): Promise<StoredMenu[]> {
  const { blobs } = await list({ prefix: `${MENUS_DIR}/` })
  const menus: StoredMenu[] = []
  for (const b of blobs) {
    try {
      const res = await fetch(b.url)
      const menu = (await res.json()) as StoredMenu
      if (menu?.weekStart) menus.push(menu)
    } catch {
      // ignora ficheiros corrompidos
    }
  }
  // Только самая свежая копия каждой недели
  return dedupeByWeek(menus).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/**
 * Mantém apenas a cópia mais recente de cada semana (maior updatedAt).
 */
function dedupeByWeek(menus: StoredMenu[]): StoredMenu[] {
  const byWeek = new Map<string, StoredMenu>()
  for (const m of menus) {
    const existing = byWeek.get(m.weekStart)
    if (!existing || m.updatedAt > existing.updatedAt) {
      byWeek.set(m.weekStart, m)
    }
  }
  return Array.from(byWeek.values())
}

async function getBlobMenuByWeek(weekStart: string): Promise<StoredMenu | null> {
  // Точное имя файла может не существовать (старые копии с суффиксами) —
  // берём самую свежую копию этой недели из последовательного списка.
  const { blobs } = await list({ prefix: `${MENUS_DIR}/` })
  const weekRe = new RegExp(`^${MENUS_DIR}/${weekStart}(?:\\.\\d+)?\\.json$`)
  const matches = blobs
    .filter((b) => weekRe.test(b.pathname))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  if (matches.length === 0) {
    // fallback: ищем по содержимому (weekStart внутри JSON)
    for (const b of blobs) {
      try {
        const res = await fetch(b.url)
        const menu = (await res.json()) as StoredMenu
        if (menu?.weekStart === weekStart) return menu
      } catch {
        // ignora ficheiros corrompidos
      }
    }
    return null
  }
  try {
    const res = await fetch(matches[0].url)
    return (await res.json()) as StoredMenu
  } catch {
    return null
  }
}

async function saveBlobMenu(stored: StoredMenu): Promise<string> {
  const blob = await put(`${MENUS_DIR}/${stored.weekStart}.json`, JSON.stringify(stored, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false, // перезаписываем файл недели вместо создания копий
  })
  return stored.weekStart
}

async function deleteBlobMenu(weekStart: string): Promise<void> {
  // Удаляем ВСЕ варианты файлов этой недели (в т.ч. старые копии с суффиксами)
  const { blobs } = await list({ prefix: `${MENUS_DIR}/` })
  const weekRe = new RegExp(`^${MENUS_DIR}/${weekStart}(?:\\.\\d+)?\\.json$`)
  const targets = blobs.filter((b) => weekRe.test(b.pathname))
  await Promise.all(targets.map((b) => del(b.url, {})))
}
