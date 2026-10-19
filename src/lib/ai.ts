import { GoogleGenerativeAI } from "@google/generative-ai"
import { AI_SYSTEM_PROMPT } from "@/lib/ai-prompt"

const API_KEY = process.env.GEMINI_API_KEY

let genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY não configurada")
    }
    genAI = new GoogleGenerativeAI(API_KEY)
  }
  return genAI
}

// PROMPT PRINCIPAL fica em src/lib/ai-prompt.ts (fonte única).
// O admin só pode adicionar um pequeno note de administrador que é anexado
// ao final, com aviso de que o prompt principal tem prioridade.

/**
 * Envia uma imagem (base64 ou buffer) + prompt fixo para o Gemini e devolve o JSON extraído.
 * O campo `adminNote` é opcional: se fornecido, é anexado ao prompt com aviso
 * de que é uma nota do admin e o prompt principal tem prioridade.
 */
export async function imageToMenu(
  imageBase64: string,
  mimeType: string,
  adminNote?: string | null
): Promise<{ json: unknown; rawText: string }> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-1.5-flash" })

  const noteSection = adminNote && adminNote.trim()
    ? `\n\nADMIN NOTE (secondary, lower priority than the main instructions above):\n${adminNote.trim()}\n`
    : ""

  const fullPrompt = AI_SYSTEM_PROMPT + noteSection

  const result = await model.generateContent([
    fullPrompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ])

  const rawText = result.response.text()
  let json: unknown

  try {
    json = JSON.parse(rawText)
  } catch {
    // Tenta extrair JSON de entre blocos de markdown, caso o modelo insista
    const match = rawText.match(/\{[\s\S]*\}/)
    if (!match) {
      throw new Error("A IA não devolveu JSON válido: " + rawText.slice(0, 200))
    }
    json = JSON.parse(match[0])
  }

  return { json, rawText }
}
