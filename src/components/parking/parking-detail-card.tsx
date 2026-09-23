import { StyleSheet, Text, View } from "react-native";
import type { ParkingSpot } from "@/core/domain/parking";
import { colors, radii, spacing } from "@/theme";

export function ParkingDetailCard({ spot }: { spot: ParkingSpot }) {
  const items = [
    { label: "ชั้น", value: spot.floor },
    { label: "โซน", value: spot.zone },
    { label: "หมายเลข", value: spot.parkingNumber },
  ].filter((item) => item.value.trim());
  return (
    <View style={styles.card}>
      <Text style={styles.place}>{spot.placeName || "จุดจอดของฉัน"}</Text>
      {items.length ? (
        <View style={styles.items}>
          {items.map((item) => (
            <View key={item.label} style={styles.item}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      {spot.note.trim() ? (
        <View style={styles.note}>
          <Text style={styles.itemLabel}>จุดสังเกต</Text>
          <Text style={styles.noteText}>{spot.note}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#e2e9df",
    gap: spacing.md,
  },
  place: { color: colors.text, fontFamily: "Prompt_600SemiBold", fontSize: 19 },
  items: { flexDirection: "row", gap: spacing.sm },
  item: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft,
  },
  itemLabel: {
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 11,
  },
  itemValue: {
    marginTop: 2,
    color: "#204738",
    fontFamily: "Prompt_600SemiBold",
    fontSize: 16,
  },
  note: {
    borderTopWidth: 1,
    borderTopColor: "#e9eee7",
    paddingTop: spacing.md,
  },
  noteText: {
    marginTop: 2,
    color: "#365649",
    fontFamily: "Prompt_400Regular",
    fontSize: 13,
  },
});
