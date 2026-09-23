export const config = {
  get googleMapsApiKey() {
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  },

  get googleMapsMapId() {
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";
  },
};
