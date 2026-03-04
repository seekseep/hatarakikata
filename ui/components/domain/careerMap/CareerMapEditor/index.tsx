"use client"

import { useCallback, useEffect, useState } from "react"

import Drawer from "@/ui/components/basic/Drawer"
import Spinner from "@/ui/components/basic/Spinner"
import CareerMapViewer from "@/ui/components/domain/careerMap/CareerMapViewer"
import {
  useCareerEventsByCareerMapIdQuery,
  useCreateCareerEventMutation,
  useDeleteCareerEventMutation,
  useUpdateCareerEventMutation,
} from "@/ui/hooks/careerEvent"
import { useCreateCareerGuideMutation, useMyCareerGuidesQuery } from "@/ui/hooks/careerGuide"
import { useCareerMapQuery, useUpdateCareerMapMutation } from "@/ui/hooks/careerMap"
import { useCareerQuestionsQuery, useInitializeQuestionsMutation } from "@/ui/hooks/careerQuestion"

import { closeDialog, openConfirmDialog, openSearchDrawer, requestCreateCareerGuide } from "../actions/dialogActions"
import CarrerMapToolBar from "../CarrerMapToolBar"
import { useCarrerMapEditor } from "../hooks/useCarrerMapEditor"
import CareerGuidePromptDialog from "./CareerGuidePromptDialog"
import ConfirmDialog from "./ConfirmDialog"
import CareerGuideDetailDrawer from "./CareerGuideDetailDrawer"
import CareerGuidesDrawer from "./CareerGuidesDrawer"
import CareerMapEventDialog from "./CareerMapEventDialog"
import CareerMapEventGenerateDialog from "./CareerMapEventGenerateDialog"
import CareerMapSearchDrawer from "./CareerMapSearchDrawer"
import CareerQuestionAnswerDialog from "./CareerQuestionAnswerDialog"
import CareerQuestionDrawer from "./CareerQuestionDrawer"
import CarrerMapCanvas from "./CarrerMapCanvas"
import CarrerMapCanvasActions from "./CarrerMapCanvasActions"
import CarrerMapCanvasPlaceholder from "./CarrerMapCanvasPlaceholder"
import CarrerMapEditorContainer from "./CarrerMapEditorContainer"
import { CarrerMapEditorProvider } from "./CarrerMapEditorProvider"
import CarrerMapErrorBanner from "./CarrerMapErrorBanner"
import CarrerMapRequestBirthdayDialog from "./CarrerMapRequestBirthdayDialog"
import ImportCareerMapDialog from "./ImportCareerMapDialog"

type CareerMapEditorProps = {
  careerMapId: string
}

