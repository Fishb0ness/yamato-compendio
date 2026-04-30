# Breakdown de tareas SDD: SGO Custodio Web App

Phase 1:
- [x] Estructura Vite + src/, public/data, package.json, env
- [x] Cargar src/data/doctrinas.json (doctrinas y acciones)

Phase 2:
- [x] Provider IA abstracto e interface
- [x] Adapter HuggingFace
- [x] Adapter Transformers.js (mock/fallback)
- [x] Fábrica y lógica fallback

Phase 3:
- [x] MenuDoctrinas (sidebar to actions)
- [x] InputIntencion (textbox)
- [x] ResultCard (recomendación)
- [x] ErrorBoundary
- [x] Wiring App/root

Phase 4:
- [x] Pruebas (unitarias input/providers, integration menu→result)

Phase 5:
- [x] README
- [x] Archivos deploy Netlify/Vercel, gitignore

Prioridad: completar Phase 1 y 2 antes de codificar UI.
Bloqueante: datos doctrinas, interface provider IA.
