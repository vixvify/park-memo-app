import type { ParkingSpot } from "@/type/domain/parking";

export function ParkingDetailCard({ spot }: { spot: ParkingSpot }) {
  const items = [
    { label: "ชั้น", value: spot.floor },
    { label: "โซน", value: spot.zone },
    { label: "หมายเลข", value: spot.parkingNumber },
  ].filter(({ value }) => value.trim());
  return (
    <section
      aria-label="รายละเอียดจุดจอด"
      className="rounded-3xl border border-[#e2e9df] bg-white p-6 shadow-[0_12px_40px_rgba(24,66,43,.06)] sm:p-7"
    >
      <h2 className="text-xl font-semibold text-[#173c31]">
        {spot.placeName || "จุดจอดของฉัน"}
      </h2>
      {items.length > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-2">
          {items.map(({ label, value }) => (
            <div className="rounded-xl bg-[#f1f5ee] p-3" key={label}>
              <dt className="text-xs text-[#7b8d83]">{label}</dt>
              <dd className="mt-1 wrap-break-word text-lg font-semibold text-[#204738]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {spot.note.trim() && (
        <div className="mt-5 border-t border-[#e9eee7] pt-4">
          <h3 className="text-xs font-medium text-[#7b8d83]">จุดสังเกต</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[#365649]">
            {spot.note}
          </p>
        </div>
      )}
    </section>
  );
}
