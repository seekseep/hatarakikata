import { encode } from "@toon-format/toon"

import type { CareerEventType } from "@/core/domain/entity/careerEvent"

const EDUCATION_SYSTEMS = [
  { country: '日本',     level: '小学校',               startAge: 6,  years: 6 },
  { country: '日本',     level: '中学校',               startAge: 12, years: 3 },
  { country: '日本',     level: '高校',                 startAge: 15, years: 3 },
  { country: '日本',     level: '大学',                 startAge: 18, years: 4 },
  { country: 'アメリカ', level: 'Elementary School',    startAge: 5,  years: 6 },
  { country: 'アメリカ', level: 'Middle School',        startAge: 11, years: 3 },
  { country: 'アメリカ', level: 'High School',          startAge: 14, years: 4 },
  { country: 'アメリカ', level: 'University',           startAge: 18, years: 4 },
  { country: '中国',     level: '小学',                 startAge: 6,  years: 6 },
  { country: '中国',     level: '初中',                 startAge: 12, years: 3 },
  { country: '中国',     level: '高中',                 startAge: 15, years: 3 },
  { country: '中国',     level: '大学',                 startAge: 18, years: 4 },
  { country: 'イギリス', level: 'Primary School',       startAge: 5,  years: 6 },
  { country: 'イギリス', level: 'Secondary School',     startAge: 11, years: 5 },
  { country: 'イギリス', level: 'Sixth Form',           startAge: 16, years: 2 },
  { country: 'イギリス', level: 'University',           startAge: 18, years: 3 },
  { country: 'ドイツ',   level: 'Grundschule',          startAge: 6,  years: 4 },
  { country: 'ドイツ',   level: 'Gymnasium',            startAge: 10, years: 8 },
  { country: 'ドイツ',   level: 'Universität',          startAge: 18, years: 4 },
  { country: '韓国',     level: '초등학교（小学校）',   startAge: 6,  years: 6 },
  { country: '韓国',     level: '중학교（中学校）',     startAge: 12, years: 3 },
  { country: '韓国',     level: '고등학교（高校）',     startAge: 15, years: 3 },
  { country: '韓国',     level: '대학교（大学）',       startAge: 18, years: 4 },
  { country: 'インド',   level: 'Primary School',       startAge: 6,  years: 5 },
  { country: 'インド',   level: 'Upper Primary',        startAge: 11, years: 3 },
  { country: 'インド',   level: 'Secondary School',     startAge: 14, years: 2 },
  { country: 'インド',   level: 'Senior Secondary',     startAge: 16, years: 2 },
  { country: 'インド',   level: 'University',           startAge: 18, years: 3 },
]

const EDUCATION_SYSTEMS_TOON = encode({ educationSystems: EDUCATION_SYSTEMS })

const TYPE_CONFIGS: Record<CareerEventType, {
  label: string
  description: string
  examples: string[]
  avoid: string[]
}> = {
  working: {
    label: "working（学業・職業）",
    description: "学校在籍・職業従事など、学業や仕事に関する状態",
    examples: ["◯◯高校在籍", "◯◯大学在籍", "ソフトバンク CEO", "Apple 共同創業者", "転職活動をしていた"],
    avoid: ["入学", "卒業", "入社", "退社"],
  },
  living: {
    label: "living（生活・転機）",
    description: "居住地・生活状況、および結婚・出産・受賞などの重要な転機",
    examples: ["東京で一人暮らし", "アメリカへ留学", "療養期間", "結婚", "出産", "◯◯を受賞"],
    avoid: ["就職", "退職"],
  },
  feeling: {
    label: "feeling（心理状態）",
    description: "モチベーション・精神状態・人生観の変化など内面の状態",
    examples: ["起業への意欲が高まっていた時期", "燃え尽き症候群", "社会への怒りを感じていた時期"],
    avoid: [],
  },
}

