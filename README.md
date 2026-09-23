# FindMyCar

A frontend-only parking memo app. Save the mall, floor, zone, parking number, notes, and current GPS point, then view the saved details and walking map when returning to the car.

## Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google Maps

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` and enable the Maps JavaScript API and Routes API in Google Cloud. The saved parking details remain available without a Maps key; the map reports when configuration is missing.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
