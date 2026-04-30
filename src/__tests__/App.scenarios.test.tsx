import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from '../App';

type ProviderKind = 'hf' | 'local' | 'mock';

type FakeProvider = {
  generateResponse: (prompt: string) => Promise<string>;
};

const fakeProviders: Record<ProviderKind, FakeProvider> = {
  hf: { generateResponse: async (prompt) => `HF response to: ${prompt}` },
  local: { generateResponse: async (prompt) => `Local response to: ${prompt}` },
  mock: { generateResponse: async () => 'Respuesta simulada por provider mock.' },
};

const createProviderMock = vi.fn((kind: ProviderKind) => fakeProviders[kind]);

vi.mock('../providers/providerFactory', () => ({
  createProvider: (kind: ProviderKind) => createProviderMock(kind),
  getFallbackProviderKinds: (kind: ProviderKind) => {
    if (kind === 'hf') return ['local', 'mock'];
    if (kind === 'local') return ['hf', 'mock'];
    return [];
  },
}));

const doctrinasFixture = [
  {
    id: 'doctrina-001',
    tema: 'Responsabilidad administrativa',
    texto: 'La responsabilidad administrativa recae sobre el funcionario custodiado.',
    acciones: ['Emitir informe preliminar', 'Recabar testimonios'],
  },
  {
    id: 'doctrina-002',
    tema: 'Procedimiento disciplinario',
    texto: 'El procedimiento disciplinario inicia con notificación formal.',
    acciones: ['Notificar al custodio', 'Ofrecer periodo de alegaciones'],
  },
];

describe('Spec scenarios', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    createProviderMock.mockClear();

    fakeProviders.hf.generateResponse = async (prompt: string) => `HF response to: ${prompt}`;
    fakeProviders.local.generateResponse = async (prompt: string) => `Local response to: ${prompt}`;
    fakeProviders.mock.generateResponse = async () => 'Respuesta simulada por provider mock.';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => doctrinasFixture,
      })
    );
  });

  it('Scenario 1: abre SPA, selecciona doctrina y muestra acciones', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Doctrina seleccionada')).toBeTruthy();
    });

    fireEvent.click(getByText('Procedimiento disciplinario'));

    expect(getByText('Notificar al custodio')).toBeTruthy();
    expect(getByText('Ofrecer periodo de alegaciones')).toBeTruthy();
  });

  it('Scenario 2: input "salvar vida" consulta IA y muestra recomendación explicada vía fallback mock', async () => {
    fakeProviders.hf.generateResponse = async () => {
      throw new Error('HF down');
    };

    fakeProviders.local.generateResponse = async () => {
      throw new Error('Local down');
    };

    fakeProviders.mock.generateResponse = async () =>
      'Recomendación: Hierro + Edicto Sangre. Explicación: protege vida y mantiene trazabilidad.';

    const { getByPlaceholderText, getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Doctrina seleccionada')).toBeTruthy();
    });

    fireEvent.change(getByPlaceholderText('Escribe tu pregunta...'), { target: { value: 'salvar vida' } });
    fireEvent.click(getByText('Consultar'));

    await waitFor(() => {
      expect(getByText(/Hierro \+ Edicto Sangre/i)).toBeTruthy();
    });

    expect(getByText(/Explicación/i)).toBeTruthy();
    expect(createProviderMock).toHaveBeenCalledWith('hf');
    expect(createProviderMock).toHaveBeenCalledWith('local');
    expect(createProviderMock).toHaveBeenCalledWith('mock');
  });

  it('Scenario 3: cambiar provider IA no cambia la UI ni el flujo del usuario', async () => {
    fakeProviders.local.generateResponse = async () => 'Recomendación estable del provider local.';

    const { getByLabelText, getByText, getByPlaceholderText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Doctrina seleccionada')).toBeTruthy();
    });

    expect(getByText('Doctrina seleccionada')).toBeTruthy();
    expect(getByText('Acciones posibles')).toBeTruthy();

    fireEvent.change(getByLabelText(/Proveedor IA/i), { target: { value: 'local' } });
    fireEvent.change(getByPlaceholderText('Escribe tu pregunta...'), { target: { value: 'consulta estable' } });
    fireEvent.click(getByText('Consultar'));

    await waitFor(() => {
      expect(getByText(/Recomendación estable del provider local/i)).toBeTruthy();
    });

    expect(getByText('Doctrina seleccionada')).toBeTruthy();
    expect(getByText('Acciones posibles')).toBeTruthy();
  });
});
