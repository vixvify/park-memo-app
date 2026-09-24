import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Find My Car",
  slug: "findmycar",
  version: "0.2.0",
  scheme: "findmycar",
  platforms: ["ios", "android"],
  orientation: "portrait",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.vixvify.findmycar",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "ใช้ตำแหน่งเพื่อบันทึกและพากลับไปยังจุดจอดรถ",
    },
  },
  android: {
    package: "com.vixvify.findmycar",
  },
  plugins: [
    "expo-router",
    "expo-sqlite",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "ใช้ตำแหน่งเพื่อบันทึกและพากลับไปยังจุดจอดรถ",
      },
    ],
    ["expo-splash-screen", { backgroundColor: "#f6f8f2" }],
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken:
          process.env.MAPBOX_DOWNLOADS_TOKEN || undefined,
      },
    ],
  ],
  experiments: { typedRoutes: true },
};

export default config;
