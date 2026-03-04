"use client";

import { ButtonHTMLAttributes } from "react";
import { tv, VariantProps } from "tailwind-variants";

const button = tv({
  base: "cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-primary-500 text-white hover:bg-primary-600",
      secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
      outline:
        "border border-foreground/20 bg-transparent hover:bg-foreground/5",
      ghost: "bg-transparent hover:bg-foreground/5",
    },
    size: {
      medium: "p-3 text-sm",
      large: "px-4 py-3 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export default function Button({
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={button({ variant, size, className })} {...props} />
  );
}
