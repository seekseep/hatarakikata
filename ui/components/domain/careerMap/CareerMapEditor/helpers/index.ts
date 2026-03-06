import type { EditorMode } from "../../hooks/EditorState"

// --- Viewer ---
export function getViewerOpen(mode: EditorMode) {
  return mode.type === 'viewer'
}
export function getViewerCareerMapId(mode: EditorMode) {
  return mode.type === 'viewer' ? mode.careerMapId : ''
}
export function getViewerUserName(mode: EditorMode) {
  return mode.type === 'viewer' ? mode.userName : undefined
}

// --- CareerMapEventDialog ---
export function getEventDialogOpen(mode: EditorMode) {
  return mode.type === 'create-dialog' || mode.type === 'edit-dialog'
}

// --- CareerMapEventGenerateDialog ---
export function getGenerateDialogOpen(mode: EditorMode) {
  return mode.type === 'generate-dialog'
}

// --- ImportCareerMapDialog ---
export function getJsonImportDialogOpen(mode: EditorMode) {
  return mode.type === 'json-import-dialog'
}

// --- ConfirmDialog ---
export function getConfirmDialogOpen(mode: EditorMode) {
  return mode.type === 'confirm-dialog'
}
export function getConfirmDialogMessage(mode: EditorMode) {
  return mode.type === 'confirm-dialog' ? mode.message : ''
}

// --- CareerGuidePromptDialog ---
export function getCareerGuidePromptDialogOpen(mode: EditorMode) {
  return mode.type === 'career-guide-prompt-dialog'
}

// --- CareerQuestionAnswerDialog ---
export function getQuestionAnswerDialogKey(mode: EditorMode) {
  return mode.type === 'question-answer-dialog' ? mode.question.id : undefined
}
export function getQuestionAnswerDialogOpen(mode: EditorMode) {
  return mode.type === 'question-answer-dialog'
}
export function getQuestionAnswerDialogQuestion(mode: EditorMode) {
  return mode.type === 'question-answer-dialog' ? mode.question : null
}

// --- CareerMapSearchDrawer ---
export function getSearchDrawerOpen(mode: EditorMode) {
  return mode.type === 'search-drawer'
}

// --- CareerQuestionDrawer ---
export function getQuestionsDrawerOpen(mode: EditorMode) {
  return mode.type === 'questions-drawer'
}

// --- CareerGuidesDrawer ---
export function getCareerGuidesDrawerOpen(mode: EditorMode) {
  return mode.type === 'career-guides-drawer'
}

// --- CareerGuideDetailDrawer ---
export function getCareerGuideDetailDrawerOpen(mode: EditorMode) {
  return mode.type === 'career-guide-detail-drawer'
}
export function getCareerGuideDetailDrawerGuideId(mode: EditorMode) {
  return mode.type === 'career-guide-detail-drawer' ? mode.guideId : ''
}

// --- CareerGuideCreatingDialog ---
export function getCreatingCareerGuideOpen(mode: EditorMode) {
  return mode.type === 'creating-career-guide'
}
export function getCreatingCareerGuideBaseCareerMapId(mode: EditorMode) {
  return mode.type === 'creating-career-guide' ? mode.baseCareerMapId : ''
}

// --- CarrerMapRequestBirthdayDialog ---
export function getRequiredStartDateOpen(mode: EditorMode) {
  return mode.type === 'required-start-date'
}
