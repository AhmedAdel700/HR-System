import Image from "next/image";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/logo.png";

type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<
  BrandLogoSize,
  { width: number; height: number; className: string }
> = {
  xs: { width: 96, height: 36, className: "h-9 w-auto" },
  sm: { width: 112, height: 42, className: "h-10 w-auto" },
  md: { width: 128, height: 48, className: "h-11 w-auto" },
  lg: { width: 168, height: 64, className: "h-14 w-auto" },
  xl: { width: 240, height: 92, className: "h-[5.5rem] w-auto sm:h-24" },
};

interface BrandLogoProps {
  size?: BrandLogoSize;
  variant?: "default" | "onDark";
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  size = "md",
  variant = "default",
  className,
  priority = false,
}: BrandLogoProps): ReactElement {
  const dimensions = sizeMap[size];

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src={LOGO_SRC}
        alt="beHr"
        width={dimensions.width}
        height={dimensions.height}
        className={cn(
          dimensions.className,
          "object-contain object-start",
          variant === "onDark" && "brightness-0 invert"
        )}
        priority={priority}
      />
    </span>
  );
}