export default function CarrerMapEditor({ careerMapId }: CareerMapEditorProps) {
  const careerMapQuery = useCareerMapQuery(careerMapId)
  const careerEventsQuery = useCareerEventsByCareerMapIdQuery(careerMapId)
  const updateCareerMapMutation = useUpdateCareerMapMutation()
  const createCareerEventMutation = useCreateCareerEventMutation()
  const updateCareerEventMutation = useUpdateCareerEventMutation()
  const deleteCareerEventMutation = useDeleteCareerEventMutation()

  const createCareerGuideMutation = useCreateCareerGuideMutation()
  const careerGuidesQuery = useMyCareerGuidesQuery()
  const [isCreatingCareerGuide, setIsCreatingCareerGuide] = useState(false)

  const questionsQuery = useCareerQuestionsQuery()
  const initQuestionsMutation = useInitializeQuestionsMutation()

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
    updateCareerMapMutation,
    createCareerEventMutation,
    updateCareerEventMutation,
    deleteCareerEventMutation,
  })

  const handleCreateCareerGuide = useCallback((baseCareerMapId: string) => {
    editor.dispatch(closeDialog())
    setIsCreatingCareerGuide(true)
    createCareerGuideMutation.mutate(
      {
        baseCareerMapId,
        guideCareerMapId: careerMapId,
      },
      {
        onSuccess: () => {
          careerGuidesQuery.refetch()
          setIsCreatingCareerGuide(false)
        },
        onError: () => {
          setIsCreatingCareerGuide(false)
        },
      },
    )
  }, [editor, createCareerGuideMutation, careerGuidesQuery, careerMapId])

  const handleConfirmAction = useCallback(() => {
    if (editor.state.mode.type !== 'confirm-dialog') return
    const action = editor.state.mode.confirmAction
    if (action.type === 'REQUEST_CREATE_CAREER_GUIDE') {
      handleCreateCareerGuide(action.careerMapId)
      return
    }
    editor.dispatch(action)
  }, [editor, handleCreateCareerGuide])

  return (
    <CarrerMapEditorProvider value={editor}>
      <CarrerMapEditorContainer>
        {editor.state.status === 'loading' && (
          <div className="flex items-center justify-center w-full h-full">
            <Spinner />
          </div>
        )}

        {editor.state.status === 'required-start-date' && (
          <CarrerMapRequestBirthdayDialog />
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

        {isCreatingCareerGuide && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80">
            <Spinner />
            <p className="mt-3 text-sm text-foreground/70">ガイドを作成中</p>
          </div>
        )}

        <CarrerMapErrorBanner />

        <CareerMapEventDialog />
        <CareerMapEventGenerateDialog />
        <ImportCareerMapDialog />
      </CarrerMapEditorContainer>

      <Drawer open={editor.state.mode.type === 'viewer'} onClose={() => editor.dispatch(closeDialog())} fullWidth>
        {editor.state.mode.type === 'viewer' && (
          <CareerMapViewer
            careerMapId={editor.state.mode.careerMapId}
            userName={editor.state.mode.userName}
            onClose={() => editor.dispatch(closeDialog())}
            onCreateCareerGuide={() => editor.dispatch(
              openConfirmDialog(
                "このキャリアマップをもとにガイドを作成しますか？",
                requestCreateCareerGuide(editor.state.mode.type === 'viewer' ? editor.state.mode.careerMapId : ''),
              )
            )}
          />
        )}
      </Drawer>

      {editor.state.mode.type === 'confirm-dialog' && (
        <ConfirmDialog
          message={editor.state.mode.message}
          onCancel={() => editor.dispatch(closeDialog())}
          onConfirm={handleConfirmAction}
        />
      )}

      {editor.state.mode.type === 'career-guide-prompt-dialog' && (
        <CareerGuidePromptDialog
          onClose={() => editor.dispatch(closeDialog())}
          onSearch={() => editor.dispatch(openSearchDrawer())}
        />
      )}

      <Drawer open={editor.state.mode.type === 'search-drawer'} onClose={() => editor.dispatch(closeDialog())}>
        {editor.state.mode.type === 'search-drawer' && (
          <CareerMapSearchDrawer onClose={() => editor.dispatch(closeDialog())} />
        )}
      </Drawer>

      <Drawer open={editor.state.mode.type === 'questions-drawer'} onClose={() => editor.dispatch(closeDialog())}>
        {editor.state.mode.type === 'questions-drawer' && (
          <CareerQuestionDrawer onClose={() => editor.dispatch(closeDialog())} />
        )}
      </Drawer>

      {editor.state.mode.type === 'question-answer-dialog' && (
        <CareerQuestionAnswerDialog
          question={editor.state.mode.question}
          onClose={() => editor.dispatch(closeDialog())}
        />
      )}

      <Drawer open={editor.state.mode.type === 'career-guides-drawer'} onClose={() => editor.dispatch(closeDialog())}>
        {editor.state.mode.type === 'career-guides-drawer' && (
          <CareerGuidesDrawer onClose={() => editor.dispatch(closeDialog())} />
        )}
      </Drawer>

      <Drawer open={editor.state.mode.type === 'career-guide-detail-drawer'} onClose={() => editor.dispatch(closeDialog())} fullWidth>
        {editor.state.mode.type === 'career-guide-detail-drawer' && (
          <CareerGuideDetailDrawer
            guideId={editor.state.mode.guideId}
            onBack={() => editor.dispatch(closeDialog())}
          />
        )}
      </Drawer>
    </CarrerMapEditorProvider>
  )
}
