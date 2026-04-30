# SGO Compendio-AI

Asistente de IA para consultar el reglamento de **SGO (Stream Game Over)**. Selecciona tu rol — Custodio o Pretor — y escribe libremente lo que quieres hacer. La IA responde basándose en el manual oficial del juego, adaptando su perspectiva al rol seleccionado.

🌐 **Demo en vivo**: [compendio-ai.vercel.app](https://compendio-ai.vercel.app)

---

## ¿Qué es SGO?

SGO es un juego de rol en stream donde los espectadores participan activamente como **Custodios** o **Pretores**, cada uno con mecánicas, recursos y objetivos distintos.

- **Custodio** — ejecuta Doctrinas con cargas mensuales para influir en el juego
- **Pretor** — gestiona Caps mensuales para activar Edictos y contrarrestar acciones

---

## Arquitectura

```
Browser                  Vercel
┌─────────────┐          ┌──────────────────────┐
│  React SPA  │  POST    │  api/query.ts        │
│  (Vite)     │ ──────── │  Serverless Function │ ──→ Google Gemini API
│             │ {question│                      │
│             │  role}   │  Lee GEMINI_API_KEY  │
└─────────────┘          │  y manual del rol    │
                         └──────────────────────┘
```

**Puntos clave:**
- La API key de Gemini **nunca llega al cliente** — vive en el servidor
- El manual del juego se carga server-side junto con el system prompt
- En local sin `GEMINI_API_KEY`, la app usa **MockProvider** (modo simulación)
- Dos manuals dedicados: `sgo-manual.md` (Custodio) y `sgo-manual-pretor.md` (Pretor)

---

## Estructura del proyecto

```
api/
  query.ts                   # Serverless function — proxy hacia Gemini
public/
  data/
    sgo-manual.md            # Manual SGO en formato SMD (enfoque Custodio)
    sgo-manual-pretor.md     # Manual SGO en formato SMD (enfoque Pretor)
src/
  App.tsx                    # Raíz: selector de rol + UI de consulta
  App.css                    # Estilos
  components/
    RoleSelector.tsx         # Pantalla de selección Custodio / Pretor
  providers/
    IAProvider.ts            # Interfaz abstracta del provider IA
    GeminiProvider.ts        # Llama a /api/query (proxy serverless)
    MockProvider.ts          # Respuestas simuladas (sin API key)
    providerFactory.ts       # Selección automática de provider
  utils/
    manualLoader.ts          # Carga y caché del manual (uso interno)
  __tests__/                 # Tests Vitest + Testing Library
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Una API key gratuita de Google Gemini → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Uso en local

### 1. Clonar e instalar

```bash
git clone https://github.com/Fishb0ness/yamato-compendio.git
cd yamato-compendio
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y añade tu API key:

```
GEMINI_API_KEY=tu_api_key_aqui
```

> **Sin la key** la app arranca en **modo simulación** — el MockProvider devuelve respuestas de ejemplo sin llamar a Gemini.

### 3. Arrancar el servidor de desarrollo

Para usar la API key real necesitás el servidor de Vercel Dev, que levanta la serverless function `api/query.ts`:

```bash
npx vercel dev
```

Abre [http://localhost:3000](http://localhost:3000).

> Si preferís desarrollo sin serverless (solo MockProvider):
> ```bash
> npm run dev
> ```
> Abre [http://localhost:5173](http://localhost:5173). La app funcionará en modo simulación.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor Vite (solo MockProvider — sin serverless) |
| `npx vercel dev` | Servidor completo con serverless function |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview local del build de producción |
| `npm test` | Ejecuta los tests (Vitest) |
| `npm test -- --run` | Tests sin modo watch |

---

## Cómo contribuir

### Modificar el manual del juego

Los manuals están en `public/data/` en formato **SMD (Structured Markdown)** — optimizado para consumo por LLMs:

- `sgo-manual.md` — mecánicas desde la perspectiva del **Custodio**
- `sgo-manual-pretor.md` — mecánicas desde la perspectiva del **Pretor**

Reglas del formato SMD:
- Secciones en `## NOMBRE_SECCION` (MAYÚSCULAS)
- Atributos con `- CLAVE: valor`
- Dependencias con `REQUIRES:`, `TRIGGERS:`, `ENABLES:`
- **Sin lore ni texto narrativo** — solo mecánicas explícitas
- Las secciones `CORE_DEFINITIONS` y `EXTERNAL_INFLUENCES` están en ambos archivos — mantenerlas sincronizadas

### Añadir un nuevo provider IA

1. Crea `src/providers/TuProvider.ts` implementando `IAProvider`:
   ```ts
   export class TuProvider implements IAProvider {
     async query(intencion: string, role: Role): Promise<string> { ... }
   }
   ```
2. Actualiza `src/providers/providerFactory.ts` para incluirlo
3. Añade las variables de entorno necesarias en `.env.example`

### Tests

El proyecto usa **Strict TDD** con Vitest + Testing Library. Antes de hacer PR:

```bash
npm test -- --run   # todos los tests deben pasar
npm run build       # el build debe ser exitoso
```

---

## Despliegue en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. Ve a **Settings → Environment Variables** y añade:
   - `GEMINI_API_KEY` → tu API key de Gemini (**sin** prefijo `VITE_`)
   - `GEMINI_MODEL` → opcional, por defecto `gemini-2.5-flash-lite`
3. Haz deploy — Vercel detecta automáticamente `api/query.ts` como serverless function
