import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';
import App from '../App';

const getProviderMock = vi.fn();

vi.mock('../providers/providerFactory', () => ({
  getProvider: () => getProviderMock(),
}));

vi.mock('../utils/manualLoader', () => ({
  loadManual: vi.fn().mockResolvedValue('MANUAL_TEST_CORTO'),
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe('Spec scenarios', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    getProviderMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it('Scenario 1: renders title, textarea and submit button', () => {
    getProviderMock.mockReturnValue({ query: vi.fn() });
    const { getByText, getByPlaceholderText, getByRole } = render(<App />);

    expect(getByText('SGO - Compendio-AI')).toBeTruthy();
    expect(getByPlaceholderText('¿Qué quieres hacer como Custodio?')).toBeTruthy();
    expect(getByRole('button', { name: 'Consultar' })).toBeTruthy();
    expect(getByText(/Modo simulación activo/i)).toBeTruthy();
  });

  it('Scenario 2: user submits query, sees loading, then result', async () => {
    const flow = deferred<string>();
    const query = vi.fn(() => flow.promise);
    getProviderMock.mockReturnValue({ query });

    const { getByPlaceholderText, getByRole, getByText } = render(<App />);

    fireEvent.change(getByPlaceholderText('¿Qué quieres hacer como Custodio?'), {
      target: { value: 'quiero salvar una vida' },
    });
    fireEvent.click(getByRole('button', { name: 'Consultar' }));

    expect(getByText('Consultando el manual SGO...')).toBeTruthy();
    expect(query).toHaveBeenCalledWith('quiero salvar una vida');

    flow.resolve('Respuesta Custodio de prueba');

    await waitFor(() => {
      expect(getByText('Respuesta Custodio de prueba')).toBeTruthy();
    });
  });

  it('Scenario 3: provider throws and app shows error message', async () => {
    const query = vi.fn(async () => {
      throw new Error('Fallo del proveedor');
    });
    getProviderMock.mockReturnValue({ query });

    const { getByPlaceholderText, getByRole, getByText, queryByText } = render(<App />);

    fireEvent.change(getByPlaceholderText('¿Qué quieres hacer como Custodio?'), {
      target: { value: 'pregunta con error' },
    });
    fireEvent.click(getByRole('button', { name: 'Consultar' }));

    await waitFor(() => {
      expect(getByText('Fallo del proveedor')).toBeTruthy();
    });

    expect(queryByText('Respuesta')).toBeNull();
  });
});
