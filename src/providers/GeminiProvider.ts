import type { IAProvider } from './IAProvider';
import type { Role } from './IAProvider';

export class GeminiProvider implements IAProvider {
  async query(intencion: string, role: Role): Promise<string> {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: intencion, role }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = typeof err?.error === 'string' ? err.error : `Error proxy: ${res.status}`;
      throw new Error(message);
    }

    const data = await res.json();
    if (typeof data?.answer !== 'string' || data.answer.trim().length === 0) {
      throw new Error('Invalid proxy response');
    }

    return data.answer;
  }
}
