"use client"

import { type ReactNode, useCallback, useEffect } from "react"

type DrawerProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Drawer({ open, onClose, children }: DrawerProps) {
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
        className={[
          "fixed inset-0 z-9999 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={[
          "fixed top-0 right-0 z-9999 h-full w-full sm:max-w-md bg-background shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  )
}
