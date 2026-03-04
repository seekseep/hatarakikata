import { schoolEndMarch, schoolStartApril } from "../utils/date"
import type { QuestionBuilder } from "./types"

export const buildHighSchool: QuestionBuilder = ({ careerMap }) => {
  const birthDate = careerMap.startDate
  const startDefault = birthDate ? schoolStartApril(birthDate, 15) : undefined
  const endDefault = birthDate ? schoolEndMarch(birthDate, 18) : undefined

  const enrolledCondition = { and: [{ name: "enrolled", value: "はい" }] }

  return {
    name: "high_school",
    title: "高校",
    fields: [
      { name: "enrolled", binding: null, label: "高校に進学しましたか？", type: "radio", options: ["はい", "いいえ"] },
      { name: "category", binding: null, label: "種別", type: "select", options: ["普通科高校", "工業高校", "商業高校", "高等専門学校"], condition: enrolledCondition },
      { name: "school_name", binding: "name", label: "学校名", type: "text", condition: enrolledCondition },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date", default: startDefault, condition: enrolledCondition },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date", default: endDefault, condition: enrolledCondition }
    ],
    row: 0,
    startDate: startDefault,
    endDate: endDefault,
  }
}
