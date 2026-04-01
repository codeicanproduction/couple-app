import type { RelationshipLevel } from '@/types/app'

/** Number of full days between a past date and today */
export function daysSince(dateStr: string): number {
  const past = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - past.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/** Number of days until a future date (returns 0 if today, negative if past) */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  // Compare date only (ignore time)
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = targetMidnight.getTime() - nowMidnight.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

/** Format a date string to Indonesian locale: "22 Maret 2026" */
export function formatDateID(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format a date string to short Indonesian: "22 Mar" */
export function formatDateShortID(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Get the next occurrence of a recurring annual event.
 * If the event date this year is in the past (or today), return next year's date.
 */
export function getNextOccurrence(eventDateStr: string): string {
  const event = new Date(eventDateStr)
  const now = new Date()
  const thisYear = new Date(now.getFullYear(), event.getMonth(), event.getDate())
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (thisYear >= nowMidnight) {
    return thisYear.toISOString().split('T')[0]
  }
  const nextYear = new Date(now.getFullYear() + 1, event.getMonth(), event.getDate())
  return nextYear.toISOString().split('T')[0]
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
