export type Role = 'custodio' | 'pretor';

export interface IAProvider {
  query(intencion: string, role: Role): Promise<string>;
}
