import type { FollowUpQuestionBuilder } from "../types"

export const followUpHighSchool: FollowUpQuestionBuilder = ({ answer }) => {
  if (answer.enrolled !== "はい") return []

  const startDate = answer.start_date as string | undefined
  const endDate = answer.end_date as string | undefined

  return [
    {
      name: "high_school_details",
      title: "高校時代の思い出",
      fields: [
        { name: "club", binding: "name", label: "部活動", type: "text", autoFocus: true },
        { name: "parttime", binding: null, label: "アルバイト", type: "text" },
        { name: "hobby", binding: null, label: "趣味・好きだったこと", type: "text" },
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
