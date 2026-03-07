import { schoolEndMarch, schoolStartApril } from "../utils/date"
import type { QuestionBuilder } from "./types"

export const buildUniversity: QuestionBuilder = ({ careerMap }) => {
  const birthDate = careerMap.startDate
  const startDefault = birthDate ? schoolStartApril(birthDate, 18) : undefined
  const endDefault = birthDate ? schoolEndMarch(birthDate, 22) : undefined

  const enrolledCondition = { and: [{ name: "enrolled", value: "はい" }] }

  return {
    name: "university",
    title: "大学・専門学校",
    fields: [
      { name: "enrolled", binding: null, label: "大学・専門学校等に進学しましたか？", type: "radio", options: ["はい", "いいえ"] },
      { name: "category", binding: null, label: "種別", type: "select", options: ["大学", "短期大学", "専門学校"], condition: enrolledCondition },
      { name: "school_name", binding: "name", label: "学校名", type: "text", condition: enrolledCondition },
      { name: "start_date", binding: "startDate", label: "入学年月", type: "date", default: startDefault, condition: enrolledCondition },
      { name: "end_date", binding: "endDate", label: "卒業年月", type: "date", default: endDefault, condition: enrolledCondition },
      { name: "event_type", binding: "type", label: "種類", type: "hidden", options: ["living", "working", "feeling"], default: "living", condition: enrolledCondition },
    ],
    row: 0,
    startDate: startDefault,
    endDate: endDefault,
  }
}
