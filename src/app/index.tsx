import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ParkingForm } from "@/components/parking/parking-form";
import { ParkingHeader } from "@/components/parking/parking-header";
import { Screen } from "@/components/ui/screen";
import type { ParkingSpot } from "@/core/domain/parking";
import { createParkingService } from "@/core/service/parking.service";
import { createSqliteParkingRepository } from "@/infrastructure/repositories/sqlite-parking.repository";
import { getCurrentPosition } from "@/lib/geolocation";
import { colors, radii, spacing } from "@/theme";

export default function HomeScreen() {
  const database = useSQLiteContext();
  const repository = useMemo(
    () => createSqliteParkingRepository(database),
    [database],
  );
  const service = useMemo(
    () => createParkingService({ repository, getCurrentPosition }),
    [repository],
  );
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEditing = mode === "edit";
  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void service
        .getCurrent()
        .then((current) => {
          if (active) setSpot(current);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [service]),
  );

  const handleSubmit = async (input: Parameters<typeof service.saveNew>[0]) => {
    setSubmitting(true);
    try {
      if (isEditing) await service.updateDetails(input);
      else await service.saveNew(input);
      router.replace("/parking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ParkingHeader />
      <View style={styles.hero}>
        <View style={styles.badge}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>จอดแล้วไปเดินเล่นได้เลย</Text>
        </View>
        <Text style={styles.heading}>
          จำได้ว่า<Text style={styles.headingAccent}>จอดรถไว้ที่ไหน</Text>
        </Text>
        <Text style={styles.description}>
          บันทึกชั้น โซน และตำแหน่ง GPS แล้วกลับมาหารถได้ง่ายขึ้น
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <>
          {spot && !isEditing ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/parking")}
              style={styles.savedCard}
            >
              <View style={styles.savedIcon}>
                <MaterialIcons
                  name="directions-car"
                  size={22}
                  color="#3f7150"
                />
              </View>
              <View style={styles.savedText}>
                <Text style={styles.savedTitle}>จุดจอดล่าสุด</Text>
                <Text numberOfLines={1} style={styles.savedPlace}>
                  {spot.placeName || "ดูรายละเอียดจุดจอด"}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={23} color="#6c9b76" />
            </Pressable>
          ) : null}
          <ParkingForm
            initialValues={isEditing && spot ? spot : undefined}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.md, marginBottom: spacing.xl },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: "#dce7da",
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radii.pill,
    backgroundColor: "#75a777",
  },
  badgeText: { color: "#497656", fontFamily: "Prompt_500Medium", fontSize: 11 },
  heading: {
    color: colors.text,
    fontFamily: "Prompt_600SemiBold",
    fontSize: 29,
    lineHeight: 42,
  },
  headingAccent: { color: "#79a678" },
  description: {
    maxWidth: 350,
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 14,
    lineHeight: 23,
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "#d7e6d5",
    backgroundColor: colors.surface,
  },
  savedIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    backgroundColor: colors.primaryLight,
  },
  savedText: { flex: 1 },
  savedTitle: {
    color: colors.text,
    fontFamily: "Prompt_500Medium",
    fontSize: 13,
  },
  savedPlace: {
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 12,
  },
  loading: { marginTop: 60 },
});
