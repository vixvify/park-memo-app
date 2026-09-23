import Link from "next/link";
import type { ComponentProps, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
type ButtonAlignment = "center" | "between";

const buttonAlignments: Record<ButtonAlignment, string> = {
  center: "justify-center",
  between: "justify-between",
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-[#153f33] text-white hover:bg-[#235443]",
  secondary:
    "border border-[#cadbc9] bg-white text-[#315941] hover:bg-[#edf4e9]",
  quiet: "text-[#245b3a] hover:bg-[#edf4e9]",
  danger: "text-[#977572] hover:bg-[#f8eeec] hover:text-[#8b3d35]",
};

const baseButtonClassName =
  "cursor-pointer inline-flex items-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  alignment?: ButtonAlignment;
  variant?: ButtonVariant;
};

export function Button({
  className = "",
  alignment = "center",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseButtonClassName} ${buttonAlignments[alignment]} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  alignment?: ButtonAlignment;
  variant?: ButtonVariant;
};

export function ButtonLink({
  className = "",
  alignment = "center",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseButtonClassName} ${buttonAlignments[alignment]} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}
