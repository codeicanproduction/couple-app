import type { RelationshipLevel } from '@/types/app'

// Parse "YYYY-MM-DD" as local midnight to avoid UTC-offset shifting
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Format a local Date to "YYYY-MM-DD" without UTC conversion
function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Number of full days between a past date and today */
export function daysSince(dateStr: string): number {
  const past = parseLocalDate(dateStr)
  const nowMidnight = new Date()
  nowMidnight.setHours(0, 0, 0, 0)
  const diff = nowMidnight.getTime() - past.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/** Number of days until a future date (returns 0 if today, negative if past) */
export function daysUntil(dateStr: string): number {
  const targetMidnight = parseLocalDate(dateStr)
  const nowMidnight = new Date()
  nowMidnight.setHours(0, 0, 0, 0)
  const diff = targetMidnight.getTime() - nowMidnight.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

/** Format a date string to Indonesian locale: "22 Maret 2026" */
export function formatDateID(dateStr: string): string {
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format a date string to short Indonesian: "22 Mar" */
export function formatDateShortID(dateStr: string): string {
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Get the next occurrence of a recurring annual event.
 * If the event date this year is in the past, return next year's date.
 */
export function getNextOccurrence(eventDateStr: string): string {
  const [, monthStr, dayStr] = eventDateStr.split('-')
  const month = parseInt(monthStr, 10) - 1
  const day = parseInt(dayStr, 10)
  const now = new Date()
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const thisYear = new Date(now.getFullYear(), month, day)
  if (thisYear >= nowMidnight) {
    return formatDateKey(thisYear)
  }
  return formatDateKey(new Date(now.getFullYear() + 1, month, day))
}

/**
 * Couple relationship level based on days together.
 * Benih: 0–90d | Tumbuh: 91–365d | Mekar: 366–730d | Abadi: 731d+
 */
export function getRelationshipLevel(days: number): RelationshipLevel {
  if (days >= 731) return 'Abadi'
  if (days >= 366) return 'Mekar'
  if (days >= 91) return 'Tumbuh'
  return 'Benih'
}

/** Human-readable countdown label in Indonesian */
export function countdownLabel(days: number): string {
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Besok'
  if (days < 0) return `${Math.abs(days)} hari lalu`
  return `${days} hari lagi`
}

/** Return the ISO first-of-month string for a given date: "YYYY-MM-01" */
export function toMonthKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}
