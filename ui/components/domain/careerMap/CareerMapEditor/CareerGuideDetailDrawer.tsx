"use client"

import { RiArrowLeftLine, RiExternalLinkLine } from "react-icons/ri"
import ReactMarkdown from "react-markdown"

import type { CareerGuideNextAction } from "@/core/domain"
import Spinner from "@/ui/components/basic/Spinner"
import { useCareerGuideQuery } from "@/ui/hooks/careerGuide"

export default function CareerGuideDetailDrawer({
  guideId,
  onBack,
}: {
  guideId: string
  onBack: () => void
}) {
  const guideQuery = useCareerGuideQuery(guideId)
  const guide = guideQuery.data

  return (
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
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{guide.content}</ReactMarkdown>
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-6">
              <h3 className="text-base font-bold mb-4">取るべきアクション</h3>
              <div className="flex flex-col gap-3">
                {guide.nextActions.map((action: CareerGuideNextAction, index: number) => (
                  <a
                    key={index}
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border border-foreground/10 px-4 py-3 hover:bg-foreground/5 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60">
                          {action.type === "learning" ? "学習" : "転職"}
                        </span>
                        <span className="text-sm font-semibold text-foreground/80">{action.title}</span>
                      </div>
                      <p className="text-xs text-foreground/60 mt-1">{action.description}</p>
                    </div>
                    <RiExternalLinkLine className="text-foreground/40 shrink-0 mt-1" size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
