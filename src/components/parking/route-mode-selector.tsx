import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import type { RouteMode } from "@/core/domain/parking";
import { colors, radii, spacing } from "@/theme";

const modes: { value: RouteMode; label: string; icon: "directions-walk" | "directions-car" }[] = [
  { value: "walking", label: "เดิน", icon: "directions-walk" },
  { value: "driving", label: "รถ", icon: "directions-car" },
];

export function RouteModeSelector({
  value,
  onChange,
}: {
  value: RouteMode;
  onChange: (mode: RouteMode) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>เส้นทาง</Text>
      <View style={styles.options}>
        {modes.map((mode) => {
          const selected = mode.value === value;
          return (
            <Pressable
              key={mode.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(mode.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <MaterialIcons
                name={mode.icon}
                size={17}
                color={selected ? colors.surface : colors.textMuted}
              />
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {mode.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontFamily: "Prompt_500Medium",
    fontSize: 13,
  },
  options: {
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceSoft,
  },
  option: {
    minWidth: 76,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
  },
  optionSelected: { backgroundColor: colors.primary },
  optionText: {
    color: colors.textMuted,
    fontFamily: "Prompt_500Medium",
    fontSize: 12,
  },
  optionTextSelected: { color: colors.surface },
});
