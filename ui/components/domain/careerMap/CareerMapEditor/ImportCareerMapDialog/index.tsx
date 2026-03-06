"use client"

import { useState } from "react"
import { RiCloseLine } from "react-icons/ri"
import { z } from "zod"

import type { CareerEvent } from "@/core/domain"
import { careerEventPayloadBaseObject } from "@/core/domain"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import Spinner from "@/ui/components/basic/Spinner"
import { useCreateCareerEventMutation } from "@/ui/hooks/careerEvent"
import { useCareerMapEventTagsQuery } from "@/ui/hooks/careerMapEventTag"

import { addEvent, deleteEvent as deleteEventAction, replaceEvent } from "../../actions/eventActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"

const ImportEventSchema = careerEventPayloadBaseObject
  .omit({ careerMapId: true, tags: true })
  .extend({
    tagNames: z.array(z.string()).optional(),
  })

const ImportEventsSchema = z.array(ImportEventSchema)

type ImportCareerMapDialogProps = {
  open: boolean
  onClose: () => void
}

export default function ImportCareerMapDialog({ open: jsonImportDialogOpen, onClose: closeJsonImportDialog }: ImportCareerMapDialogProps) {
  const { state: { careerMapId }, dispatch } = useCarrerMapEditorContext()
  const createCareerEventMutation = useCreateCareerEventMutation()
  const [json, setJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tagsQuery = useCareerMapEventTagsQuery()

  const handleClose = () => {
    if (isLoading) return
    setJson("")
    setError(null)
    closeJsonImportDialog()
  }

  const handleImport = async () => {
    setError(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch {
      setError("JSONのパースに失敗しました。正しいJSON形式で入力してください。")
      return
    }

    const result = ImportEventsSchema.safeParse(parsed)
    if (!result.success) {
      setError(`バリデーションエラー: ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`)
      return
    }

    const availableTags = tagsQuery.data?.items ?? []
    const tagIdByName = new Map(availableTags.map((t) => [t.name, t.id]))
    const resolveTagIds = (names: string[]): string[] =>
      names.map((n) => tagIdByName.get(n)).filter((id): id is string => !!id)

    setIsLoading(true)
    try {
      for (const event of result.data) {
        const { tagNames, ...rest } = event
        const payload = { ...rest, careerMapId, tags: resolveTagIds(tagNames ?? []) }
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const tempEvent = { ...payload, id: tempId, tags: payload.tags.map((id) => ({ id, name: id })) } as CareerEvent
        dispatch(addEvent(tempEvent))
        try {
          const created = await createCareerEventMutation.mutateAsync(payload)
          dispatch(replaceEvent(tempId, created))
        } catch {
          dispatch(deleteEventAction(tempId))
          throw new Error("イベントの作成中にエラーが発生しました。")
        }
      }
      setJson("")
      setError(null)
      closeJsonImportDialog()
    } catch {
      setError("イベントの作成中にエラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={jsonImportDialogOpen} onClose={handleClose} className="w-full max-w-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-full p-1 hover:bg-foreground/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="閉じる"
          >
            <RiCloseLine size={20} />
          </button>
          <h2 className="text-lg font-bold">JSONイベントインポート</h2>
          <div className="w-7" />
        </div>

        <p className="text-sm text-foreground/60">
          イベントの配列をJSON形式で貼り付けてください。タグは <code className="bg-foreground/10 px-1 rounded">tagNames</code> でタグ名を指定できます。
        </p>

        <textarea
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm font-mono focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none disabled:opacity-40"
          rows={12}
          value={json}
          onChange={(e) => setJson(e.target.value)}
          disabled={isLoading}
          placeholder={'[\n  {\n    "name": "...",\n    "startDate": "2020-04-01",\n    "endDate": "2023-03-31",\n    "type": "working",\n    "strength": 3,\n    "row": 0,\n    "tagNames": ["在職"]\n  }\n]'}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-2 justify-end items-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-foreground/60 mr-auto">
              <Spinner size="small" />
              <span>インポート中...</span>
            </div>
          )}
          <Button type="button" variant="ghost" size="medium" onClick={handleClose} disabled={isLoading}>
            キャンセル
          </Button>
          <Button type="button" variant="primary" size="medium" onClick={handleImport} disabled={isLoading}>
            インポート
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
