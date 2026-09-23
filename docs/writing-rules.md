# Writing Rules

- Keep Expo Router screens small and compose UI from focused components.
- Use React Native components, `StyleSheet`, shared theme values, and Expo Material icons.
- Keep domain types under `src/core/domain`; schemas stay under `src/core/schema` and must not be imported by the domain.
- Use React Hook Form and Zod for forms; all parking text fields are optional.
- Keep SQL in SQLite repositories and external map calls in `src/lib`.
- Preserve the existing parking pin when editing text. Change its coordinate only through the explicit move-pin action.
- Keep location foreground-only and allow users to save details when location permission is denied.
- Store tests under root `tests/` and verify visible behavior with React Native Testing Library.
- Keep Mapbox secret build tokens out of source control.
