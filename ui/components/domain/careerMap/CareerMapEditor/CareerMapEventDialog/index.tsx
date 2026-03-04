"use client"

import { FormProvider } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"

import Button from "@/ui/components/basic/Button"
import Drawer from "@/ui/components/basic/Drawer"
import MonthField from "@/ui/components/basic/field/MonthField"
import StepField from "@/ui/components/basic/field/StepField"
import TextAreaField from "@/ui/components/basic/field/TextAreaField"
import TextField from "@/ui/components/basic/field/TextField"

import { useCareerMapEventDialogForm } from "./hooks"
import TagSelector from "./TagSelector"

export default function CareerMapEventDialog() {
  const {
    open,
    mode,
    event,
    closeDialog,
    form,
    register,
    onSubmit,
    handleDelete,
    tags,
    setTags,
    availableTags,
    isLoadingTags,
  } = useCareerMapEventDialogForm()

  const selectedType = form.watch("type")
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

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">種類</span>
            <div className="flex gap-2">
              {[
                { value: "working", label: "学校と仕事", color: "bg-blue-100 border-blue-400 text-blue-800" },
                { value: "living", label: "生活の出来事", color: "bg-green-100 border-green-400 text-green-800" },
                { value: "feeling", label: "感じたこと", color: "bg-amber-100 border-amber-400 text-amber-800" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 cursor-pointer rounded-md border-2 px-3 py-2 text-center text-sm font-medium transition-colors ${option.color} ${selectedType === option.value ? "ring-2 ring-offset-1" : "opacity-50"}`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("type")}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <TextAreaField
            label="説明"
            {...register("description")}
            rows={3}
          />

          <div className="flex flex-col gap-2">
            <div className={hasEndDate ? "grid grid-cols-2 gap-3" : ""}>
              <MonthField
                label="開始"
                {...register("startMonth", { required: true })}
              />
              {hasEndDate && (
                <MonthField
                  label="終了"
                  {...register("endMonth", { required: hasEndDate })}
                />
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("hasEndDate")}
                className="rounded"
              />
              終了日を指定する
            </label>
          </div>

          <StepField
            {...register("strength", { valueAsNumber: true })}
            label="強さ"
            min={1}
            max={5}
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
