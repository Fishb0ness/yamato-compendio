# SGO Custodio MVP

SPA básica (React + Vite + TS) para consulta y navegación de doctrinas SGO integrando proveedor IA desacoplado (adapter para API HuggingFace, Transformers.js local y mock).

## Estructura Principal

- `/src/components/`: Menu, Input, Result, ErrorBoundary
- `/src/providers/`: IAProvider abstraction, HFProvider, TransformersLocalProvider, MockProvider
- `/public/data/doctrinas.json`: Datos doctrinas/acciones
- `/public/index.html`: Entry HTML

## Uso y Desarrollo

```bash
npm install
npm run dev
```

### Pruebas

```bash
npm run test
```

## Despliegue instantáneo

- Vercel: importar como proyecto Vite/React (raíz, build automático)
- Netlify: build command `npm run build`, publish dir `dist`

## Fallback/Errores

- Si el provider IA falla, se usa fallback alternativo; si todos fallan, se muestra aviso y se invita a navegar manualmente por doctrinas/acciones.

---
MVP orientado a extensibilidad: puedes agregar más providers IA fácilmente siguiendo el patrón Adapter.
