import type { IAProvider } from './IAProvider';
import { GeminiProvider } from './GeminiProvider';
import { MockProvider } from './MockProvider';

function isDevEnvironment(): boolean {
  const overriddenEnv = (globalThis as { importMetaEnv?: { DEV?: unknown } }).importMetaEnv;
  if (typeof overriddenEnv?.DEV === 'boolean') {
    return overriddenEnv.DEV;
  }

  return import.meta.env.DEV;
}

export function getProvider(): IAProvider {
  if (isDevEnvironment()) {
    return new MockProvider();
  }

  return new GeminiProvider();
}
