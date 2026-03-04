"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList
  resultIndex: number
}

type SpeechRecognitionErrorEvent = {
  error: string
}

type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

function createSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null
  const SR =
    (window as unknown as Record<string, unknown>).SpeechRecognition ??
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  if (!SR) return null
  return new (SR as new () => SpeechRecognitionInstance)()
}

const BAR_COUNT = 16

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false
    return !!(
      (window as unknown as Record<string, unknown>).SpeechRecognition ??
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    )
  })
  const [audioLevels, setAudioLevels] = useState<number[]>(() => new Array(BAR_COUNT).fill(0))
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const onResultRef = useRef(onResult)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  const stopAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    mediaStreamRef.current = null
    audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
    setAudioLevels(new Array(BAR_COUNT).fill(0))
  }, [])

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const ctx = new AudioContext()
      audioContextRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const update = () => {
        analyser.getByteFrequencyData(dataArray)
        const step = Math.floor(dataArray.length / BAR_COUNT)
        const levels = Array.from({ length: BAR_COUNT }, (_, i) => {
          const value = dataArray[i * step] ?? 0
          return value / 255
        })
        setAudioLevels(levels)
        rafRef.current = requestAnimationFrame(update)
      }
      rafRef.current = requestAnimationFrame(update)
    } catch {
      // マイク取得失敗時は波形なしで続行
    }
  }, [])

  const start = useCallback(() => {
    const recognition = createSpeechRecognition()
    if (!recognition) return

    recognition.lang = "ja-JP"
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event) => {
      let text = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript
        }
      }
      if (text) {
        onResultRef.current(text)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      recognitionRef.current = null
      stopAudio()
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
      stopAudio()
    }

    recognitionRef.current = recognition
    recognition.start()
    startAudio()
    setIsListening(true)
  }, [startAudio, stopAudio])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    stopAudio()
    setIsListening(false)
  }, [stopAudio])

  return { isListening, isSupported, audioLevels, start, stop }
}
