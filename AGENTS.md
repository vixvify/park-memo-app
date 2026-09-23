# FindMyCar project instructions

FindMyCar is a native React Native app built with Expo, TypeScript, Expo Router, Mapbox, Expo Location, and on-device SQLite. The app stores only the most recent parking spot. There is no backend, account system, or cloud sync.

## Structure

```text
src/
├── app/                 # Expo Router screens and root providers
├── components/
│   ├── parking/         # Parking feature UI
│   └── ui/              # Shared native UI primitives
├── config/              # Runtime and build environment config
├── core/
│   ├── domain/          # App-owned parking types
│   ├── ports/           # Repository contracts
│   ├── schema/          # Zod input schemas
│   └── service/         # Parking workflows
├── infrastructure/
│   ├── database/        # SQLite migrations
│   └── repositories/    # SQLite implementations
├── lib/                 # Expo device and Mapbox integrations
├── theme/               # Shared colors and spacing
└── utils/               # Pure helpers
```

Keep route files focused on screen composition and navigation. Components must not run SQL or call Mapbox Directions directly. Keep domain independent from UI, Expo, SQLite, and schemas. Keep forms on React Hook Form with schema-derived input types.

Use React Native primitives and `StyleSheet` with shared theme values. Use Material icons from Expo. Load the Prompt font through Expo Font. Request foreground location only; never add background location for this app.

SQLite is the source of truth. Parking edits preserve the saved pin and timestamp; moving a pin is an explicit action that updates both. GPS failure must not prevent saving text details.

Mapbox runtime token is public (`EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`). Native SDK download token is a secret (`MAPBOX_DOWNLOADS_TOKEN`) and must not be committed. Mapbox requires a development build; Expo Go is not supported.

Tests live under root `tests/`: unit tests for schemas, services, utilities, API parsing, and repository mapping; component tests for visible UI behavior; integration tests for SQLite and parking flows. Do not add backend, Prisma, auth, Zustand persistence, web styling systems, or unrelated architecture.

Before changing dependencies, inspect `package.json` and use Expo-compatible package versions. Use `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run check:expo`, and platform exports for verification when available. Never claim a check passed unless it ran successfully.
