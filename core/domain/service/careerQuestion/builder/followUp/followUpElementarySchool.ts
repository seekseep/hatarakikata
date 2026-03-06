import type { FollowUpQuestionBuilder } from "../types"

export const followUpElementarySchool: FollowUpQuestionBuilder = ({ answer }) => {
  const startDate = answer.start_date as string | undefined
  const endDate = answer.end_date as string | undefined

  return [
    {
      name: "elementary_school_details",
      title: "小学校時代の思い出",
      fields: [
        { name: "hobby", binding: "name", label: "好きだったこと・趣味", type: "text", autoFocus: true },
        { name: "lesson", binding: null, label: "習い事", type: "text" },
        { name: "start_date", binding: "startDate", label: "開始時期", type: "date", default: startDate },
        { name: "end_date", binding: "endDate", label: "終了時期", type: "date", default: endDate },
      ],
      row: 1,
      startDate,
      endDate,
    },
  ]
}
