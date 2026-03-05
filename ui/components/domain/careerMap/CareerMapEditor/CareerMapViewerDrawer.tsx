"use client"

import Drawer from "@/ui/components/basic/Drawer"
import CareerMapViewer from "@/ui/components/domain/careerMap/CareerMapViewer"

type CareerMapViewerDrawerProps = {
  open: boolean
  careerMapId: string
  userName?: string
  onClose: () => void
  onCreateCareerGuide: () => void
}

export default function CareerMapViewerDrawer({
  open,
  careerMapId,
  userName,
  onClose,
  onCreateCareerGuide,
}: CareerMapViewerDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} fullWidth>
      <CareerMapViewer
        careerMapId={careerMapId}
        userName={userName}
        onClose={onClose}
        onCreateCareerGuide={onCreateCareerGuide}
      />
    </Drawer>
  )
}
