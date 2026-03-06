import type { FollowUpQuestionBuilder } from "../types"

export const followUpMiddleSchool: FollowUpQuestionBuilder = ({ answer }) => {
  const startDate = answer.start_date as string | undefined
  const endDate = answer.end_date as string | undefined

  return [
    {
      name: "middle_school_details",
      title: "中学校時代の思い出",
      fields: [
        { name: "club", binding: "name", label: "部活動", type: "text", autoFocus: true },
        { name: "hobby", binding: null, label: "趣味・好きだったこと", type: "text" },
        { name: "start_date", binding: "startDate", label: "開始時期", type: "date", default: startDate },
        { name: "end_date", binding: "endDate", label: "終了時期", type: "date", default: endDate },
      ],
      row: 1,
      startDate,
      endDate,
    },
  ]
}
