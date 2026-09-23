"use client";

import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { useEffect, useRef, useState } from "react";

import { config } from "@/config";
import type { Coordinates } from "@/type/domain/parking";
import { renderWalkingMap, type WalkingMapResult } from "@/lib/google-maps";

type MapStatus =
  | "loading"
  | "ready"
  | "failed"
  | "no-route"
  | "waiting-location"
  | "missing-key";

const statusMessage: Record<MapStatus, string> = {
  loading: "กำลังโหลดแผนที่...",
  ready: "",
  failed: "โหลดแผนที่ไม่สำเร็จ",
  "no-route": "ไม่พบเส้นทางเดิน",
  "waiting-location": "รอตำแหน่งปัจจุบัน",
  "missing-key": "ยังไม่ได้ตั้งค่า Google Maps API key",
};

export function GoogleWalkingMap({
  currentLocation,
  parkingLocation,
}: {
  currentLocation: Coordinates | null;
  parkingLocation: Coordinates;
}) {
  const mapElement = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [route, setRoute] = useState<WalkingMapResult["summary"]>(null);

  useEffect(() => {
    if (!config.googleMapsApiKey || !currentLocation || !mapElement.current)
      return;
    let active = true;
    let dispose: (() => void) | undefined;
    setStatus("loading");
    setRoute(null);
    void renderWalkingMap(mapElement.current, currentLocation, parkingLocation)
      .then((result) => {
        if (!active) {
          result?.dispose();
          return;
        }
        if (!result) {
          setStatus("no-route");
          return;
        }
        dispose = result.dispose;
        setRoute(result.summary);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("failed");
      });
    return () => {
      active = false;
      dispose?.();
    };
  }, [currentLocation, parkingLocation]);

  const visibleStatus = !config.googleMapsApiKey
    ? "missing-key"
    : !currentLocation
      ? "waiting-location"
      : status;

  return (
    <div className="relative h-80 overflow-hidden rounded-2xl bg-[#e9efe8] sm:h-105">
      <div
        aria-label="แผนที่เส้นทางเดินกลับไปยังรถ"
        className="h-full w-full"
        ref={mapElement}
      />
      {visibleStatus !== "ready" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#e9efe8]/95 px-6 text-center text-[#43684e]"
          role="status"
        >
          <ExploreOutlinedIcon sx={{ fontSize: 40 }} />
          <strong className="text-sm font-medium">
            {statusMessage[visibleStatus]}
          </strong>
        </div>
      )}
      {visibleStatus === "ready" && route && (
        <div className="absolute bottom-4 left-4 flex gap-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#173c31] shadow-lg">
          <span>{route.distance}</span>
          <span className="border-l border-[#d9e3d7] pl-4">
            {route.duration}
          </span>
        </div>
      )}
    </div>
  );
}
