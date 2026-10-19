import { GoogleGenerativeAI } from "@google/generative-ai"

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

// PROMPT PRINCIPAL — em inglês, fixo, não editável pelo admin.
// O admin só pode adicionar um pequeno note de administrador que é anexado
// ao final, com aviso de que o prompt principal tem prioridade.
export const AI_SYSTEM_PROMPT_EN = `
You are an assistant that extracts school canteen menus from photos.
Return ONLY valid JSON, no markdown, no extra text before or after.

Required JSON structure:
{
  "weekStart": "YYYY-MM-DD",
  "weekEnd": "YYYY-MM-DD",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "weekday": "monday | tuesday | wednesday | thursday | friday",
      "sopa": "string or null",
      "prato": "string or null",
      "vegetariano": "string or null",
      "sobremesa": "string or null",
      "pao": true | false,
      "closed": true | false,
      "reason": "holiday | vacation | null"
    }
  ]
}

Rules:
- Include only weekdays (Monday to Friday).
- If a day is closed (holiday / vacation): closed: true, food fields may be null.
- pao: true if bread is mentioned, false if not mentioned.
- If unsure about a field, use null.
- Do not include markdown code fences. Do not explain. Return ONLY raw JSON.
`

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

  const fullPrompt = AI_SYSTEM_PROMPT_EN + noteSection

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
