"use client"

import { FormProvider } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"

import Button from "@/ui/components/basic/Button"
import Drawer from "@/ui/components/basic/Drawer"
import CheckboxField from "@/ui/components/basic/field/CheckboxField"
import MonthField from "@/ui/components/basic/field/MonthField"
import StepField from "@/ui/components/basic/field/StepField"
import TextAreaField from "@/ui/components/basic/field/TextAreaField"
import TextField from "@/ui/components/basic/field/TextField"
import ToggleButtonField from "@/ui/components/basic/field/ToggleButtonField"

import { typeOptions } from "@/ui/constants"

import { useCareerMapEventDialogForm } from "./hooks"
import TagSelector from "./TagSelector"

export default function CareerMapEventDialog() {
  const {
    open,
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
  } = useCareerMapEventDialogForm()

  const hasEndDate = form.watch("hasEndDate")

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
              <RxCross2 size={20} />
            </button>
            <h2 className="text-lg font-bold">
              {mode === "create" ? "イベントを追加" : "イベントを編集"}
            </h2>
            <div className="w-7" />
          </div>

          <TextField
            name="name"
            label="名前"
            placeholder={hasEndDate ? "例: 株式会社○○に在籍" : "例: 結婚"}
          />

          <ToggleButtonField
            name="type"
            label="種類"
            options={typeOptions.map((opt) => ({
              ...opt,
              color: {
                working: "bg-blue-100 border-blue-400 text-blue-800",
                living: "bg-green-100 border-green-400 text-green-800",
                feeling: "bg-amber-100 border-amber-400 text-amber-800",
              }[opt.value],
            }))}
          />

          <TextAreaField
            name="description"
            label="説明"
            rows={3}
          />

          <div className="flex flex-col gap-2">
            <div className={hasEndDate ? "grid grid-cols-2 gap-3" : ""}>
              <MonthField
                name="startMonth"
                label="開始"
                rules={{ required: true }}
              />
              {hasEndDate && (
                <MonthField
                  name="endMonth"
                  label="終了"
                  rules={{ required: hasEndDate }}
                />
              )}
            </div>
            <CheckboxField
              name="hasEndDate"
              label="終了日を指定する"
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
