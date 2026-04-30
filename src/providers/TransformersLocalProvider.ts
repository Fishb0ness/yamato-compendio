import { IAProvider } from './IAProvider';

export class TransformersLocalProvider implements IAProvider {
  async generateResponse(prompt: string): Promise<string> {
    // Aquí iría llamada a Transformers.js local o simulada en el mock
    return Promise.resolve(`Local response to: ${prompt}`);
  }
}
