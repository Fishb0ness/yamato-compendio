export interface IAProvider {
  generateResponse(prompt: string): Promise<string>;
}
