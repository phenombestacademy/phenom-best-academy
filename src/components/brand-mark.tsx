import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  alt = "Phenom Best Academy",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/brand/mark-clear.png"
      alt={alt}
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo-name.png"
      alt="Phenom Best Academy"
      className={cn("h-11 w-auto max-w-full object-contain object-left", className)}
    />
  );
}

export function BrandFull({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo-clear.png"
      alt="Phenom Best Academy — Tranquil Excellence for Global Impact"
      className={cn("h-auto w-full max-w-[26rem] object-contain object-left", className)}
    />
  );
}
