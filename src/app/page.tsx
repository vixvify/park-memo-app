"use client";

import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ParkingForm } from "@/components/parking/parking-form.client";
import { ParkingHeader } from "@/components/parking/parking-header";
import type { ParkingInput } from "@/core/schema/parking.schema";
import { useParkingStore } from "@/store/parking.store";

export default function Home() {
  const spot = useParkingStore((state) => state.spot);
  const saveSpot = useParkingStore((state) => state.saveSpot);
  const router = useRouter();

  async function handleSave(input: ParkingInput) {
    await saveSpot(input);
    router.push("/parking");
  }

  return (
    <div className="min-h-screen bg-[#f6f8f2] text-[#173c31]">
      <ParkingHeader />
      <main className="relative mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1fr_500px] lg:items-start lg:gap-16 lg:py-24">
        <section className="space-y-7 lg:pt-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dce7da] bg-white px-4 py-2 text-xs font-medium text-[#497656]">
            <span className="size-2 rounded-full bg-[#75a777]" />
            จอดแล้ว ไปเดินเล่นได้เลย
          </div>
          <h1 className="text-4xl font-semibold leading-[1.3] tracking-tight sm:text-5xl lg:text-6xl">
            จำได้ว่า
            <br />
            <span className="text-[#79a678]">จอดรถไว้ที่ไหน</span>
          </h1>
          <p className="max-w-md text-base leading-7 text-[#6e8275]">
            บันทึกจุดจอดและตำแหน่ง GPS ไว้ แล้วกลับมาหารถได้ง่ายขึ้น
          </p>
          {spot && (
            <Link
              className="flex max-w-md items-center gap-4 rounded-2xl border border-[#d7e6d5] bg-white p-4 shadow-[0_8px_30px_rgba(24,66,43,.05)] transition hover:border-[#9fbea0]"
              href="/parking"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e6f0e5] text-[#3f7150]">
                <DirectionsCarOutlinedIcon />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm">จุดจอดล่าสุด</strong>
                <small className="block truncate text-[#728679]">
                  {spot.placeName || "ดูจุดจอดและเส้นทางกลับ"}
                </small>
              </span>
              <KeyboardArrowRightRoundedIcon className="text-[#6c9b76]" />
            </Link>
          )}
          <div className="flex items-center gap-2 text-xs text-[#879b8c]">
            <GpsFixedRoundedIcon fontSize="small" />
            บันทึก GPS ขณะกดบันทึกจุดจอด
          </div>
        </section>
        <section
          aria-label="กรอกข้อมูลจุดจอดรถ"
          className="rounded-3xl border border-[#e2e9df] bg-white p-6 shadow-[0_20px_65px_rgba(23,60,49,.08)] sm:p-9"
        >
          <ParkingForm
            initialValues={spot ?? undefined}
            onSubmit={handleSave}
          />
          {spot && (
            <p className="mt-4 text-center text-xs text-[#8a9b8f]">
              บันทึกครั้งนี้จะแทนจุดจอดล่าสุด
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
