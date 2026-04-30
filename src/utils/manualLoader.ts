let cached: string | null = null;

export async function loadManual(): Promise<string> {
  if (cached) return cached;

  const res = await fetch('/data/sgo-manual.md');
  if (!res.ok) {
    throw new Error('No se pudo cargar el manual SGO');
  }

  cached = await res.text();
  return cached;
}
