import { describe, it, expect } from 'vitest';
import { HFProvider } from '../providers/HFProvider';
import { TransformersLocalProvider } from '../providers/TransformersLocalProvider';
import { MockProvider } from '../providers/MockProvider';

describe('IAProvider: contract', () => {
  it('HFProvider responde a prompt', async () => {
    const res = await new HFProvider().query('hola', 'custodio');
    expect(typeof res).toBe('string');
    expect(res).toContain('hola');
  });

  it('TransformersLocalProvider responde', async () => {
    const res = await new TransformersLocalProvider().query('prueba', 'pretor');
    expect(typeof res).toBe('string');
    expect(res).toContain('prueba');
  });

  it('MockProvider responde', async () => {
    const res = await new MockProvider().query('test', 'custodio');
    expect(typeof res).toBe('string');
    expect(res).toContain('mock');
  });

  it('MockProvider recomienda Hierro + Edicto Sangre para salvar vida', async () => {
    const res = await new MockProvider().query('Tema: X. Pregunta: salvar vida', 'custodio');
    expect(res).toContain('Hierro + Edicto Sangre');
    expect(res).toContain('Explicación');
  });
});
