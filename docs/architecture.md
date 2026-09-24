# Architecture

FindMyCar is an Expo React Native app for Android and iOS. Expo Router composes `/` (save/edit) and `/parking` (return to the car).

```text
src/
├── app/                 # Routes and app providers
├── components/          # Parking UI and shared native primitives
├── config/              # Environment values
├── core/                # Parking domain, schema, port, and workflows
├── infrastructure/      # SQLite migration and repository
├── lib/                 # Foreground location and Mapbox Directions
├── theme/               # Shared visual tokens
└── utils/               # Pure formatters
```

The latest parking spot is stored in one SQLite row. Routes call the parking service; the service depends on the repository contract and location adapter. UI components do not access SQLite or the Directions API. Mapbox renders the selected walking or driving route and parking/current-location markers.

Unit and component tests live under `tests/`. Keep platform integrations behind `lib` or `infrastructure` boundaries so the workflows and UI can be tested without a real device.
