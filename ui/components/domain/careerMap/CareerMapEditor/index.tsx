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
        open={editor.state.mode.type === 'viewer'}
        careerMapId={editor.state.mode.type === 'viewer' ? editor.state.mode.careerMapId : ''}
        userName={editor.state.mode.type === 'viewer' ? editor.state.mode.userName : undefined}
        onClose={() => editor.dispatch(closeDialog())}
        onCreateCareerGuide={() => editor.dispatch(
          openConfirmDialog(
            "このキャリアマップをもとにガイドを作成しますか？",
            requestCreateCareerGuide(editor.state.mode.type === 'viewer' ? editor.state.mode.careerMapId : ''),
          )
        )}
      />

      <CarrerMapRequestBirthdayDialog
        open={editor.state.mode.type === 'required-start-date'}
      />

      <CareerMapEventDialog
        open={editor.state.mode.type === 'create-dialog' || editor.state.mode.type === 'edit-dialog'}
        onClose={() => editor.dispatch(closeDialog())}
      />
      <CareerMapEventGenerateDialog
        open={editor.state.mode.type === 'generate-dialog'}
        onClose={() => editor.dispatch(closeDialog())}
      />
      <ImportCareerMapDialog
        open={editor.state.mode.type === 'json-import-dialog'}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <ConfirmDialog
        open={editor.state.mode.type === 'confirm-dialog'}
        message={editor.state.mode.type === 'confirm-dialog' ? editor.state.mode.message : ''}
        onCancel={() => editor.dispatch(closeDialog())}
        onConfirm={handleConfirmAction}
      />

      <CareerGuidePromptDialog
        open={editor.state.mode.type === 'career-guide-prompt-dialog'}
        onClose={() => editor.dispatch(closeDialog())}
        onSearch={() => editor.dispatch(openSearchDrawer())}
      />

      <CareerQuestionAnswerDialog
        open={editor.state.mode.type === 'question-answer-dialog'}
        question={editor.state.mode.type === 'question-answer-dialog' ? editor.state.mode.question : null}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerMapSearchDrawer
        open={editor.state.mode.type === 'search-drawer'}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerQuestionDrawer
        open={editor.state.mode.type === 'questions-drawer'}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerGuidesDrawer
        open={editor.state.mode.type === 'career-guides-drawer'}
        onClose={() => editor.dispatch(closeDialog())}
      />

      <CareerGuideDetailDrawer
        open={editor.state.mode.type === 'career-guide-detail-drawer'}
        guideId={editor.state.mode.type === 'career-guide-detail-drawer' ? editor.state.mode.guideId : ''}
        onBack={() => editor.dispatch(closeDialog())}
      />

      <CareerGuideCreatingDialog
        open={editor.state.mode.type === 'creating-career-guide'}
        baseCareerMapId={editor.state.mode.type === 'creating-career-guide' ? editor.state.mode.baseCareerMapId : ''}
        guideCareerMapId={careerMapId}
        onClose={() => editor.dispatch(closeDialog())}
        onCreated={(guideId) => editor.dispatch(openCareerGuideDetailDrawer(guideId))}
      />
    </CarrerMapEditorProvider>
  )
}
