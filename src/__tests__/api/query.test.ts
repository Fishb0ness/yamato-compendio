import { beforeEach, describe, expect, it, vi } from 'vitest';

const readFileSyncMock = vi.fn(() => 'MANUAL_SGO_TEST');

vi.mock('node:fs', () => ({
  readFileSync: readFileSyncMock,
  default: {
    readFileSync: readFileSyncMock,
  },
}));

type MockRequest = {
  method?: string;
  body?: unknown;
};

type MockResponse = {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  statusCode?: number;
  payload?: unknown;
};

function createResponse(): MockResponse {
  const response: MockResponse = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockImplementation((code: number) => {
    response.statusCode = code;
    return response;
  });

  response.json.mockImplementation((payload: unknown) => {
    response.payload = payload;
    return response;
  });

  return response;
}

describe('api/query', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('returns 200 with answer when upstream succeeds', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Respuesta del proxy' }] } }],
        }),
      })
    );

    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = {
      method: 'POST',
      body: { question: '¿Cómo salvo una vida?', role: 'custodio' },
    };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ answer: 'Respuesta del proxy' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(readFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining('public/data/sgo-manual.md'),
      'utf-8'
    );

    const [, upstreamOptions] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: string }
    ];
    const payload = JSON.parse(upstreamOptions.body);
    const systemPromptText = payload.systemInstruction.parts[0].text as string;
    expect(systemPromptText).toContain('perspectiva del rol CUSTODIO exclusivamente');
    expect(systemPromptText).toContain('Doctrina de la Sangre');
  });

  it('returns 400 when question is blank', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = { method: 'POST', body: { question: '   ', role: 'custodio' } };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'question is required' });
  });

  it('returns 400 when question is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = { method: 'POST', body: { role: 'custodio' } };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'question is required' });
  });

  it('returns 500 when GEMINI_API_KEY is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = {
      method: 'POST',
      body: { question: 'consulta válida', role: 'custodio' },
    };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server configuration error' });
    expect(JSON.stringify(res.payload)).not.toContain('GEMINI_API_KEY');
  });

  it('returns sanitized 500 when upstream fails', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          error: {
            message:
              'upstream raw payload with key=server-key-test and prompt=MANUAL_SGO_TEST',
          },
        }),
      })
    );

    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = {
      method: 'POST',
      body: { question: 'consulta válida', role: 'custodio' },
    };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Upstream service error' });

    const serialized = JSON.stringify(res.payload);
    expect(serialized).not.toContain('server-key-test');
    expect(serialized).not.toContain('MANUAL_SGO_TEST');
    expect(serialized).not.toContain('prompt');
  });

  it('returns 400 when role is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    vi.stubGlobal('fetch', vi.fn());

    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = { method: 'POST', body: { question: 'consulta válida' } };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'role is required' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns 400 when role is invalid', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    vi.stubGlobal('fetch', vi.fn());

    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = {
      method: 'POST',
      body: { question: 'consulta válida', role: 'arconte' },
    };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'role is required' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses pretor manual and pretor system prompt when role is pretor', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'server-key-test');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Respuesta Pretor' }] } }],
        }),
      })
    );

    const { default: handler } = await import('../../../api/query');
    const req: MockRequest = {
      method: 'POST',
      body: { question: '¿Qué edicto aplico?', role: 'pretor' },
    };
    const res = createResponse();

    await handler(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(readFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining('public/data/sgo-manual-pretor.md'),
      'utf-8'
    );

    const [, upstreamOptions] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: string }
    ];
    const payload = JSON.parse(upstreamOptions.body);
    const systemPromptText = payload.systemInstruction.parts[0].text as string;
    expect(systemPromptText).toContain('perspectiva del rol PRETOR exclusivamente');
    expect(systemPromptText).toContain('Edictos disponibles para Pretor');
    expect(systemPromptText).not.toContain('Doctrina de la Sangre');
  });
});
