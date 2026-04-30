import { IAProvider } from './IAProvider';

export class MockProvider implements IAProvider {
  async query(intencion: string): Promise<string> {
    const normalized = intencion.toLowerCase();

    if (normalized.includes('salvar vida')) {
      return Promise.resolve(
        'Recomendación: aplicar Hierro + Edicto Sangre. Explicación: ante una intención orientada a preservar la vida, esta combinación prioriza contención inmediata y habilita trazabilidad disciplinaria para proteger al custodio y terceros.'
      );
    }

    return Promise.resolve(
      'Respuesta simulada por provider mock: revisa las acciones de la doctrina seleccionada y aplica la medida con mejor proporcionalidad.'
    );
  }
}
