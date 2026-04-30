# Especificación SDD: SGO Custodio Web App

## Requisitos Funcionales
1. Navegación visual por doctrinas y acciones
2. Consulta por intención (input libre + recomendación IA)
3. Provider IA desacoplado y migrable
4. Presentación explicativa y enlazada
5. Despliegue sin errores Netlify/Vercel

## Requisitos No Funcionales
1. UX minimalista responsiva
2. Configurabilidad IA
3. Sin backend salvo proxy IA
4. Documentación y guía para ampliaciones

## Escenarios Given-When-Then
### Navegación
- **Given** SPA abierta, **When** selecciono doctrina, **Then** veo acciones.
### Consulta intención
- **Given** input "salvar vida", **When** consulto, **Then** recomienda Hierro + Edicto Sangre y explica.
### Switch Provider
- **Given** app desplegada, **When** cambio provider IA, **Then** no cambia UI ni flujo usuario.

## Criterios de aceptación
- Todas las doctrinas y acciones navegables visualmente
- Consulta libre responde con opción adecuada y explicación
- Provider IA se puede cambiar sin tocar lógica App
- Readme y archivos despliegue listos y funcionales
