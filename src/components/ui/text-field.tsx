import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { colors, radii, spacing } from "@/theme";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  multiline?: boolean;
};

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon,
  multiline = false,
}: FormFieldProps<T>) {
  const [focused, setFocused] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.wrapper}>
          <Text style={styles.label}>{label}</Text>
          <View
            style={[
              styles.inputShell,
              multiline && styles.multilineShell,
              focused && styles.focused,
            ]}
          >
            <MaterialIcons name={icon} size={18} color={colors.textMuted} />
            <TextInput
              accessibilityLabel={label}
              multiline={multiline}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              onChangeText={onChange}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              placeholderTextColor="#9baaa0"
              style={[styles.input, multiline && styles.multiline]}
              textAlignVertical={multiline ? "top" : "center"}
              value={String(value ?? "")}
            />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  label: { color: "#385448", fontFamily: "Prompt_500Medium", fontSize: 13 },
  inputShell: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: "#fbfcfa",
  },
  multilineShell: { minHeight: 104, alignItems: "flex-start", paddingTop: 14 },
  focused: { borderColor: "#5b8b72", borderWidth: 1.5 },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: "Prompt_400Regular",
    fontSize: 14,
  },
  multiline: { minHeight: 80, paddingTop: 0 },
});
