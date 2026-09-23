# Writing Rules

## Scope

- Keep the app frontend-only. Do not add an API, database, authentication, or server persistence unless requested.
- Use Zustand for parking state shared between routes. Use browser storage when that state must survive a page reload.
- Keep Google Maps and geolocation browser integrations in `src/lib` and keep public configuration in `src/config`.

## Code structure

- Keep route files focused on page composition.
- Extract reusable UI into small components under `src/components`.
- Keep parking types and form schemas under `src/type`, outside UI components.
- Put pure formatting and calculations in `src/utils`.
- Use local component state when state does not need to be shared across routes.
- Keep client boundaries limited to components that need state, event handlers, effects, or browser APIs.

## TypeScript and naming

- Use strong types and schema-derived form input types.
- Use `import type` for type-only dependencies.
- Use kebab-case filenames and descriptive names.
- Avoid `any`, unnecessary assertions, and duplicated logic.

## Testing and verification

- Put tests under the root `tests/` directory.
- Test components through visible behavior and user interactions.
- Test stores, utilities, and calculations with unit tests.
- Run the relevant test script, lint, typecheck, and build after meaningful changes.
