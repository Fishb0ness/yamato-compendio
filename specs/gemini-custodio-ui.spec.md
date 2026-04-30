# Specification: gemini-custodio-ui

## Purpose

Provide a minimal single-page SGO consultation UI that answers user questions using the SGO manual, constrained to the CUSTODIO role.

## Requirements

### Requirement: Home page shell (REQ-01, REQ-02, REQ-03)

The system MUST render a home page with the title "SGO - Compendio-AI", a free-form textarea, and a submit button before any consultation starts.

#### Scenario: User opens the app

- GIVEN the user opens the SPA
- WHEN the initial view renders
- THEN the page shows the title, textarea, and submit button
- AND no AI response is shown yet

### Requirement: Gemini consultation context (REQ-04, REQ-05)

When Gemini is active, the system MUST send the full user query to model `gemini-1.5-flash` and MUST constrain the answer to the CUSTODIO perspective using only the provided SGO manual context.

#### Scenario: User asks how to save a life

- GIVEN Gemini is configured and the manual context is available
- WHEN the user submits "quiero salvar una vida"
- THEN the consultation uses the full query with the SGO manual context
- AND the answer is limited to CUSTODIO-relevant doctrine or edicts

### Requirement: Result and request states (REQ-06, REQ-07, REQ-08)

The system MUST show a loading state while awaiting the provider response, MUST display the final response below the form, and MUST show an error message if the provider call fails.

#### Scenario: Successful consultation lifecycle

- GIVEN the user submits a valid query
- WHEN the provider request is in flight
- THEN the UI shows a loading indicator
- AND after success the answer appears below the form

#### Scenario: Provider request fails

- GIVEN the user submits a query
- WHEN the provider request fails
- THEN the UI shows a clear error state
- AND no stale success result is presented as new output

### Requirement: Fallback and provider abstraction (REQ-09, REQ-10)

If `VITE_GEMINI_API_KEY` is not set, the system MUST fall back to `MockProvider` and MUST present a clear notice that a mock response is being used. The consultation flow SHALL remain behind the `IAProvider` abstraction so provider replacement requires no UI change.

#### Scenario: API key is missing

- GIVEN `VITE_GEMINI_API_KEY` is absent
- WHEN the user submits a query
- THEN the app responds through `MockProvider`
- AND the UI shows a visible fallback notice with the mock result

#### Scenario: Provider implementation changes

- GIVEN the active provider changes behind `IAProvider`
- WHEN the user uses the consultation form
- THEN the visible UI flow remains the same
- AND no provider-specific controls are required

### Requirement: Client-only delivery (NFR-01, NFR-03)

The application MUST operate as a pure SPA with no backend dependency, and the Gemini API key MUST be read only from `VITE_GEMINI_API_KEY`.

#### Scenario: Runtime configuration

- GIVEN the app is deployed as a static site
- WHEN Gemini access is configured
- THEN the browser can call the provider directly
- AND no server-side credential source is required beyond the env var

### Requirement: Runtime manual loading (NFR-02)

The system MUST load `/data/sgo-manual.md` at runtime and SHOULD reuse a cached copy for later consultations.

#### Scenario: Multiple queries in one session

- GIVEN the user has already submitted one query
- WHEN the user submits another query in the same session
- THEN the manual remains available as context
- AND the app avoids unnecessary repeated manual loads

### Requirement: Minimal presentation (NFR-04)

The interface SHOULD remain minimal and clean, focusing on the title, form, status messages, and result area.

#### Scenario: Visual simplicity

- GIVEN the home page is displayed
- WHEN the user reviews the layout
- THEN only the essential consultation controls and feedback areas are emphasized
- AND decorative or unrelated navigation does not dominate the page
