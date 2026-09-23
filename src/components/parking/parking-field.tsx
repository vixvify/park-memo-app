import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

type ParkingFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
};

export function ParkingField({ label, icon, ...props }: ParkingFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#385448]">{label}</span>
      <span className="flex min-h-13 items-center gap-3 rounded-xl border border-[#dce5dd] bg-[#fbfcfa] px-4 text-[#789184] focus-within:border-[#5b8b72] focus-within:ring-2 focus-within:ring-[#dbe9df]">
        <span
          aria-hidden="true"
          className="flex size-5 items-center justify-center"
        >
          {icon}
        </span>
        <input
          className="w-full border-0 bg-transparent py-3 text-[#173c31] outline-none placeholder:text-[#9baaa0]"
          {...props}
        />
      </span>
    </label>
  );
}

export function ParkingNoteField({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[#385448]">{label}</span>
      <textarea
        className="min-h-26 w-full resize-y rounded-xl border border-[#dce5dd] bg-[#fbfcfa] px-4 py-3 text-[#173c31] outline-none placeholder:text-[#9baaa0] focus:border-[#5b8b72] focus:ring-2 focus:ring-[#dbe9df]"
        rows={3}
        {...props}
      />
    </label>
  );
}
