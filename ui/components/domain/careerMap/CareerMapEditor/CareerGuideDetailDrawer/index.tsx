"use client"

import { RiArrowLeftLine } from "react-icons/ri"

import Drawer from "@/ui/components/basic/Drawer"
import MarkdownRenderer from "@/ui/components/basic/MarkdownRenderer"
import Spinner from "@/ui/components/basic/Spinner"
import { useCareerGuideQuery } from "@/ui/hooks/careerGuide"

import CareerGuideNextActionLink from "./CareerGuideNextActionLink"

export default function CareerGuideDetailDrawer({
  open,
  guideId,
  onBack,
}: {
  open: boolean
  guideId: string
  onBack: () => void
}) {
  const guideQuery = useCareerGuideQuery(guideId)
  const guide = guideQuery.data

  return (
    <Drawer open={open} onClose={onBack} fullWidth>
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
          aria-label="戻る"
        >
          <RiArrowLeftLine size={20} />
        </button>
        <h2 className="text-sm font-semibold text-foreground/70">ガイド詳細</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {guideQuery.isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {guide && (
          <div className="p-6 max-w-2xl mx-auto w-full">
            <MarkdownRenderer>{guide.content}</MarkdownRenderer>

            <div className="mt-8 border-t border-foreground/10 pt-6">
              <h3 className="text-base font-bold mb-4">取るべきアクション</h3>
              <div className="flex flex-col gap-3">
                {guide.nextActions.map((action, index) => (
                  <CareerGuideNextActionLink key={index} action={action} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Drawer>
  )
}
