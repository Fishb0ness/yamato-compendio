import type { IAProvider } from './IAProvider';
import { HFProvider } from './HFProvider';
import { TransformersLocalProvider } from './TransformersLocalProvider';
import { MockProvider } from './MockProvider';

export type ProviderKind = 'hf' | 'local' | 'mock';

export function createProvider(kind: ProviderKind): IAProvider {
  switch (kind) {
    case 'hf':
      return new HFProvider();
    case 'local':
      return new TransformersLocalProvider();
    case 'mock':
    default:
      return new MockProvider();
  }
}

export function getFallbackProviderKinds(kind: ProviderKind): ProviderKind[] {
  if (kind === 'hf') return ['local', 'mock'];
  if (kind === 'local') return ['hf', 'mock'];
  return [];
}
