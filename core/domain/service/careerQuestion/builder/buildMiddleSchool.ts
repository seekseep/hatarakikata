import { schoolEndMarch, schoolStartApril } from "../utils/date"
import type { QuestionBuilder } from "./types"

export const buildMiddleSchool: QuestionBuilder = ({ careerMap }) => {
  const birthDate = careerMap.startDate
  const startDefault = birthDate ? schoolStartApril(birthDate, 12) : undefined
  const endDefault = birthDate ? schoolEndMarch(birthDate, 15) : undefined

  return {
    name: "middle_school",
    title: "中学校",
    fields: [
      { name: "school_name", binding: "name", label: "中学校の名前", type: "text" },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date", default: startDefault },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date", default: endDefault },
    ],
    row: 0,
    startDate: startDefault,
    endDate: endDefault,
  }
}
