"use client"

import { useRef, useState } from "react"
import { RiCodeLine } from "react-icons/ri"

import { openJsonImportDialog } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import { actionButtonStyle } from "./ActionButton"

export default function DevMenuButton() {
  const { dispatch } = useCarrerMapEditorContext()
  const [devMenuOpen, setDevMenuOpen] = useState(false)
  const devButtonRef = useRef<HTMLButtonElement>(null)

  const handleDevMenuItemClick = (action: () => void) => {
    setDevMenuOpen(false)
    action()
  }

  return (
    <div className="relative">
      <button
        ref={devButtonRef}
        type="button"
        title="開発メニュー"
        className={actionButtonStyle()}
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
              onClick={() => handleDevMenuItemClick(() => dispatch(openJsonImportDialog()))}
            >
              JSONイベントインポート
            </button>
          </div>
        </>
      )}
    </div>
  )
}
