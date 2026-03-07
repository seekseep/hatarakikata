import { schoolEndMarch, schoolStartApril } from "../utils/date"
import type { QuestionBuilder } from "./types"

export const buildElementarySchool: QuestionBuilder = ({ careerMap }) => {
  const birthDate = careerMap.startDate
  const startDefault = birthDate ? schoolStartApril(birthDate, 6) : undefined
  const endDefault = birthDate ? schoolEndMarch(birthDate, 12) : undefined

  return {
    name: "elementary_school",
    title: "小学校",
    fields: [
      { name: "school_name", binding: "name", label: "小学校の名前", type: "text", autoFocus: true },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date", default: startDefault },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date", default: endDefault },
      { name: "event_type", binding: "type", label: "種類", type: "hidden", options: ["living", "working", "feeling"], default: "living" },
    ],
    row: 0,
    startDate: startDefault,
    endDate: endDefault,
  }
}
