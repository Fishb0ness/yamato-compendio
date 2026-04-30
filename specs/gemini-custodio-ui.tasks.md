# Tasks: gemini-custodio-ui

## Phase 1: Foundation

- [x] 1.1 Create `src/utils/manualLoader.ts` as a module-scope singleton that fetches `/data/sgo-manual.md` once and returns cached text.
- [x] 1.2 Add `src/providers/GeminiProvider.ts` implementing `IAProvider` and defining the Gemini REST endpoint, request shape, and response parsing contract.

## Phase 2: Core Implementation

- [x] 2.1 Build the system prompt in `GeminiProvider.ts` by combining loaded manual text with the CUSTODIO-only instruction block.
- [x] 2.2 Implement `generateResponse(prompt)` to call Gemini `gemini-1.5-flash:generateContent` with `VITE_GEMINI_API_KEY` and surface API errors clearly.
- [x] 2.3 Update `src/providers/providerFactory.ts` to return `GeminiProvider` when the env var is present, otherwise fall back to `MockProvider`.
- [x] 2.4 Rewrite `src/App.tsx` into the single-page consultation flow with title, textarea, submit button, loading, error, result, and mock-fallback notice states.
- [x] 2.5 Replace `src/App.css` with minimal styles for the new layout and state messaging.

## Phase 3: Testing

- [x] 3.1 Add unit tests for `manualLoader.ts` to verify one fetch only and cached reuse across calls.
- [x] 3.2 Add unit tests for `GeminiProvider.ts` with mocked `fetch` to verify endpoint, payload, manual injection, and CUSTODIO prompt constraint.
- [x] 3.3 Add integration tests for the spec scenarios: initial render, submit/loading/result, error state, and missing-key mock fallback notice.

## Phase 4: Verification

- [x] 4.1 Run the project build/typecheck verification path and confirm the rewritten SPA compiles with the new provider and test changes.
