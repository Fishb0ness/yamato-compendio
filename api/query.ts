import { readFileSync } from 'node:fs';
import path from 'node:path';

type ServerRequest = {
  method?: string;
  body?: unknown;
};

type ServerResponse = {
  status: (statusCode: number) => ServerResponse;
  json: (body: unknown) => void;
};

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getQuestion(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const raw = (body as { question?: unknown }).question;
  if (typeof raw !== 'string') return null;

  const question = raw.trim();
  return question.length > 0 ? question : null;
}

function getManualContent(): string {
  const manualPath = path.resolve(process.cwd(), 'public/data/sgo-manual.md');
  return readFileSync(manualPath, 'utf-8');
}

function buildSystemPrompt(manual: string): string {
  return `Eres un asistente experto en las mecánicas del juego de rol SGO (Stream Game Over).
Tu función es ayudar a un jugador con el rol de CUSTODIO a entender qué opciones tiene disponibles según el reglamento oficial.

REGLAS IMPORTANTES:
- Solo puedes responder usando la información del manual SGO que se te proporciona.
- Siempre responde desde la perspectiva del rol CUSTODIO exclusivamente.
- Menciona las Doctrinas disponibles para Custodios cuando sean relevantes (Doctrina de la Sangre, Doctrina de la Voluntad, Doctrina del Camino, Doctrina de Hierro).
- Si la pregunta no está relacionada con SGO, indica amablemente que solo puedes ayudar con el reglamento SGO.
- Sé claro, conciso y útil. Menciona costes de cargas cuando sean relevantes.

MANUAL SGO:
${manual}`;
}

function extractAnswer(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Sin respuesta de la IA.';
  }

  const text = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    .candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'Sin respuesta de la IA.';
  }

  return text;
}

export default async function handler(req: ServerRequest, res: ServerResponse): Promise<void> {
  if (req.method && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const question = getQuestion(req.body);
  if (!question) {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const manual = getManualContent();
    const systemPrompt = buildSystemPrompt(manual);
    const upstreamResponse = await fetch(`${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: question }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!upstreamResponse.ok) {
      res.status(500).json({ error: 'Upstream service error' });
      return;
    }

    const upstreamData = await upstreamResponse.json();
    res.status(200).json({ answer: extractAnswer(upstreamData) });
  } catch {
    res.status(500).json({ error: 'Upstream service error' });
  }
}
