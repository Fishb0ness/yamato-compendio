# Guía de contribución — SGO Compendio-AI

Gracias por querer contribuir. Este documento explica cómo hacerlo correctamente.

---

## Código de conducta

- Comunicación respetuosa en issues y PRs
- Las discusiones técnicas se basan en evidencia, no en opiniones
- Las correcciones del manual deben apoyarse en la fuente oficial del juego

---

## ¿Cómo puedo contribuir?

| Tipo | Descripción |
|------|-------------|
| 🐛 Bug fix | Algo no funciona como debería |
| ✨ Feature | Nueva funcionalidad |
| 📖 Manual | Corrección o mejora del contenido SGO |
| 🧪 Tests | Añadir o mejorar cobertura |
| 📝 Docs | README, comentarios, ejemplos |

---

## Flujo de trabajo

```
fork → rama → cambios → tests + build → PR
```

### 1. Fork y rama

```bash
git clone https://github.com/TU_USUARIO/yamato-compendio.git
cd yamato-compendio
git checkout -b tipo/descripcion-corta
# Ejemplos:
#   feat/pretor-caps-display
#   fix/role-selector-mobile
#   content/update-edicto-avatar-rules
```

### 2. Instala dependencias

```bash
npm install
cp .env.example .env.local
# Edita .env.local con tu GEMINI_API_KEY (opcional — sin key usa MockProvider)
```

### 3. Haz tus cambios

Sigue las reglas de cada área (ver secciones más abajo).

### 4. Verifica antes de hacer PR

```bash
npm test -- --run   # todos los tests deben pasar
npm run build       # el build debe ser exitoso
```

**Ambos comandos deben terminar sin errores.** El CI los ejecuta automáticamente en cada PR — si fallan, el PR no se puede mergear.

### 5. Abre el PR

Completa el template de PR. Incluye la salida de tests y build como evidencia.

---

## Reglas por área

### Código (TypeScript / React)

- **TypeScript estricto** — sin `any`, sin `@ts-ignore` sin justificación
- **Sin lógica de negocio en componentes** — los componentes son presentacionales
- **Cada funcionalidad nueva necesita tests** — el proyecto usa Strict TDD con Vitest
- **Nombrado en inglés** para código; español para contenido del juego y UI
- Convenciones:
  - Componentes: `PascalCase`
  - Funciones y variables: `camelCase`
  - Constantes: `UPPER_SNAKE_CASE`
  - Archivos de componentes: `NombreComponente.tsx`
  - Archivos de tests: `NombreComponente.test.tsx` en `src/__tests__/`

### Tests

- Un test por comportamiento observable, no por implementación interna
- Nombra los tests describiendo el comportamiento: `"returns 400 when role is missing"`
- Mockea dependencias externas (fetch, fs, env vars) — sin llamadas reales a Gemini en tests
- Ejecuta `npm test -- --run` después de cada cambio

### Manuals SGO (`public/data/`)

Los manuals usan formato **SMD (Structured Markdown)** — optimizado para consumo por LLMs.

**Reglas obligatorias:**
- Secciones con `## NOMBRE_SECCION` en MAYÚSCULAS
- Atributos con `- CLAVE: valor`
- Dependencias con `REQUIRES:`, `TRIGGERS:`, `ENABLES:`
- **Sin lore, flavor text ni narrativa** — solo mecánicas explícitas
- Sin referencias hacia adelante — cada término usado debe estar definido antes
- `sgo-manual.md` → perspectiva **Custodio** (Doctrinas, sin Edictos de Pretor)
- `sgo-manual-pretor.md` → perspectiva **Pretor** (Edictos, Caps, sin Doctrinas de Custodio)
- Las secciones `## CORE_DEFINITIONS` y `## EXTERNAL_INFLUENCES` están en **ambos** archivos — si modificás una, actualizá la otra también

**Ejemplo de formato correcto:**
```markdown
- EDICTO_DE_LA_VOZ:
  - NORMAL:
    - EFFECT: impone resultado definitivo de una votación
  - ABSOLUTO:
    - REQUIRES: detallar misión posible en juego activo
    - EFFECT: crea misión prioritaria para desbloquear artefacto
    - TRIGGERS: misión completada → Pretor recupera +3000 Caps
```

### Variables de entorno

- Toda nueva variable de entorno debe documentarse en `.env.example` con comentario explicativo
- Variables server-side: **sin** prefijo `VITE_`
- Variables client-side (expuestas al bundle): con prefijo `VITE_` — úsalas solo si es estrictamente necesario

### Serverless function (`api/query.ts`)

- Valida siempre los inputs antes de usarlos — devuelve `400` para inputs inválidos
- Nunca expongas `GEMINI_API_KEY` ni el system prompt en la respuesta de error
- Los errores al cliente deben ser genéricos: `"Server configuration error"`, `"Upstream service error"`

---

## Branch protection (main)

La rama `main` tiene las siguientes protecciones:

- ✅ CI debe pasar (tests + build) antes de mergear
- ✅ Al menos 1 review aprobatorio requerido
- ✅ No se puede hacer push directo a `main`
- ✅ Las ramas deben estar al día con `main` antes de mergear

> Si eres el maintainer y necesitás configurar esto: GitHub → Settings → Branches → Add rule → `main`.

---

## Commit messages

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo: descripción corta en imperativo

Cuerpo opcional explicando el por qué (no el qué).
```

| Tipo | Cuándo usarlo |
|------|---------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `content` | Cambio en manuals SGO |
| `test` | Añadir o corregir tests |
| `docs` | Documentación |
| `refactor` | Refactor sin cambio de comportamiento |
| `chore` | Tareas de mantenimiento (deps, config) |

**Ejemplos:**
```
feat: add caps counter display for Pretores
fix: role selector not resetting query state on back
content: update Edicto del Avatar absolute cost in pretor manual
```

---

## Preguntas

Abre un issue con la etiqueta `question` o consulta en el canal de Discord del proyecto.
