import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../providers/GeminiProvider', () => ({
  GeminiProvider: vi.fn().mockImplementation((key: string) => ({ _key: key, query: vi.fn() })),
}));

vi.mock('../providers/MockProvider', () => ({
  MockProvider: vi.fn().mockImplementation(() => ({ query: vi.fn() })),
}));

describe('providerFactory', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('returns GeminiProvider when VITE_GEMINI_API_KEY is set', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key-123');
    const { getProvider } = await import('../providers/providerFactory');
    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = getProvider();
    expect(GeminiProvider).toHaveBeenCalledWith('test-key-123');
    expect(provider).toBeDefined();
  });

  it('returns MockProvider when VITE_GEMINI_API_KEY is not set', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const { getProvider } = await import('../providers/providerFactory');
    const { MockProvider } = await import('../providers/MockProvider');
    const provider = getProvider();
    expect(MockProvider).toHaveBeenCalled();
    expect(provider).toBeDefined();
  });
});
