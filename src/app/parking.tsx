import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ParkingDetailCard } from "@/components/parking/parking-detail-card";
import { ParkingHeader } from "@/components/parking/parking-header";
import { ParkingMap } from "@/components/parking/parking-map";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import type { Coordinates, ParkingSpot } from "@/core/domain/parking";
import { createParkingService } from "@/core/service/parking.service";
import { createSqliteParkingRepository } from "@/infrastructure/repositories/sqlite-parking.repository";
import { getCurrentPosition } from "@/lib/geolocation";
import { formatAccuracy, formatSavedAt } from "@/utils/parking";
import { colors, radii, spacing } from "@/theme";

export default function ParkingScreen() {
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
  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null,
  );
  const [locationMessage, setLocationMessage] = useState(
    "กำลังค้นหาตำแหน่งปัจจุบัน",
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [movingPin, setMovingPin] = useState(false);

  const refreshLocation = useCallback(async () => {
    setRefreshing(true);
    try {
      const position = await getCurrentPosition();
      setCurrentLocation(position);
      setLocationMessage(
        `ตำแหน่งปัจจุบัน ${formatAccuracy(position.accuracy)}`,
      );
    } catch {
      setCurrentLocation(null);
      setLocationMessage("ไม่พบตำแหน่งปัจจุบัน");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void service
        .getCurrent()
        .then((current) => {
          if (!active) return;
          setSpot(current);
          setLoading(false);
          if (current?.coordinates) void refreshLocation();
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [service, refreshLocation]),
  );

  const movePin = async () => {
    setMovingPin(true);
    try {
      const updated = await service.moveToCurrentPosition();
      setSpot(updated);
      setCurrentLocation(null);
      setLocationMessage("หมุดรถย้ายมายังตำแหน่งปัจจุบันแล้ว");
    } catch {
      Alert.alert("ย้ายหมุดไม่ได้", "ตรวจสอบสิทธิ์ตำแหน่งและลองอีกครั้ง");
    } finally {
      setMovingPin(false);
    }
  };

  const clearSpot = () =>
    Alert.alert("ล้างจุดจอด?", "ข้อมูลจุดจอดล่าสุดจะถูกลบจากอุปกรณ์", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ล้างจุดจอด",
        style: "destructive",
        onPress: () => {
          void service.clearCurrent().then(() => {
            setSpot(null);
            router.replace("/");
          });
        },
      },
    ]);

  return (
    <Screen>
      <ParkingHeader back />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : !spot ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <MaterialIcons name="directions-car" size={40} color="#4f7d58" />
          </View>
          <Text style={styles.emptyTitle}>ยังไม่มีจุดจอด</Text>
          <Text style={styles.emptyDescription}>
            บันทึกจุดจอดรถก่อน แล้วกลับมาดูที่หน้านี้
          </Text>
          <Button icon="add-location" onPress={() => router.replace("/")}>
            บันทึกจุดจอด
          </Button>
        </View>
      ) : (
        <>
          <View style={styles.headingRow}>
            <View style={styles.headingText}>
              <Text style={styles.eyebrow}>จุดจอดล่าสุด</Text>
              <Text style={styles.title}>กลับไปที่รถ</Text>
            </View>
            <Button
              variant="quiet"
              icon="edit"
              onPress={() =>
                router.push({ pathname: "/", params: { mode: "edit" } })
              }
            >
              แก้ไข
            </Button>
          </View>
          {spot.coordinates ? (
            <ParkingMap
              currentLocation={currentLocation}
              parkingLocation={spot.coordinates}
            />
          ) : (
            <View style={styles.noCoordinates}>
              <MaterialIcons name="location-off" size={26} color="#52745b" />
              <Text style={styles.noCoordinatesText}>
                ไม่มีพิกัด GPS ของจุดจอดนี้
              </Text>
            </View>
          )}
          {spot.coordinates ? (
            <View style={styles.locationRow}>
              <MaterialIcons
                name="my-location"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.locationText}>{locationMessage}</Text>
              <Button
                accessibilityLabel="อัปเดตตำแหน่ง"
                disabled={refreshing}
                loading={refreshing}
                variant="quiet"
                icon="refresh"
                onPress={() => void refreshLocation()}
              />
            </View>
          ) : null}
          <ParkingDetailCard spot={spot} />
          <View style={styles.savedAt}>
            <Text style={styles.savedAtText}>
              บันทึก {formatSavedAt(spot.savedAt)}
            </Text>
            {spot.coordinates ? (
              <Text style={styles.savedAtText}>
                GPS {spot.coordinates.latitude.toFixed(5)},{" "}
                {spot.coordinates.longitude.toFixed(5)}
              </Text>
            ) : null}
          </View>
          {spot.coordinates ? (
            <Button
              variant="secondary"
              icon="pin-drop"
              loading={movingPin}
              onPress={() => void movePin()}
            >
              ย้ายหมุดมาที่นี่
            </Button>
          ) : null}
          <Button variant="danger" icon="delete-outline" onPress={clearSpot}>
            ล้างจุดจอด
          </Button>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 60 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    backgroundColor: "#e7efe5",
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: "Prompt_600SemiBold",
    fontSize: 24,
  },
  emptyDescription: {
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 13,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  headingText: { gap: 2 },
  eyebrow: { color: "#6c9673", fontFamily: "Prompt_500Medium", fontSize: 11 },
  title: { color: colors.text, fontFamily: "Prompt_600SemiBold", fontSize: 26 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  locationText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 12,
  },
  noCoordinates: {
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: "#e9efe8",
  },
  noCoordinatesText: {
    color: "#52745b",
    fontFamily: "Prompt_500Medium",
    fontSize: 13,
  },
  savedAt: { gap: 3, paddingHorizontal: spacing.xs },
  savedAtText: {
    color: colors.textSoft,
    fontFamily: "Prompt_400Regular",
    fontSize: 11,
  },
});
