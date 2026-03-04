type ConfirmDialogProps = {
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ message, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-foreground/80 mb-4">
          {message}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-full border border-foreground/20 py-2 text-sm font-semibold hover:bg-foreground/5 transition-colors"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-primary-500 text-white py-2 text-sm font-semibold hover:bg-primary-600 transition-colors"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
