import type { ReactNode } from "react"
import { tv } from "tailwind-variants"

export const actionButtonStyle = tv({
  base: "relative group rounded-full w-10 h-10 inline-flex items-center justify-center transition-colors cursor-pointer",
  variants: {
    variant: {
      default:
        "text-foreground/60 hover:bg-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed",
      primary: "bg-primary-500 text-white hover:bg-primary-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export default function ActionButton({
  tooltip,
  icon,
  variant = "default",
  onClick,
  badge,
}: {
  tooltip: string
  icon: ReactNode
  variant?: "default" | "primary"
  onClick: () => void
  badge?: ReactNode
}) {
  return (
    <div className="relative">
      <button type="button" className={actionButtonStyle({ variant })} onClick={onClick}>
        {icon}
        <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {tooltip}
        </span>
      </button>
      {badge}
    </div>
  )
}
