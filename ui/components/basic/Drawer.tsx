"use client"

import { type ReactNode, useCallback, useEffect } from "react"
import { tv } from "tailwind-variants"

const backdrop = tv({
  base: "fixed inset-0 z-9999 bg-black/40 transition-opacity duration-300",
  variants: {
    open: {
      true: "opacity-100 pointer-events-auto",
      false: "opacity-0 pointer-events-none",
    },
  },
})

const panel = tv({
  base: "fixed top-0 right-0 z-9999 h-full bg-background transition-all duration-300",
  variants: {
    open: {
      true: "translate-x-0 shadow-2xl",
      false: "translate-x-full shadow-none",
    },
    fullWidth: {
      true: "w-[calc(100%-3rem)]",
      false: "w-full sm:max-w-md",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
})

type DrawerProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  fullWidth?: boolean
}

export default function Drawer({ open, onClose, children, fullWidth }: DrawerProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  return (
    <>
      {/* Backdrop */}
      <div
        className={backdrop({ open })}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={panel({ open, fullWidth })}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  )
}
