import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import type { Coordinates, WalkingRoute } from "@/core/domain/parking";
import { getWalkingRoute } from "@/lib/mapbox-directions";
import { env } from "@/config/env";
import { formatDistance, formatDuration } from "@/utils/parking";
import { colors, radii, spacing } from "@/theme";

Mapbox.setAccessToken(env.mapboxAccessToken);

export function ParkingMap({
  currentLocation,
  parkingLocation,
}: {
  currentLocation: Coordinates | null;
  parkingLocation: Coordinates;
}) {
  const [routeResult, setRouteResult] = useState<{
    key: string;
    route: WalkingRoute | null;
    error: string | null;
  } | null>(null);
  const routeKey = currentLocation
    ? `${currentLocation.latitude},${currentLocation.longitude}:${parkingLocation.latitude},${parkingLocation.longitude}`
    : "";
  const route = routeResult?.key === routeKey ? routeResult.route : null;
  const routeError = routeResult?.key === routeKey ? routeResult.error : null;
  const bounds = useMemo(() => {
    if (!currentLocation) return undefined;
    const longitudePadding = Math.max(
      Math.abs(currentLocation.longitude - parkingLocation.longitude) * 0.15,
      0.001,
    );
    const latitudePadding = Math.max(
      Math.abs(currentLocation.latitude - parkingLocation.latitude) * 0.15,
      0.001,
    );
    return {
      ne: [
        Math.max(currentLocation.longitude, parkingLocation.longitude) + longitudePadding,
        Math.max(currentLocation.latitude, parkingLocation.latitude) + latitudePadding,
      ] as [number, number],
      sw: [
        Math.min(currentLocation.longitude, parkingLocation.longitude) - longitudePadding,
        Math.min(currentLocation.latitude, parkingLocation.latitude) - latitudePadding,
      ] as [number, number],
      paddingTop: 40,
      paddingRight: 40,
      paddingBottom: 40,
      paddingLeft: 40,
    };
  }, [currentLocation, parkingLocation]);
  const shape = useMemo(
    () =>
      route
        ? {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "LineString" as const,
              coordinates: route.coordinates,
            },
          }
        : null,
    [route],
  );
  useEffect(() => {
    let active = true;
    if (!currentLocation)
      return () => {
        active = false;
      };
    void getWalkingRoute(currentLocation, parkingLocation)
      .then((nextRoute) => {
        if (active) setRouteResult({ key: routeKey, route: nextRoute, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setRouteResult({
          key: routeKey,
          route: null,
          error:
          error instanceof Error && error.message === "missing-token"
            ? "ตั้งค่า Mapbox access token เพื่อคำนวณเส้นทาง"
            : "คำนวณเส้นทางไม่ได้ ลองอัปเดตตำแหน่งอีกครั้ง",
        });
      });
    return () => {
      active = false;
    };
  }, [currentLocation, parkingLocation, routeKey]);

  return (
    <View style={styles.container}>
      {env.mapboxAccessToken ? (
        <Mapbox.MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Street}
          logoEnabled={false}
          compassEnabled
        >
          <Mapbox.Camera
            bounds={bounds}
            defaultSettings={{
              centerCoordinate: [
                parkingLocation.longitude,
                parkingLocation.latitude,
              ],
              zoomLevel: 16,
            }}
          />
          <Mapbox.PointAnnotation
            id="parking"
            coordinate={[parkingLocation.longitude, parkingLocation.latitude]}
          >
            <View style={styles.carPin}>
              <MaterialIcons name="directions-car" size={20} color="#fff" />
            </View>
          </Mapbox.PointAnnotation>
          {currentLocation ? <Mapbox.UserLocation visible /> : null}
          {shape ? (
            <Mapbox.ShapeSource id="walking-route" shape={shape}>
              <Mapbox.LineLayer
                id="walking-route-line"
                style={{
                  lineColor: "#427ade",
                  lineWidth: 5,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </Mapbox.ShapeSource>
          ) : null}
        </Mapbox.MapView>
      ) : (
        <View style={styles.mapUnavailable}>
          <MaterialIcons name="map" size={34} color="#52745b" />
          <Text style={styles.unavailableText}>ยังไม่ได้ตั้งค่าแผนที่</Text>
        </View>
      )}
      <View style={styles.routeStatus}>
        <MaterialIcons
          name="directions-walk"
          size={19}
          color={colors.primary}
        />
        <Text style={styles.statusText}>
          {route
            ? `${formatDistance(route.distanceMeters)} · ${formatDuration(route.durationSeconds)}`
            : (routeError ??
              (currentLocation
                ? "กำลังหาเส้นทางเดิน"
                : "อัปเดตตำแหน่งเพื่อดูเส้นทาง"))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: radii.lg,
    backgroundColor: "#e9efe8",
    borderWidth: 1,
    borderColor: "#e2e9df",
  },
  map: { height: 320 },
  mapUnavailable: {
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  unavailableText: {
    color: colors.textMuted,
    fontFamily: "Prompt_500Medium",
    fontSize: 13,
  },
  carPin: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    borderColor: "white",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  routeStatus: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  statusText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 12,
  },
});
