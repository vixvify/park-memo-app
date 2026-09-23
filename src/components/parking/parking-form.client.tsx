"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ParkingSchema, ParkingInput } from "@/type/schema/parking.schema";
import { ParkingField, ParkingNoteField } from "./parking-field";

const emptyInput: ParkingInput = {
  placeName: "",
  floor: "",
  zone: "",
  parkingNumber: "",
  note: "",
};

type ParkingFormProps = {
  initialValues?: ParkingInput;
  onSubmit: (input: ParkingInput) => Promise<void>;
};

export function ParkingForm({ initialValues, onSubmit }: ParkingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<ParkingInput>({
    resolver: zodResolver(ParkingSchema),
    defaultValues: initialValues ?? emptyInput,
  });

  return (
    <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#e7eee4] text-sm font-semibold text-[#305849]">
          01
        </span>
        <div>
          <h2 className="text-xl font-semibold text-[#173c31]">
            ตำแหน่งที่จอด
          </h2>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ParkingField
            label="ชื่อห้างหรือสถานที่"
            placeholder="เช่น เซ็นทรัลเวิลด์"
            icon={<PlaceOutlinedIcon fontSize="small" />}
            {...register("placeName")}
          />
        </div>
        <ParkingField
          label="ชั้น"
          placeholder="เช่น B2, 3"
          icon={<LayersOutlinedIcon fontSize="small" />}
          {...register("floor")}
        />
        <ParkingField
          label="โซน"
          placeholder="เช่น โซน C"
          icon={<GridViewOutlinedIcon fontSize="small" />}
          {...register("zone")}
        />
        <div className="sm:col-span-2">
          <ParkingField
            label="หมายเลขที่จอด"
            placeholder="เช่น C-128"
            icon={<DirectionsCarOutlinedIcon fontSize="small" />}
            {...register("parkingNumber")}
          />
        </div>
        <div className="sm:col-span-2">
          <ParkingNoteField
            label="จุดสังเกตเพิ่มเติม"
            placeholder="เช่น ใกล้ลิฟต์แก้ว หรือทางเข้าประตู 4"
            {...register("note")}
          />
        </div>
      </div>
      <Button
        disabled={isSubmitting || !isValid}
        alignment="between"
        className="w-full rounded-2xl px-6 py-4 text-base font-semibold shadow-[0_12px_24px_rgba(21,63,51,.18)]"
        type="submit"
      >
        {isSubmitting ? "กำลังบันทึกตำแหน่ง..." : "บันทึกจุดจอด"}
        <ArrowForwardRoundedIcon />
      </Button>
    </form>
  );
}
