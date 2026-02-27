import { GoogleGenAI, Type } from "@google/genai";
import { createRateLimiter } from "@/common/utils/rate-limiter";

// Vite replaces `process.env.GEMINI_API_KEY` at build time via the
// `define` block in vite.config.ts. Use the exact token — no optional
// chaining, no typeof guard — otherwise the replacement won't match.
const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "";

const DEFAULT_MODEL = "gemini-2.5-flash";
const GEMINI_MODEL: string = process.env.GEMINI_MODEL || DEFAULT_MODEL;

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "[FinTrack] GEMINI_API_KEY não configurada. " +
        "Adicione-a ao .env (sem prefixo VITE_ para não expor no client)."
      );
    }
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
};

const model = () => GEMINI_MODEL;

const ocrLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });

/** Resultado da extração de uma única transação (cupom resumido). */
export type ParseReceiptResult = {
  amount: number | null;
  description: string | null;
  date: string | null;
  category: string | null;
};

/** Item de linha extraído de cupom/nota (para preencher itens da transação). */
export type ReceiptLineItem = {
  description: string;
  quantity: number;
  amount: number;
};

export const ocrService = {
  async parseReceipt(base64Image: string, mimeType: string): Promise<ParseReceiptResult | null> {
    if (!ocrLimiter.allow()) {
      console.warn("[FinTrack] Rate limit de OCR atingido. Aguarde um momento.");
      return null;
    }
    const response = await getAI().models.generateContent({
      model: model(),
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract data from this receipt. Return JSON with: amount (number), description (string), date (ISO string YYYY-MM-DD), category (suggested string). If you can't find a field, return null.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["amount", "description", "date"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return null;
    }
  },

  /**
   * Extrai itens de linha (produtos/serviços) de cupom, nota fiscal ou documento.
   * Retorna array com description, quantity e amount (valor total do item) por linha.
   */
  async parseReceiptItems(base64Image: string, mimeType: string): Promise<ReceiptLineItem[] | null> {
    if (!ocrLimiter.allow()) {
      console.warn("[FinTrack] Rate limit de OCR atingido. Aguarde um momento.");
      return null;
    }
    const response = await getAI().models.generateContent({
      model: model(),
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: `Extract all line items from this receipt, invoice or document.
For each product or service line, return: description (product/service name), quantity (number, default 1), amount (total price in BRL for that line, as number).
Return a JSON object with a single key "items" containing an array of these objects.
Use Brazilian Portuguese for descriptions. Amounts must be numbers (e.g. 12.99), not strings.
If the document has no itemized list, return items: [].`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  amount: { type: Type.NUMBER },
                },
                required: ["description", "quantity", "amount"],
              },
            },
          },
          required: ["items"],
        },
      },
    });

    try {
      const parsed = JSON.parse(response.text || "{}");
      const items = parsed?.items;
      if (!Array.isArray(items)) return null;
      return items
        .filter(
          (row: unknown) =>
            row &&
            typeof row === "object" &&
            "description" in row &&
            "quantity" in row &&
            "amount" in row
        )
        .map((row: { description: string; quantity: number; amount: number }) => ({
          description: String(row.description).trim(),
          quantity: Math.max(1, Number(row.quantity) || 1),
          amount: Number(row.amount) || 0,
        }))
        .filter((row) => row.description && row.amount > 0);
    } catch (e) {
      console.error("Failed to parse Gemini response (items)", e);
      return null;
    }
  },
};
