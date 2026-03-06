"use client"

import { useState } from "react"

import Alert from "@/ui/components/basic/Alert"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import { useCareerMapQuery, useUpdateCareerMapMutation } from "@/ui/hooks/careerMap"

import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"
import { DEFAULT_YEAR_RANGE_START } from "./constants"
import DayStep from "./DayStep"
import MonthStep from "./MonthStep"
import { stepIndicator } from "./styles"
import { Step } from "./types"
import YearStep from "./YearStep"

type CarrerMapRequestBirthdayDialogProps = {
  open: boolean
  onComplete?: () => void
}

export default function CarrerMapRequestBirthdayDialog({ open, onComplete }: CarrerMapRequestBirthdayDialogProps) {
  const { state: { careerMapId } } = useCarrerMapEditorContext()
  const careerMapQuery = useCareerMapQuery(careerMapId)
  const updateCareerMapMutation = useUpdateCareerMapMutation()
  const [step, setStep] = useState<Step>("year")
  const [year, setYear] = useState<number | null>(null)
  const [month, setMonth] = useState<number | null>(null)
  const [day, setDay] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelectYear = (y: number) => {
    setYear(y)
    setMonth(null)
    setDay(null)
    setStep("month")
  }

  const handleSelectMonth = (m: number) => {
    setMonth(m)
    setDay(null)
    setStep("day")
  }

  const handleSelectDay = (d: number) => {
    setDay(d)
  }

  const handleSubmit = () => {
    if (!year || !month || !day) {
      setError("生年月日を入力してください")
      return
    }
    setError(null)
    const m = String(month).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    const startDate = `${year}-${m}-${d}`
    const data = { id: careerMapId, startDate }
    updateCareerMapMutation.mutate(data, {
      onSuccess () {
        careerMapQuery.refetch()
        onComplete?.()
      }
    })
  }

  const stepLabel = step === "year" ? "年" : step === "month" ? "月" : "日"

  return (
    <Dialog open={open} onClose={() => {}} className="w-full max-w-sm">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">生年月日を選択してください</h2>

        <div className="flex items-center gap-1 justify-center">
          <button
            type="button"
            onClick={() => { setStep("year"); setMonth(null); setDay(null) }}
            className={stepIndicator({ active: step === "year", interactive: true })}
          >
            <span className="text-2xl mr-1">{year ?? '----'}</span>
            <span className="text-lg">年</span>
          </button>
          <span className="text-foreground/30">/</span>
          <button
            type="button"
            onClick={() => { if (year) { setStep("month"); setDay(null) } }}
            disabled={!year}
            className={stepIndicator({ active: step === "month", interactive: true })}
          >
            <span className="text-2xl mr-1">{month ?? '--'}</span>
            <span className="text-lg">月</span>
          </button>
          <span className="text-foreground/30">/</span>
          <span className={stepIndicator({ active: step === "day" })}>
            <span className="text-2xl mr-1">{day ?? '--'}</span>
            <span className="text-lg">日</span>
          </span>
        </div>

        <div className="text-sm font-medium text-foreground/60">{stepLabel}を選んでください</div>

        <div className="min-h-52">
          {step === "year" && (
            <YearStep value={year} initialRangeStart={DEFAULT_YEAR_RANGE_START} onChange={handleSelectYear} />
          )}
          {step === "month" && (
            <MonthStep value={month} onChange={handleSelectMonth} />
          )}
          {step === "day" && year && month && (
            <DayStep year={year} month={month} value={day} onChange={handleSelectDay} />
          )}
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={updateCareerMapMutation.isPending}
          >
            {updateCareerMapMutation.isPending ? "送信中..." : "確定"}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
