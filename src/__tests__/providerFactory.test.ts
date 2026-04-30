import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../providers/GeminiProvider', () => ({
  GeminiProvider: vi.fn().mockImplementation(() => ({ query: vi.fn() })),
}));

vi.mock('../providers/MockProvider', () => ({
  MockProvider: vi.fn().mockImplementation(() => ({ query: vi.fn() })),
}));

describe('providerFactory', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('returns MockProvider when import.meta.env.DEV is true', async () => {
    vi.stubGlobal('importMetaEnv', { DEV: true });
    const { getProvider } = await import('../providers/providerFactory');
    const { MockProvider } = await import('../providers/MockProvider');
    const provider = getProvider();
    expect(MockProvider).toHaveBeenCalled();
    expect(provider).toBeDefined();
  });

  it('returns GeminiProvider when import.meta.env.DEV is false', async () => {
    vi.stubGlobal('importMetaEnv', { DEV: false });
    const { getProvider } = await import('../providers/providerFactory');
    const { GeminiProvider } = await import('../providers/GeminiProvider');
    const provider = getProvider();
    expect(GeminiProvider).toHaveBeenCalled();
    expect(provider).toBeDefined();
  });
});
