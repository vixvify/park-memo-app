export function formatDistance(meters: number) {
  return meters < 1000
    ? `${Math.round(meters)} ม.`
    : `${(meters / 1000).toFixed(1)} กม.`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return minutes < 60
    ? `${minutes} นาที`
    : `${Math.floor(minutes / 60)} ชม. ${minutes % 60} นาที`;
}

export function formatAccuracy(meters: number) {
  return `±${Math.round(meters)} ม.`;
}

export function formatSavedAt(isoDate: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
