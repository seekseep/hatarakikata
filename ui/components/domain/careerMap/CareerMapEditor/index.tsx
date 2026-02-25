"use client"

import Drawer from "@/ui/components/basic/Drawer"
import Spinner from "@/ui/components/basic/Spinner"
import CareerMapViewer from "@/ui/components/domain/careerMap/CareerMapViewer"
import {
  useCareerEventsByCareerMapIdQuery,
  useCreateCareerEventMutation,
  useDeleteCareerEventMutation,
  useUpdateCareerEventMutation,
} from "@/ui/hooks/careerEvent"
import { useCareerMapQuery, useUpdateCareerMapMutation } from "@/ui/hooks/careerMap"

import CareerMapEventDialog from "./CareerMapEventDialog"
import CareerMapEventGenerateDialog from "./CareerMapEventGenerateDialog"
import CareerMapJsonImportDialog from "./CareerMapJsonImportDialog"
import CareerMapSearchDialog from "./CareerMapSearchDialog"
import CarrerMapCanvas from "./CarrerMapCanvas"
import CarrerMapCanvasActions from "./CarrerMapCanvasActions"
import CarrerMapCanvasPlaceholder from "./CarrerMapCanvasPlaceholder"
import CarrerMapEditorContainer from "./CarrerMapEditorContainer"
import { CarrerMapEditorProvider } from "./CarrerMapEditorProvider"
import CarrerMapErrorBanner from "./CarrerMapErrorBanner"
import CarrerMapRequestBirthdayDialog from "./CarrerMapRequestBirthdayDialog"
import CarrerMapToolBar from "../CarrerMapToolBar"
import { useCarrerMapEditor } from "../hooks/useCarrerMapEditor"

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

  const editor = useCarrerMapEditor({
    careerMapId,
    careerMapQuery,
    careerEventsQuery,
    updateCareerMapMutation,
    createCareerEventMutation,
    updateCareerEventMutation,
    deleteCareerEventMutation,
  })

  return (
    <CarrerMapEditorProvider value={editor}>
      <CarrerMapEditorContainer>
        {editor.status === 'loading' && (
          <div className="flex items-center justify-center w-full h-full">
            <Spinner />
          </div>
        )}

        {editor.status === 'required-start-date' && (
          <CarrerMapRequestBirthdayDialog />
        )}

        {editor.status === 'ready' ? (
          <>
            <CarrerMapCanvas />
            <CarrerMapCanvasActions />
            <CarrerMapToolBar />
          </>
        ) : (
          <CarrerMapCanvasPlaceholder />
        )}

        <CarrerMapErrorBanner />

        <CareerMapEventDialog />
        <CareerMapEventGenerateDialog />
        <CareerMapSearchDialog />
        <CareerMapJsonImportDialog />
      </CarrerMapEditorContainer>

      <Drawer open={!!editor.viewerCareerMapId} onClose={editor.closeViewer}>
        {editor.viewerCareerMapId && (
          <CareerMapViewer careerMapId={editor.viewerCareerMapId} onClose={editor.closeViewer} />
        )}
      </Drawer>
    </CarrerMapEditorProvider>
  )
}
