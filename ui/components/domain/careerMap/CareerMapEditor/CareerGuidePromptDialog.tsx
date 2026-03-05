type CareerGuidePromptDialogProps = {
  open: boolean
  onClose: () => void
  onSearch: () => void
}

export default function CareerGuidePromptDialog({ open, onClose, onSearch }: CareerGuidePromptDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-foreground/80 mb-4">
          類似のマップを検索して、マップからガイドを作成しましょう
        </p>
        <button
          type="button"
          className="w-full rounded-full bg-primary-500 text-white py-2 text-sm font-semibold hover:bg-primary-600 transition-colors"
          onClick={onSearch}
        >
          マップを検索する
        </button>
      </div>
    </div>
  )
}
