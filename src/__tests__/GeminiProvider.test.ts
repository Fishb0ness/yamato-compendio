import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/manualLoader', () => ({
  loadManual: vi.fn().mockResolvedValue('MANUAL_CORTO'),
}));

describe('GeminiProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns text from Gemini response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Respuesta Custodio' }] } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = new GeminiProvider('test-key');

    const result = await provider.query('quiero salvar una vida');

    expect(result).toBe('Respuesta Custodio');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=test-key',
      expect.objectContaining({ method: 'POST' })
    );

    const [, options] = fetchMock.mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(options.body);
    expect(body.contents[0].parts[0].text).toBe('quiero salvar una vida');
    expect(body.systemInstruction.parts[0].text).toContain('MANUAL_CORTO');
    expect(body.systemInstruction.parts[0].text).toContain('CUSTODIO');
  });

  it('throws on non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'API key inválida' } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = new GeminiProvider('bad-key');

    await expect(provider.query('hola')).rejects.toThrow('API key inválida');
  });
});
