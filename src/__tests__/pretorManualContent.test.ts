import path from 'node:path';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('sgo-manual-pretor content', () => {
  it('exists and contains only pretor-focused sections', () => {
    const manualPath = path.resolve(process.cwd(), 'public/data/sgo-manual-pretor.md');
    const content = readFileSync(manualPath, 'utf-8');

    expect(content).toContain('## CORE_DEFINITIONS');
    expect(content).toContain('## GLOBAL_STATE_RULES');
    expect(content).toContain('## ROLE_REGISTRY: PRETOR');
    expect(content).toContain('## INTERACTION_TABLE');
    expect(content).toContain('## EXTERNAL_INFLUENCES');

    expect(content).toContain('INTERACTION: Pretor A vs Pretor B (Parry de Edictos)');
    expect(content).toContain('INTERACTION: Pretor activa artefacto por Edicto del Avatar (Normal)');

    expect(content).not.toContain('## ROLE_REGISTRY: CUSTODIO');
    expect(content).not.toContain('DOCTRINA_DE_LA_SANGRE');
    expect(content).not.toContain('DOCTRINA_DE_LA_VOLUNTAD');
    expect(content).not.toContain('DOCTRINA_DEL_CAMINO');
    expect(content).not.toContain('DOCTRINA_DE_HIERRO');
  });
});
