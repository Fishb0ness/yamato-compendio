# Design: gemini-custodio-ui

## Technical Approach

Rewrite `App.tsx` as a single-page consultation flow. On submit, the UI asks `providerFactory.ts` for an `IAProvider`. If `VITE_GEMINI_API_KEY` exists, `GeminiProvider.ts` loads the manual through `manualLoader.ts`, builds the CUSTODIO-only system prompt, and calls Gemini REST. If the key is missing, the factory returns `MockProvider`; the UI shows a clear fallback notice while keeping the same form and result flow.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Provider boundary | Keep `IAProvider` unchanged and add `GeminiProvider` | Put Gemini logic directly in `App.tsx` | Preserves swappability and satisfies REQ-10 without UI coupling. |
| Provider selection | `providerFactory.ts` returns `GeminiProvider` when `import.meta.env.VITE_GEMINI_API_KEY` is truthy, else `MockProvider` | Manual provider selector in UI | Matches the minimal UI goal and keeps environment-based behavior centralized. |
| Manual context | `manualLoader.ts` fetches `/data/sgo-manual.md` once and caches it in module scope | Bundle the manual at build time; refetch every submit | Runtime fetch satisfies NFR-02 and caching avoids redundant network work. |
| Integration style | Direct browser call to Gemini REST API | Add backend proxy | The change explicitly requires a pure SPA with no backend. |
| Layout simplification | Rewrite `App.tsx` and stop using `Menu.tsx` | Adapt the current multi-panel layout | The current layout exposes unrelated navigation and provider controls that conflict with the new single-purpose flow. |

## Data Flow

```text
User submit
  -> App.tsx validates textarea and sets loading
  -> providerFactory.ts selects provider
      -> GeminiProvider.ts
          -> manualLoader.ts fetch/cache /data/sgo-manual.md
          -> build system prompt with manual + CUSTODIO restriction
          -> POST to Gemini generateContent endpoint
      -> or MockProvider.ts when key missing
  -> App.tsx clears loading and renders result or error
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/providers/GeminiProvider.ts` | Create | Implements `IAProvider` and calls `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={VITE_GEMINI_API_KEY}`. |
| `src/utils/manualLoader.ts` | Create | Singleton loader that fetches `/data/sgo-manual.md` once and caches the text. |
| `src/providers/providerFactory.ts` | Modify | Add Gemini branch and default-to-mock behavior when the env key is missing. |
| `src/App.tsx` | Modify | Full rewrite to the one-page layout; remove `Menu.tsx` usage. |
| `src/App.css` | Create or modify | Minimal styles for layout, textarea, button, loading, error, and result. |
| `src/components/Menu.tsx` | Keep unused | Remains in the repository but is no longer imported by `App.tsx`. |

## Interfaces / Contracts

Existing contract stays unchanged:

```ts
export interface IAProvider {
  generateResponse(prompt: string): Promise<string>;
}
```

Gemini request contract:

```json
{
  "contents": [{ "role": "user", "parts": [{ "text": "<query>" }] }],
  "systemInstruction": {
    "parts": [{
      "text": "<full manual>\n\nEres un asistente experto en el reglamento SGO. Solo puedes responder desde la perspectiva del rol CUSTODIO. Usa únicamente la información del manual proporcionado."
    }]
  }
}
```

App layout target:

```tsx
<main>
  <h1>SGO - Compendio-AI</h1>
  <form onSubmit={handleSubmit}>
    <textarea placeholder="¿Qué quieres hacer?" />
    <button type="submit">Consultar</button>
  </form>
  {loading && <p>Consultando...</p>}
  {error && <p className="error">{error}</p>}
  {result && <div className="result">{result}</div>}
</main>
```

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Unit | `manualLoader` caching, `providerFactory` selection, `GeminiProvider` request mapping | Mock `fetch` and assert endpoint, payload, and single manual load. |
| Integration | Initial render, submit/loading/result, error state, missing-key fallback notice | React Testing Library with mocked providers and DOM assertions. |
| E2E/manual | Static deployment with and without `VITE_GEMINI_API_KEY` | Smoke-test both Gemini and mock paths in browser. |

## Migration / Rollout

No migration required. Deploy the SPA normally; set `VITE_GEMINI_API_KEY` to enable Gemini. If unset, the app intentionally stays functional through `MockProvider`.

## Open Questions

- None.
