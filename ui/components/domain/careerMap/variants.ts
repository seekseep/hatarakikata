import { tv } from "tailwind-variants"

// イベントタイプ × 強さ別の色クラス (tailwind-variants)
export const eventItemColors = tv({
  base: "",
  variants: {
    eventType: {
      working: "",
      living: "",
      feeling: "",
    },
    strength: {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
    },
  },
  compoundVariants: [
    { eventType: "working", strength: 1, class: "bg-blue-100 text-blue-800" },
    { eventType: "working", strength: 2, class: "bg-blue-200 text-blue-800" },
    { eventType: "working", strength: 3, class: "bg-blue-300 text-blue-900" },
    { eventType: "working", strength: 4, class: "bg-blue-600 text-white" },
    { eventType: "working", strength: 5, class: "bg-blue-700 text-white" },
    { eventType: "living",  strength: 1, class: "bg-green-100 text-green-800" },
    { eventType: "living",  strength: 2, class: "bg-green-200 text-green-800" },
    { eventType: "living",  strength: 3, class: "bg-green-300 text-green-900" },
    { eventType: "living",  strength: 4, class: "bg-green-600 text-white" },
    { eventType: "living",  strength: 5, class: "bg-green-700 text-white" },
    { eventType: "feeling", strength: 1, class: "bg-amber-100 text-amber-800" },
    { eventType: "feeling", strength: 2, class: "bg-amber-200 text-amber-800" },
    { eventType: "feeling", strength: 3, class: "bg-amber-300 text-amber-900" },
    { eventType: "feeling", strength: 4, class: "bg-amber-600 text-white" },
    { eventType: "feeling", strength: 5, class: "bg-amber-700 text-white" },
  ],
  defaultVariants: {
    eventType: "working",
    strength: 3,
  },
})

export const eventCircleBorderColors = tv({
  base: "",
  variants: {
    eventType: {
      working: "",
      living: "",
      feeling: "",
    },
    strength: {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
    },
  },
  compoundVariants: [
    { eventType: "working", strength: 1, class: "border-blue-300" },
    { eventType: "working", strength: 2, class: "border-blue-400" },
    { eventType: "working", strength: 3, class: "border-blue-500" },
    { eventType: "working", strength: 4, class: "border-blue-600" },
    { eventType: "working", strength: 5, class: "border-blue-700" },
    { eventType: "living",  strength: 1, class: "border-green-300" },
    { eventType: "living",  strength: 2, class: "border-green-400" },
    { eventType: "living",  strength: 3, class: "border-green-500" },
    { eventType: "living",  strength: 4, class: "border-green-600" },
    { eventType: "living",  strength: 5, class: "border-green-700" },
    { eventType: "feeling", strength: 1, class: "border-amber-300" },
    { eventType: "feeling", strength: 2, class: "border-amber-400" },
    { eventType: "feeling", strength: 3, class: "border-amber-500" },
    { eventType: "feeling", strength: 4, class: "border-amber-600" },
    { eventType: "feeling", strength: 5, class: "border-amber-700" },
  ],
  defaultVariants: {
    eventType: "working",
    strength: 3,
  },
})
