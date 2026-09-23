# Architecture

## Overview

FindMyCar is a frontend-only Next.js app for saving one parking spot and viewing it on a map. It has no application backend, database, or sign-in flow.

```text
src/
├── app/                 # Route composition for / and /parking
├── components/
│   ├── parking/         # Feature-specific parking UI
│   └── ui/              # Shared buttons and UI primitives
├── config/              # Public browser configuration, such as Google Maps
├── type/                # Parking data types and form schema
├── lib/                 # Browser integrations: geolocation and Google Maps
├── store/               # Shared client-side parking state
└── utils/               # Pure formatting and calculation helpers

tests/
├── components/          # User-visible React behavior
└── unit/                # Store and utility behavior
```

## Data flow

```text
Parking pages → parking components → Zustand store
                                  ├→ browser geolocation
                                  └→ Google Maps JavaScript API
```

The store holds the latest parking details, captured coordinates, and save time, and persists that spot in browser storage so it survives reloads on the same browser. Google Maps configuration uses public `NEXT_PUBLIC_` variables; no server secrets are required.

## Layer ownership

| Location | Responsibility |
| --- | --- |
| `src/app` | Route-specific layout and composition. |
| `src/components` | Reusable UI and user interactions. |
| `src/config` | Public browser configuration. |
| `src/type` | Parking data types and form schema. |
| `src/lib` | Browser APIs and external map integration. |
| `src/store` | Client state shared between parking routes. |
| `src/utils` | Small pure helpers. |
| `tests` | Component and unit tests. |
