import { tv } from "tailwind-variants"

export const stepIndicator = tv({
  base: "rounded px-2 py-1 font-medium",
  variants: {
    active: {
      true: "bg-foreground/10",
      false: "",
    },
    interactive: {
      true: "hover:bg-foreground/5 disabled:opacity-40",
    },
  },
})
