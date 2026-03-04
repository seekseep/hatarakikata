/**
 * 日本の学制に基づく入学・卒業年月の計算ユーティリティ
 *
 * 4月2日以降に生まれた子は、(誕生年 + enrollmentAge)年の4月に入学
 * 4月1日以前に生まれた子は、(誕生年 + enrollmentAge - 1)年の4月に入学
 */

export function schoolStartApril(birthDateStr: string, enrollmentAge: number): string {
  const birth = new Date(birthDateStr)
  const birthMonth = birth.getMonth() + 1
  const birthDay = birth.getDate()

  let enrollYear = birth.getFullYear() + enrollmentAge
  if (birthMonth < 4 || (birthMonth === 4 && birthDay <= 1)) {
    enrollYear -= 1
  }

  return `${String(enrollYear).padStart(4, "0")}-04-01`
}

export function schoolEndMarch(birthDateStr: string, graduationAge: number): string {
  const startApril = schoolStartApril(birthDateStr, graduationAge)
  const year = new Date(startApril).getFullYear()
  return `${String(year).padStart(4, "0")}-03-01`
}
