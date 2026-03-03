"use client"

import { useRef, useState } from "react"
import { RiAddLine, RiCodeLine, RiSearchLine, RiSparklingLine } from "react-icons/ri"
import { tv } from "tailwind-variants"

import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"

const actionButton = tv({
  base: "rounded-full w-10 h-10 inline-flex items-center justify-center transition-colors cursor-pointer",
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

export default function CarrerMapCanvasActions() {
  const { dispatch } = useCarrerMapEditorContext()
  const [devMenuOpen, setDevMenuOpen] = useState(false)
  const devButtonRef = useRef<HTMLButtonElement>(null)

  const handleDevMenuItemClick = (action: () => void) => {
    setDevMenuOpen(false)
    action()
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-white rounded-full shadow-lg p-1.5">
      <div className="relative">
        <button
          ref={devButtonRef}
          type="button"
          className={actionButton()}
          onClick={() => setDevMenuOpen((v) => !v)}
        >
          <RiCodeLine className="text-xl" />
        </button>
        {devMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDevMenuOpen(false)}
            />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg border border-foreground/10 py-1 min-w-max">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm hover:bg-foreground/5 transition-colors"
                onClick={() => handleDevMenuItemClick(() => dispatch({ type: 'OPEN_JSON_IMPORT_DIALOG' }))}
              >
                JSONイベントインポート
              </button>
            </div>
          </>
        )}
      </div>
      <button type="button" className={actionButton()} onClick={() => dispatch({ type: 'OPEN_SEARCH_DIALOG' })}>
        <RiSearchLine className="text-xl" />
      </button>
      <button
        type="button"
        className={actionButton()}
        onClick={() => dispatch({ type: 'OPEN_GENERATE_DIALOG' })}
      >
        <RiSparklingLine className="text-xl" />
      </button>
      <button
        type="button"
        className={actionButton({ variant: "primary" })}
        onClick={() => dispatch({ type: 'ENTER_PLACEMENT' })}>
        <RiAddLine className="text-xl" />
      </button>
    </div>
  )
}
