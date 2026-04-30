import { describe, it, expect } from 'vitest';
import { HFProvider } from '../providers/HFProvider';
import { TransformersLocalProvider } from '../providers/TransformersLocalProvider';
import { MockProvider } from '../providers/MockProvider';

describe('IAProvider: contract', () => {
  it('HFProvider responde a prompt', async () => {
    const res = await new HFProvider().query('hola');
    expect(typeof res).toBe('string');
    expect(res).toContain('hola');
  });

  it('TransformersLocalProvider responde', async () => {
    const res = await new TransformersLocalProvider().query('prueba');
    expect(typeof res).toBe('string');
    expect(res).toContain('prueba');
  });

  it('MockProvider responde', async () => {
    const res = await new MockProvider().query('test');
    expect(typeof res).toBe('string');
    expect(res).toContain('mock');
  });

  it('MockProvider recomienda Hierro + Edicto Sangre para salvar vida', async () => {
    const res = await new MockProvider().query('Tema: X. Pregunta: salvar vida');
    expect(res).toContain('Hierro + Edicto Sangre');
    expect(res).toContain('Explicación');
  });
});
