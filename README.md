# SGO Compendio-AI

Aplicación web para consultar el reglamento de SGO (Stream Game Over) usando IA. Escribe libremente lo que quieres hacer como **Custodio** y la IA busca las opciones disponibles según el manual oficial.

🌐 **Demo en vivo**: [compendio0ai.vercel.app](https://compendio0ai.vercel.app)

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Una API key gratuita de Google Gemini ([obtenerla aquí](https://aistudio.google.com/apikey))

---

## Correr el proyecto en local

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Fishb0ness/yamato-compendio.git
cd yamato-compendio
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y añade tu API key de Gemini:

```
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

> Sin la key, la app funciona en **modo simulación** (MockProvider) con respuestas de ejemplo.

### 3. Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build de producción |
| `npm run test` | Ejecuta los tests (Vitest) |

---

## Estructura del proyecto

```
src/
  App.tsx                    # Página principal (título, input, resultado)
  App.css                    # Estilos
  providers/
    IAProvider.ts            # Interfaz abstracta del provider IA
    GeminiProvider.ts        # Adapter para Google Gemini 2.0 Flash
    MockProvider.ts          # Respuestas simuladas (sin API key)
    HFProvider.ts            # Adapter HuggingFace (opcional)
    providerFactory.ts       # Selección automática de provider
  utils/
    manualLoader.ts          # Carga y caché del manual SGO
public/
  data/
    sgo-manual.md            # Manual completo de mecánicas SGO
    doctrinas.json           # Datos de doctrinas y acciones
specs/                       # Artefactos SDD (spec, design, tasks)
```

---

## Despliegue

### Vercel
1. Importa el repositorio en [vercel.com](https://vercel.com)
2. Ve a **Settings → Environment Variables**
3. Añade `VITE_GEMINI_API_KEY` con tu API key
4. Haz redeploy

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Añade `VITE_GEMINI_API_KEY` en las variables de entorno del proyecto

---

## Añadir un nuevo provider IA

1. Crea `src/providers/TuProvider.ts` implementando la interfaz `IAProvider`
2. Actualiza `src/providers/providerFactory.ts` para incluirlo
3. Añade la variable de entorno correspondiente en `.env.example`
