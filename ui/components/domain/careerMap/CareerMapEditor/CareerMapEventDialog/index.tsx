"use client"

import { FormProvider } from "react-hook-form"
import { RiCloseLine } from "react-icons/ri"

import Button from "@/ui/components/basic/Button"
import Drawer from "@/ui/components/basic/Drawer"
import MonthField from "@/ui/components/basic/field/MonthField"
import StepField from "@/ui/components/basic/field/StepField"
import TextAreaField from "@/ui/components/basic/field/TextAreaField"
import TextField from "@/ui/components/basic/field/TextField"
import ToggleButtonField from "@/ui/components/basic/field/ToggleButtonField"
import {
  EVENT_TYPE_FEELING,
  EVENT_TYPE_LABEL_FEELING,
  EVENT_TYPE_LABEL_LIVING,
  EVENT_TYPE_LABEL_WORKING,
  EVENT_TYPE_LIVING,
  EVENT_TYPE_WORKING,
} from "@/ui/constants"

import { useCareerMapEventDialogForm } from "./hooks"
import TagSelector from "./TagSelector"

type CareerMapEventDialogProps = {
  open: boolean
  onClose: () => void
}

export default function CareerMapEventDialog({ open, onClose }: CareerMapEventDialogProps) {
  const {
    mode,
    event,
    closeDialog,
    form,
    onSubmit,
    handleDelete,
    tags,
    setTags,
    availableTags,
    isLoadingTags,
  } = useCareerMapEventDialogForm(open, onClose)

  return (
    <Drawer open={open} onClose={closeDialog}>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 overflow-y-auto h-full p-4 sm:p-6 sm:max-w-md">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
              aria-label="閉じる"
            >
              <RiCloseLine size={20} />
            </button>
            <h2 className="text-lg font-bold">
              {mode === "create" ? "イベントを追加" : "イベントを編集"}
            </h2>
            <div className="w-7" />
          </div>

          <TextField
            name="name"
            label="名前"
            placeholder="例: 株式会社○○に在籍"
          />

          <ToggleButtonField
            name="type"
            label="種類"
            options={[
              { value: EVENT_TYPE_WORKING, label: EVENT_TYPE_LABEL_WORKING, color: "bg-blue-100 border-blue-400 text-blue-800" },
              { value: EVENT_TYPE_LIVING, label: EVENT_TYPE_LABEL_LIVING, color: "bg-green-100 border-green-400 text-green-800" },
              { value: EVENT_TYPE_FEELING, label: EVENT_TYPE_LABEL_FEELING, color: "bg-amber-100 border-amber-400 text-amber-800" },
            ]}
          />

          <TextAreaField
            name="description"
            label="説明"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <MonthField
              name="startMonth"
              label="開始"
              rules={{ required: true }}
            />
            <MonthField
              name="endMonth"
              label="終了"
              rules={{ required: true }}
            />
          </div>

          <StepField
            name="strength"
            label="強さ"
            min={1}
            max={5}
            rules={{ valueAsNumber: true }}
          />

          <TagSelector
            tags={tags}
            setTags={setTags}
            availableTags={availableTags}
            isLoadingTags={isLoadingTags}
          />

          <div className="flex gap-2 justify-end pt-2">
            {mode === "edit" && event && (
              <Button
                type="button"
                variant="ghost"
                size="medium"
                className="text-red-600 hover:bg-red-50 mr-auto"
                onClick={handleDelete}
              >
                削除
              </Button>
            )}
            <Button type="submit" variant="primary" size="medium">
              {mode === "create" ? "追加" : "保存"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  )
}