export function buildBiographyPromptForType(
  type: CareerEventType,
  personName: string,
  biographyMarkdown: string,
  birthDate: string | null,
  tagNames: string[]
): string {
  const tagNamesText = tagNames.map((n) => `- ${n}`).join("\n") || "(タグなし)"
  const config = TYPE_CONFIGS[type]

  const birthDateInfo = birthDate
    ? `- 生年月日: ${birthDate}`
    : "- 生年月日: 伝記テキストから読み取ってください（不明なら省略）"

  const avoidSection = config.avoid.length > 0
    ? [`- 避けること: ${config.avoid.map(a => `「${a}」`).join("、")}のような単発の出来事`]
    : []

  return [
    "あなたは「履歴書をガントチャートUIで可視化する」ための CareerEvent 生成アシスタントです。",
    `以下のWikipedia伝記テキストから、${personName} の【${config.label}】のイベントのみを生成してください。`,
    "",
    `## 対象種別: ${config.label}`,
    `- ${config.description}`,
    `- 例: ${config.examples.map(e => `「${e}」`).join("、")}`,
    ...avoidSection,
    "",
    "## 最重要コンセプト: 出来事ではなく『状態』を期間で表す",
    "- events は原則として『状態（〜していた）』を表すこと。",
    "",
    "## ゴール",
    `- 伝記テキストから【${config.label}】に該当する actions（create のみ）を生成する。`,
    "- 該当するイベントがなければ actions を空配列にする（無理に生成しない）。",
    ...(type === "working" ? [
      "",
      "## 主要国の教育機関と在籍年数（参考情報）",
      "- 学校名から国を判定し、以下の在籍期間を参照して startDate/endDate を読み取ること。",
      "```toon",
      EDUCATION_SYSTEMS_TOON,
      "```",
    ] : []),
    "",
    "## 人物情報",
    `- 人物名: ${personName}`,
    birthDateInfo,
    "",
    "## 出力形式（厳守）",
    "- 以下の型に一致する JSON のみ。JSON以外禁止。",
    "{",
    `  actions: Array<{ type: 'create', payload: { name: string, type: '${type}', startDate: string, endDate: string, tagNames: string[], strength: number, description: string | null } }>,`,
    "  nextQuestion: null",
    "}",
    "",
    "## 制約（厳守）",
    "- startDate/endDate は 'YYYY-MM-01' 形式。",
    "- endDate は startDate より後（同月禁止 — 必ず少なくとも1ヶ月の期間を持つこと）。",
    "- startDate/endDate が伝記テキストから明確に読み取れないイベントは追加しない。推定・補完禁止。",
    "- actions は空配列でも可。",
    `- type は常に '${type}' で固定。`,
    "- nextQuestion は常に null。",
    "",
    "## イベント名フィールドのルール（超重要）",
    "- name は必須。全イベントで name を設定する。",
    "- name は期間を表す短い名前（目安: 20文字以内）",
    "- name に年号（令和・平成・昭和など）は含めない。",
    "- 「結婚」「出産」「受賞」などの転機も 1〜3ヶ月の期間イベントとして表現すること。",
    "- description に詳細を書く。伝記テキストに書かれた事実のみを1〜3文で記述。",
    "  - description は null にしない。必ず何か書く。",
    "",
    "## タグ付与ルール",
    "- tagNames は下の一覧からのみ選ぶ（新規作成禁止）。",
    "- 各イベントに1〜3個、必ず付与。",
    "",
    "## strength ルール",
    "- 1〜5 の整数。重要度が高いイベントほど大きい値にする。",
    "",
    "## 利用可能なタグ名",
    tagNamesText,
    "",
    "## 伝記テキスト（Wikipedia）",
    biographyMarkdown,
  ].join("\n")
}

export function buildBiographyPrompt(
  personName: string,
  biographyMarkdown: string,
  birthDate: string | null,
  tagNames: string[]
): string {
  return buildBiographyPromptForType("working", personName, biographyMarkdown, birthDate, tagNames)
}
