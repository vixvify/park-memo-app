export function formatDistance(meters: number) {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} กม.`
    : `${Math.round(meters)} ม.`;
}

export function formatDuration(milliseconds: number) {
  return `${Math.max(1, Math.ceil(milliseconds / 60_000))} นาที`;
}

export function formatAccuracy(meters: number) {
  return `±${Math.max(1, Math.round(meters))} ม.`;
}

export function formatSavedAt(isoDate: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
