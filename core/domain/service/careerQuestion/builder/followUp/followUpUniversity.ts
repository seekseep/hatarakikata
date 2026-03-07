import type { FollowUpQuestionBuilder } from "../types"

export const followUpUniversity: FollowUpQuestionBuilder = ({ answer }) => {
  if (answer.enrolled !== "はい") return []

  const startDate = answer.start_date as string | undefined
  const endDate = answer.end_date as string | undefined

  return [
    {
      name: "university_details",
      title: "大学・専門学校時代の思い出",
      fields: [
        { name: "major", binding: "name", label: "専攻・学部", type: "text", autoFocus: true },
        { name: "circle", binding: null, label: "サークル・部活", type: "text" },
        { name: "parttime", binding: null, label: "アルバイト", type: "text" },
        { name: "start_date", binding: "startDate", label: "開始時期", type: "date", default: startDate },
        { name: "end_date", binding: "endDate", label: "終了時期", type: "date", default: endDate },
        { name: "event_type", binding: "type", label: "種類", type: "hidden", options: ["living", "working", "feeling"], default: "feeling" },
      ],
      row: 1,
      startDate,
      endDate,
    },
  ]
}
