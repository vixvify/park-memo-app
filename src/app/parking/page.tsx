"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useCallback, useEffect, useState } from "react";

import { GoogleWalkingMap } from "@/components/parking/google-walking-map.client";
import { ParkingDetailCard } from "@/components/parking/parking-detail-card";
import { ParkingHeader } from "@/components/parking/parking-header";
import { Button, ButtonLink } from "@/components/ui/button";
import type { Coordinates } from "@/type/domain/parking";
import { getCurrentPosition } from "@/lib/geolocation";
import { useParkingStore } from "@/store/parking.store";
import { useParkingStoreHydration } from "@/store/use-parking-store-hydration";
import { formatAccuracy, formatSavedAt } from "@/utils/parking";

type LocationState = "locating" | "ready" | "unavailable";

export default function ParkingPage() {
  const hasHydrated = useParkingStoreHydration();
  const spot = useParkingStore((state) => state.spot);
  const clearSpot = useParkingStore((state) => state.clearSpot);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null,
  );
  const [locationState, setLocationState] = useState<LocationState>("locating");

  const refreshLocation = useCallback(async () => {
    setLocationState("locating");
    try {
      const position = await getCurrentPosition();
      setCurrentLocation(position);
      setLocationState("ready");
    } catch {
      setCurrentLocation(null);
      setLocationState("unavailable");
    }
  }, []);

  useEffect(() => {
    if (!spot?.coordinates) return;
    let active = true;
    void getCurrentPosition()
      .then((position) => {
        if (!active) return;
        setCurrentLocation(position);
        setLocationState("ready");
      })
      .catch(() => {
        if (active) setLocationState("unavailable");
      });
    return () => {
      active = false;
    };
  }, [spot?.coordinates]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#f6f8f2]">
        <ParkingHeader />
        <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-5 text-center text-[#718477]">
          <p role="status">กำลังโหลดจุดจอดที่บันทึกไว้...</p>
        </main>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-[#f6f8f2]">
        <ParkingHeader />
        <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
          <span className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-[#e7efe5] text-[#4f7d58]">
            <DirectionsCarOutlinedIcon sx={{ fontSize: 42 }} />
          </span>
          <h1 className="text-3xl font-semibold text-[#173c31]">
            ยังไม่มีจุดจอด
          </h1>
          <p className="mt-3 text-[#718477]">บันทึกจุดจอดรถก่อน</p>
          <ButtonLink className="mt-7 rounded-xl px-6 py-3 font-medium" href="/">
            บันทึกจุดจอด
          </ButtonLink>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f2] text-[#173c31]">
      <ParkingHeader backHref="/" backLabel="แก้ไข" />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-[#6c9673]">
              จุดจอดล่าสุด
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">กลับไปที่รถ</h1>
          </div>
          <ButtonLink
            className="rounded-xl px-4 py-2 text-sm font-medium"
            variant="secondary"
            href="/"
          >
            แก้ไขข้อมูล
          </ButtonLink>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] lg:items-start">
          <section
            aria-label="เส้นทางกลับไปยังรถ"
            className="overflow-hidden rounded-3xl border border-[#e2e9df] bg-white p-4 shadow-[0_12px_40px_rgba(24,66,43,.06)] sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">เส้นทางเดิน</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5e9] px-3 py-1 text-xs font-medium text-[#517958]">
                <DirectionsWalkRoundedIcon fontSize="small" /> เดิน
              </span>
            </div>
            {spot.coordinates ? (
              <GoogleWalkingMap
                currentLocation={currentLocation}
                parkingLocation={spot.coordinates}
              />
            ) : (
              <div className="flex h-80 flex-col items-center justify-center gap-2 rounded-2xl bg-[#e9efe8] text-center text-[#52745b] sm:h-105">
                <GpsFixedRoundedIcon sx={{ fontSize: 40 }} />
                <strong className="text-sm">ไม่มีพิกัด GPS</strong>
                <span className="text-xs">ดูรายละเอียดจุดจอดด้านล่าง</span>
              </div>
            )}
            {spot.coordinates && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f4f7f1] px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2 text-[#4f6f58]">
                  <GpsFixedRoundedIcon fontSize="small" />
                  {locationState === "locating"
                    ? "กำลังหาตำแหน่ง"
                    : locationState === "ready" && currentLocation
                      ? `ตำแหน่งปัจจุบัน ${formatAccuracy(currentLocation.accuracy)}`
                      : "ไม่พบตำแหน่งปัจจุบัน"}
                </span>
                <Button
                  className="rounded-lg px-2 py-1 text-sm font-medium disabled:opacity-50"
                  disabled={locationState === "locating"}
                  onClick={() => void refreshLocation()}
                  type="button"
                  variant="quiet"
                >
                  <RefreshRoundedIcon fontSize="small" />
                  อัปเดตตำแหน่ง
                </Button>
              </div>
            )}
          </section>
          <aside className="space-y-4">
            <ParkingDetailCard spot={spot} />
            <div className="rounded-2xl border border-[#e2e9df] bg-white px-5 py-4 text-xs text-[#7d9082]">
              <div>บันทึก {formatSavedAt(spot.savedAt)}</div>
              {spot.coordinates && (
                <div className="mt-1">
                  GPS {spot.coordinates.latitude.toFixed(5)},{" "}
                  {spot.coordinates.longitude.toFixed(5)}
                </div>
              )}
            </div>
            <Button
              className="rounded-lg px-2 py-2 text-sm"
              onClick={clearSpot}
              type="button"
              variant="danger"
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
              ล้างจุดจอด
            </Button>
          </aside>
        </div>
      </main>
    </div>
  );
}
