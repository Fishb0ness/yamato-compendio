export interface IAProvider {
  query(intencion: string): Promise<string>;
}
