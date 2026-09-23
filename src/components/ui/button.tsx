import type { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { colors, radii, spacing } from "@/theme";

type ButtonProps = PropsWithChildren<{
  onPress: () => void;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  accessibilityLabel?: string;
}>;

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "quiet" && styles.quiet,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.surface : colors.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <MaterialIcons
              name={icon}
              size={20}
              color={
                isPrimary
                  ? colors.surface
                  : isDanger
                    ? colors.danger
                    : colors.primary
              }
            />
          ) : null}
          <Text
            style={[
              styles.label,
              isPrimary && styles.primaryLabel,
              isDanger && styles.dangerLabel,
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quiet: { backgroundColor: "transparent", paddingHorizontal: spacing.sm },
  danger: { backgroundColor: colors.dangerLight },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  label: {
    color: colors.primary,
    fontFamily: "Prompt_500Medium",
    fontSize: 14,
  },
  primaryLabel: { color: colors.surface, fontFamily: "Prompt_600SemiBold" },
  dangerLabel: { color: colors.danger },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.84 },
});
