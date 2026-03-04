"use client"

import { useCallback } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"

import Alert from "@/ui/components/basic/Alert"
import AudioLevelMeter from "@/ui/components/basic/AudioLevelMeter"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import TextAreaField from "@/ui/components/basic/field/TextAreaField"
import SpeechRecognitionButton from "@/ui/components/basic/SpeechRecognitionButton"
import ThinkingOverlay from "@/ui/components/basic/ThinkingOverlay"
import { useGenerateCareerEventsMutation } from "@/ui/hooks/careerEvent"
import { useSpeechRecognition } from "@/ui/hooks/useSpeechRecognition"

import { closeDialog } from "../../actions/dialogActions"
import { addEvents } from "../../actions/eventActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"

type FormValues = {
  input: string
}

export default function CareerMapEventGenerateDialog() {
  const {
    state: { careerMapId, events, mode },
    dispatch,
    updateEvent,
  } = useCarrerMapEditorContext()
  const generateDialogOpen = mode.type === 'generate-dialog'
  const closeGenerateDialog = () => dispatch(closeDialog())

  const form = useForm<FormValues>({
    defaultValues: { input: "" },
  })
  const { handleSubmit, setValue, getValues, reset } = form

  const generateMutation = useGenerateCareerEventsMutation()

  const handleSpeechResult = useCallback((text: string) => {
    setValue("input", getValues("input") + text)
  }, [setValue, getValues])
  const { isListening, isSupported, audioLevels, start: startListening, stop: stopListening } = useSpeechRecognition(handleSpeechResult)

  const handleClose = () => {
    if (generateMutation.isPending) return
    stopListening()
    reset()
    closeGenerateDialog()
  }

  const onSubmit = async (data: FormValues) => {
    const trimmed = data.input.trim()
    if (!trimmed || generateMutation.isPending) return

    stopListening()

    try {
      const result = await generateMutation.mutateAsync({
        careerMapId,
        input: trimmed,
        currentEvents: events,
        previousQuestion: nextQuestion,
      })

      const createdEvents = result.actions
        .filter((a) => a.type === "create")
        .map((a) => a.event)
      const updatedEvents = result.actions
        .filter((a) => a.type === "update")
        .map((a) => a.event)

      if (createdEvents.length > 0) dispatch(addEvents(createdEvents))
      for (const event of updatedEvents) updateEvent(event)

      reset()

      if (!result.nextQuestion) {
        handleClose()
      }
    } catch {
      // error is handled by generateMutation.error
    }
  }

  const nextQuestion = generateMutation.data?.nextQuestion?.content ?? null

  return (
    <Dialog open={generateDialogOpen} onClose={handleClose} className="w-full max-w-md">
      <div className="relative">
        {generateMutation.isPending && <ThinkingOverlay />}
        <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
              aria-label="閉じる"
              disabled={generateMutation.isPending}
            >
              <RxCross2 size={20} />
            </button>
            <h2 className="text-lg font-bold">AIでイベントを生成</h2>
            <div className="w-7" />
          </div>

          <div>
            <TextAreaField
              name="input"
              label="自由入力"
              rules={{ required: true }}
              rows={4}
              placeholder={nextQuestion ? `次の質問: ${nextQuestion}` : "例: 大学卒業後にIT企業に入社してPMになった"}
              disabled={generateMutation.isPending}
            />
            {isSupported && (
              <div className="mt-2 flex items-center gap-2">
                <SpeechRecognitionButton
                  isListening={isListening}
                  disabled={generateMutation.isPending}
                  onStart={startListening}
                  onStop={stopListening}
                />
                {isListening && (
                  <AudioLevelMeter levels={audioLevels} />
                )}
              </div>
            )}
          </div>

          {nextQuestion && (
            <p className="text-sm text-foreground/70">次の質問: {nextQuestion}</p>
          )}

          {generateMutation.error && (
            <Alert variant="error">
              {generateMutation.error instanceof Error
                ? generateMutation.error.message
                : String(generateMutation.error)}
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? "生成中..." : "生成"}
            </Button>
          </div>
        </form>
        </FormProvider>
      </div>
    </Dialog>
  )
}
