/**
 * Компрессия фото на клиенте перед отправкой в /api/admin/ai/import.
 *
 * Зачем: Vercel Functions имеют жёсткий лимит тела HTTP-запроса в 4.5 MB
 * (413 FUNCTION_PAYLOAD_TOO_LARGE). Фото с телефона часто 3–8 MB.
 *
 * Стратегия «поджать только до предела»:
 * - если файл уже укладывается в лимит — возвращаем его как есть;
 * - иначе перебираем размеры/качество от лёгкого к сильному и берём
 *   первый вариант, который укладывается в MAX_UPLOAD_BYTES.
 */

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024 // 4 MB (запас до 4.5 MB Vercel — на multipart-оверхед)

const QUALITY_STEPS = [0.92, 0.85, 0.8, 0.75, 0.7, 0.6, 0.5]
const MAX_SIDE_STEPS = [3000, 2400, 1920, 1600, 1280, 1024]

const BYTES_PER_MB = 1024 * 1024

export function formatBytes(bytes: number): string {
  const mb = bytes / BYTES_PER_MB
  return `${mb.toFixed(mb >= 10 ? 0 : 2)} MB`
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality)
  })
}

export async function compressImageToLimit(
  file: File
): Promise<{ blob: Blob; compressed: boolean; bytes: number }> {
  if (file.size <= MAX_UPLOAD_BYTES) {
    return { blob: file, compressed: false, bytes: file.size }
  }

  let bitmap: ImageBitmap
  try {
    // createImageBitmap учитывает EXIF-ориентацию (фото с телефона)
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error(
      "Formato de imagem não suportado. Envie uma foto em JPG ou PNG."
    )
  }

  try {
    const maxSide = Math.max(bitmap.width, bitmap.height)
    const sideSteps = [maxSide, ...MAX_SIDE_STEPS.filter((s) => s < maxSide)]

    for (const side of sideSteps) {
      const scale = side / maxSide
      const w = Math.max(1, Math.round(bitmap.width * scale))
      const h = Math.max(1, Math.round(bitmap.height * scale))

      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Não foi possível processar a imagem.")
      }
      ctx.drawImage(bitmap, 0, 0, w, h)

      for (const quality of QUALITY_STEPS) {
        const blob = await canvasToBlob(canvas, quality)
        if (blob && blob.size <= MAX_UPLOAD_BYTES) {
          return { blob, compressed: true, bytes: blob.size }
        }
      }
    }

    // самый сильный вариант из доступных — всё равно отдаём его
    const canvas = document.createElement("canvas")
    const w = 1024
    const h = Math.max(
      1,
      Math.round((bitmap.height / bitmap.width) * w)
    )
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Não foi possível processar a imagem.")
    }
    ctx.drawImage(bitmap, 0, 0, w, h)
    const last = await canvasToBlob(canvas, 0.5)
    if (last) {
      return { blob: last, compressed: true, bytes: last.size }
    }
    throw new Error("Não foi possível otimizar a imagem.")
  } finally {
    bitmap.close()
  }
}
