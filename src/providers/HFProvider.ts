import { IAProvider } from './IAProvider';
import type { Role } from './IAProvider';

export class HFProvider implements IAProvider {
  async query(prompt: string, _role: Role): Promise<string> {
    // Aquí iría la llamada real a HuggingFace (API externa)
    return Promise.resolve(`HF response to: ${prompt}`);
  }
}
