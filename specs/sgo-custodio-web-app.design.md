# Diseño Técnico SDD: SGO Custodio Web App

## Decisiones principales
- SPA React + Vite + TypeScript
- Provider IA abstracto (IAProvider)
- Adaptadores para HuggingFace, Transformers.js local/mock
- Datos doctrinas en JSON (public/data/doctrinas.json)
- Manejo de errores y fallback automáticos
- Estructura modular de componentes/archivos

## Componentes clave
- MenuDoctrinas (sidebar)
- InputIntencion (textbox)
- ResultCard (recomendación y explicación)
- ErrorBoundary
- Provider(s): IAProvider, HuggingFace, TransformersLocal

## Diagrama rápido
App
├── Menu
├── Input
├── Result
└── ErrorBoundary
Proveedor/adapter IA desacoplado via /src/providers

## Estrategia migración Provider IA
- Interface TypeScript
- Fábrica/configurable por entorno
- Adapters intercambiables
- Tests con mocks para cada backend

## Estructura sugerida
src/components, src/providers, src/data
public/data/doctrinas.json
Readme y archivos build/deploy