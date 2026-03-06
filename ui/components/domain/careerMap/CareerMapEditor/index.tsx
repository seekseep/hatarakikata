"use client"

import { useCallback, useEffect } from "react"

import Spinner from "@/ui/components/basic/Spinner"
import {
  useCareerEventsByCareerMapIdQuery,
  useUpdateCareerEventMutation,
} from "@/ui/hooks/careerEvent"
import { useCareerMapQuery } from "@/ui/hooks/careerMap"
import { useCareerQuestionsQuery, useInitializeQuestionsMutation } from "@/ui/hooks/careerQuestion"

import { closeDialog, openCareerGuideDetailDrawer, openConfirmDialog, openSearchDrawer, requestCreateCareerGuide } from "../actions/dialogActions"
import CarrerMapToolBar from "../CarrerMapToolBar"
import { useCarrerMapEditor } from "../hooks/useCarrerMapEditor"
import CareerGuideCreatingDialog from "./CareerGuideCreatingDialog"
import CareerGuideDetailDrawer from "./CareerGuideDetailDrawer"
import CareerGuidePromptDialog from "./CareerGuidePromptDialog"
import CareerGuidesDrawer from "./CareerGuidesDrawer"
import CareerMapEventDialog from "./CareerMapEventDialog"
import CareerMapEventGenerateDialog from "./CareerMapEventGenerateDialog"
import CareerMapSearchDrawer from "./CareerMapSearchDrawer"
import CareerMapViewerDrawer from "./CareerMapViewerDrawer"
import CareerQuestionAnswerDialog from "./CareerQuestionAnswerDialog"
import CareerQuestionDrawer from "./CareerQuestionDrawer"
import CarrerMapCanvas from "./CarrerMapCanvas"
import CarrerMapCanvasActions from "./CarrerMapCanvasActions"
import CarrerMapCanvasPlaceholder from "./CarrerMapCanvasPlaceholder"
import CarrerMapEditorContainer from "./CarrerMapEditorContainer"
import { CarrerMapEditorProvider } from "./CarrerMapEditorProvider"
import CarrerMapErrorBanner from "./CarrerMapErrorBanner"
import CarrerMapRequestBirthdayDialog from "./CarrerMapRequestBirthdayDialog"
import ConfirmDialog from "./ConfirmDialog"
import {
  getCareerGuideDetailDrawerGuideId,
  getCareerGuideDetailDrawerOpen,
  getCareerGuidePromptDialogOpen,
  getCareerGuidesDrawerOpen,
  getConfirmDialogMessage,
  getConfirmDialogOpen,
  getCreatingCareerGuideBaseCareerMapId,
  getCreatingCareerGuideOpen,
  getEventDialogOpen,
  getGenerateDialogOpen,
  getJsonImportDialogOpen,
  getQuestionAnswerDialogKey,
  getQuestionAnswerDialogOpen,
  getQuestionAnswerDialogQuestion,
  getQuestionsDrawerOpen,
  getRequiredStartDateOpen,
  getSearchDrawerOpen,
  getViewerCareerMapId,
  getViewerOpen,
  getViewerUserName,
} from "./helpers"
import ImportCareerMapDialog from "./ImportCareerMapDialog"

type CareerMapEditorProps = {
  careerMapId: string
}

export default function CarrerMapEditor({ careerMapId }: CareerMapEditorProps) {
  const careerMapQuery = useCareerMapQuery(careerMapId)
  const careerEventsQuery = useCareerEventsByCareerMapIdQuery(careerMapId)
  const updateCareerEventMutation = useUpdateCareerEventMutation()

  const questionsQuery = useCareerQuestionsQuery(careerMapId)
  const initQuestionsMutation = useInitializeQuestionsMutation(careerMapId)

  const needsQuestionInit =
    questionsQuery.error &&
    "status" in questionsQuery.error &&
    (questionsQuery.error as { status: number }).status === 404 &&
    !!careerMapQuery.data?.startDate

  useEffect(() => {
    if (needsQuestionInit && !initQuestionsMutation.isPending) {
      initQuestionsMutation.mutate()
    }
  }, [needsQuestionInit]) // eslint-disable-line react-hooks/exhaustive-deps

  const editor = useCarrerMapEditor({
    careerMapId,
    careerMapQuery,
    careerEventsQuery,
    questionsQuery,
    updateCareerEventMutation,
  })

  const handleConfirmAction = useCallback(() => {
    if (editor.state.mode.type !== 'confirm-dialog') return
    editor.dispatch(editor.state.mode.confirmAction)
  }, [editor])

  const mode = editor.state.mode

  return (
    <CarrerMapEditorProvider value={editor}>
      <CarrerMapEditorContainer>
        {editor.state.status === 'loading' && (
          <div className="flex items-center justify-center w-full h-full">
            <Spinner />
          </div>
        )}

        {editor.state.status === 'ready' ? (
          <>
            <CarrerMapCanvas />
            <CarrerMapCanvasActions />
            <CarrerMapToolBar />
          </>
        ) : (
          <CarrerMapCanvasPlaceholder />
        )}
      </CarrerMapEditorContainer>

      <CarrerMapErrorBanner />

      <CareerMapViewerDrawer
        open={getViewerOpen(mode)}
        careerMapId={getViewerCareerMapId(mode)}
        userName={getViewerUserName(mode)}
        onClose={() => editor.dispatch(closeDialog())}
        onCreateCareerGuide={() => editor.dispatch(
          openConfirmDialog(
            "このキャリアマップをもとにガイドを作成しますか？",
            requestCreateCareerGuide(getViewerCareerMapId(mode)),
          )
        )}
      />

      <CarrerMapRequestBirthdayDialog
        open={getRequiredStartDateOpen(mode)}
        onComplete={() => editor.dispatch(closeDialog())}
      />

      <CareerMapEventDialog
        open={getEventDialogOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />
      <CareerMapEventGenerateDialog
        open={getGenerateDialogOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />
      <ImportCareerMapDialog
        open={getJsonImportDialogOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <ConfirmDialog
        open={getConfirmDialogOpen(mode)}
        message={getConfirmDialogMessage(mode)}
        onCancel={() => editor.dispatch(closeDialog())}
        onConfirm={handleConfirmAction}
      />

      <CareerGuidePromptDialog
        open={getCareerGuidePromptDialogOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
        onSearch={() => editor.dispatch(openSearchDrawer())}
      />

      <CareerQuestionAnswerDialog
        key={getQuestionAnswerDialogKey(mode)}
        open={getQuestionAnswerDialogOpen(mode)}
        question={getQuestionAnswerDialogQuestion(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerMapSearchDrawer
        open={getSearchDrawerOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerQuestionDrawer
        open={getQuestionsDrawerOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerGuidesDrawer
        open={getCareerGuidesDrawerOpen(mode)}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerGuideDetailDrawer
        open={getCareerGuideDetailDrawerOpen(mode)}
        guideId={getCareerGuideDetailDrawerGuideId(mode)}
        onBack={() => editor.dispatch(closeDialog())}
      />

      <CareerGuideCreatingDialog
        open={getCreatingCareerGuideOpen(mode)}
        baseCareerMapId={getCreatingCareerGuideBaseCareerMapId(mode)}
        guideCareerMapId={careerMapId}
        onClose={() => editor.dispatch(closeDialog())}
        onCreated={(guideId) => editor.dispatch(openCareerGuideDetailDrawer(guideId))}
      />
    </CarrerMapEditorProvider>
  )
}
