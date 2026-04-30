import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('manualLoader', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and returns manual content', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '# Manual SGO',
    });
    vi.stubGlobal('fetch', fetchMock);

    const { loadManual } = await import('../utils/manualLoader');
    const result = await loadManual();

    expect(result).toBe('# Manual SGO');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/data/sgo-manual.md');
  });

  it('caches content and avoids second fetch call', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'manual-cache',
    });
    vi.stubGlobal('fetch', fetchMock);

    const { loadManual } = await import('../utils/manualLoader');

    const first = await loadManual();
    const second = await loadManual();

    expect(first).toBe('manual-cache');
    expect(second).toBe('manual-cache');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
