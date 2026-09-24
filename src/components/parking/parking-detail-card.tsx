import { StyleSheet, Text, View } from "react-native";
import type { ParkingSpot } from "@/core/domain/parking";
import { colors, radii, spacing } from "@/theme";

export function ParkingDetailCard({ spot }: { spot: ParkingSpot }) {
  const items = [
    { label: "ชั้น", value: spot.floor },
    { label: "โซน", value: spot.zone },
    { label: "หมายเลข", value: spot.parkingNumber },
  ].filter((item) => item.value.trim());
  const summary = items
    .map((item) => `${item.label} ${item.value}`)
    .join(" · ");

  return (
    <View style={styles.card}>
      <Text style={styles.place}>{spot.placeName || "จุดจอดของฉัน"}</Text>
      {summary ? <Text style={styles.summary}>{summary}</Text> : null}
      {spot.note.trim() ? (
        <Text style={styles.note} numberOfLines={1}>
          {spot.note}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  place: { color: colors.text, fontFamily: "Prompt_600SemiBold", fontSize: 18 },
  summary: {
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 13,
  },
  note: {
    color: "#365649",
    fontFamily: "Prompt_400Regular",
    fontSize: 13,
  },
});
