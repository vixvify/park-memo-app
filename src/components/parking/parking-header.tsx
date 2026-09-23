import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { colors, radii, spacing } from "@/theme";

export function ParkingHeader({ back = false }: { back?: boolean }) {
  return (
    <View style={styles.row}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="ย้อนกลับ"
          onPress={() => router.back()}
          style={styles.back}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </Pressable>
      ) : null}
      <View style={styles.brandIcon}>
        <MaterialIcons name="directions-car" size={21} color="#fff" />
      </View>
      <Text style={styles.brand}>
        find<Text style={styles.brandAccent}>my</Text>car
      </Text>
      <Text style={styles.tagline}>จำจุดจอด แล้วกลับมาง่าย ๆ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    minHeight: 48,
    marginBottom: spacing.xl,
  },
  back: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
  },
  brand: { color: colors.text, fontFamily: "Prompt_600SemiBold", fontSize: 18 },
  brandAccent: { color: "#6c9b76" },
  tagline: {
    marginLeft: "auto",
    color: colors.textSoft,
    fontFamily: "Prompt_400Regular",
    fontSize: 11,
  },
});
