import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";

export function ParkingHeader({
  backHref,
  backLabel,
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="relative z-10 border-b border-[#dfe7dd] bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          aria-label="FindMyCar หน้าแรก"
          className="flex items-center gap-2 font-semibold tracking-tight text-[#173c31]"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#173f33] text-white">
            <NearMeRoundedIcon fontSize="small" />
          </span>
          <span className="text-lg">
            find<span className="text-[#6c9b76]">my</span>car
          </span>
        </Link>
        {backHref ? (
          <ButtonLink
            className="rounded-xl px-2 py-1 text-sm font-medium text-[#42664f] hover:text-[#173f33]"
            variant="quiet"
            href={backHref}
          >
            <ArrowBackRoundedIcon fontSize="small" />
            {backLabel ?? "กลับ"}
          </ButtonLink>
        ) : (
          <span className="hidden text-xs tracking-wide text-[#83978b] sm:block">
            จำจุดจอดรถของคุณ
          </span>
        )}
      </div>
    </header>
  );
}
