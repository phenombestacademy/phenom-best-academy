import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-orange text-primary-fg shadow-card hover:bg-orange-deep",
        navy: "bg-navy text-cream hover:bg-navy-mid",
        outline:
          "border border-line bg-transparent text-ink hover:bg-paper-deep",
        ghost: "text-ink hover:bg-paper-deep",
        cream: "bg-cream text-navy hover:bg-ivory",
      },
      size: {
        sm: "h-10 rounded-md px-3.5 text-sm",
        md: "h-11 rounded-md px-4 text-[0.9375rem]",
        lg: "h-12 rounded-lg px-5 text-base",
        xl: "h-14 rounded-lg px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
