import {
  RiBriefcaseLine,
  RiBookOpenLine,
  RiGraduationCapLine,
  RiGroupLine,
  RiSmartphoneLine,
  RiExternalLinkLine,
} from "react-icons/ri"

import type { CareerGuideNextAction } from "@/core/domain"

const ACTION_CONFIG = {
  "job-change": { icon: RiBriefcaseLine, label: "転職", color: "bg-red-50 border-red-200 text-red-700" },
  "course": { icon: RiGraduationCapLine, label: "受講", color: "bg-blue-50 border-blue-200 text-blue-700" },
  "book": { icon: RiBookOpenLine, label: "書籍", color: "bg-amber-50 border-amber-200 text-amber-700" },
  "community": { icon: RiGroupLine, label: "コミュニティ", color: "bg-green-50 border-green-200 text-green-700" },
  "app": { icon: RiSmartphoneLine, label: "アプリ", color: "bg-purple-50 border-purple-200 text-purple-700" },
} as const

const FALLBACK_CONFIG = { icon: RiBookOpenLine, label: "その他", color: "bg-foreground/5 border-foreground/10 text-foreground/60" }

export default function CareerGuideNextActionLink({ action }: { action: CareerGuideNextAction }) {
  const config = ACTION_CONFIG[action.type] ?? FALLBACK_CONFIG
  const Icon = config.icon

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 rounded-lg border border-foreground/10 px-4 py-3 hover:bg-foreground/5 transition-colors"
    >
      <Icon className="text-foreground/50 shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${config.color}`}>
            {config.label}
          </span>
          <span className="text-sm font-semibold text-foreground/80">{action.title}</span>
        </div>
        <p className="text-xs text-foreground/60 mt-1">{action.description}</p>
      </div>
      <RiExternalLinkLine className="text-foreground/40 shrink-0 mt-1" size={16} />
    </a>
  )
}
