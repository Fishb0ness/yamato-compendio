import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('GeminiProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns answer from /api/query response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        answer: 'Respuesta Custodio',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = new GeminiProvider();

    const result = await provider.query('quiero salvar una vida');

    expect(result).toBe('Respuesta Custodio');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/query',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const [, options] = fetchMock.mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(options.body);
    expect(body).toEqual({ question: 'quiero salvar una vida' });
  });

  it('throws sanitized proxy error on non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Upstream service error' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = new GeminiProvider();

    await expect(provider.query('hola')).rejects.toThrow('Upstream service error');
  });

  it('throws when response does not include answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = new GeminiProvider();

    await expect(provider.query('hola')).rejects.toThrow('Invalid proxy response');
  });
});
