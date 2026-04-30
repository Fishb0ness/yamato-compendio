import { IAProvider } from './IAProvider';
import type { Role } from './IAProvider';

export class TransformersLocalProvider implements IAProvider {
  async query(prompt: string, _role: Role): Promise<string> {
    // Aquí iría llamada a Transformers.js local o simulada en el mock
    return Promise.resolve(`Local response to: ${prompt}`);
  }
}
