import type { IAProvider } from './IAProvider';
import { loadManual } from '../utils/manualLoader';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiProvider implements IAProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async query(intencion: string): Promise<string> {
    const manual = await loadManual();

    const systemPrompt = `Eres un asistente experto en las mecánicas del juego de rol SGO (Stream Game Over).
Tu función es ayudar a un jugador con el rol de CUSTODIO a entender qué opciones tiene disponibles según el reglamento oficial.

REGLAS IMPORTANTES:
- Solo puedes responder usando la información del manual SGO que se te proporciona.
- Siempre responde desde la perspectiva del rol CUSTODIO exclusivamente.
- Menciona las Doctrinas disponibles para Custodios cuando sean relevantes (Doctrina de la Sangre, Doctrina de la Voluntad, Doctrina del Camino, Doctrina de Hierro).
- Si la pregunta no está relacionada con SGO, indica amablemente que solo puedes ayudar con el reglamento SGO.
- Sé claro, conciso y útil. Menciona costes de cargas cuando sean relevantes.

MANUAL SGO:
${manual}`;

    const body = {
      contents: [{ role: 'user', parts: [{ text: intencion }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error Gemini: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta de la IA.';
  }
}
