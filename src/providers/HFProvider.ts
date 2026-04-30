import { IAProvider } from './IAProvider';

export class HFProvider implements IAProvider {
  async generateResponse(prompt: string): Promise<string> {
    // Aquí iría la llamada real a HuggingFace (API externa)
    return Promise.resolve(`HF response to: ${prompt}`);
  }
}
