# Find My Car

Native Android and iOS app for saving the latest parking spot and finding the way back. Parking details are stored locally in SQLite. The app uses Expo Router, foreground device location, and Mapbox for the map and walking route.

## Requirements

- Node.js 22 and npm
- Android Studio and an Android emulator/device for local Android builds
- macOS with Xcode for local iOS builds, or EAS Build for cloud iOS builds
- Mapbox public access token for maps and Directions API
- Mapbox secret `downloads:read` token for native development builds

## Configure

Copy `.env.example` to `.env` and set:

- `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` to a least-privilege `pk.*` token
- `MAPBOX_DOWNLOADS_TOKEN` to a secret token with `downloads:read` scope

For EAS builds, add these values as project environment variables/secrets. Never commit tokens.

## Run

```bash
npm ci
npm start
```

Mapbox includes native code, so run the app in a development build instead of Expo Go:

```bash
npm run android
npm run ios
```

## Verify

```bash
npm test
npm run lint
npm run typecheck
npm run check:expo
npm run export:android
npm run export:ios
```

The app keeps one parking spot on the device. Editing its text preserves the saved location; use “ย้ายหมุดมาที่นี่” to set a new parking coordinate. Mapping and route calculation need internet access. Directions cover outdoor walking only and do not model mall floors or indoor corridors.
