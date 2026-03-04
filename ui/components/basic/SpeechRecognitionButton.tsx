import { RiMic2Line, RiStopFill } from "react-icons/ri"

type Props = {
  isListening: boolean
  disabled?: boolean
  onStart: () => void
  onStop: () => void
}

export default function SpeechRecognitionButton({ isListening, disabled, onStart, onStop }: Props) {
  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className={`shrink-0 rounded-full p-2 transition-colors ${
        isListening
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "text-foreground/60 hover:bg-foreground/10"
      } disabled:opacity-40`}
      aria-label={isListening ? "音声入力を停止" : "音声入力を開始"}
    >
      {isListening ? <RiStopFill size={20} /> : <RiMic2Line size={20} />}
    </button>
  )
}
