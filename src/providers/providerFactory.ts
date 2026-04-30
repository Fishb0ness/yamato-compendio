import type { IAProvider } from './IAProvider';
import { GeminiProvider } from './GeminiProvider';
import { MockProvider } from './MockProvider';

export function getProvider(): IAProvider {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (geminiKey) {
    return new GeminiProvider(geminiKey);
  }

  return new MockProvider();
}
