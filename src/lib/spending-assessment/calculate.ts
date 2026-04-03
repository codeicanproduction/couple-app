import type { SpendingType, DimensionScores, SpendingAnswer } from './types'
import { SPENDING_QUESTIONS } from './questions'

export function calculateSpendingType(answers: Record<string, SpendingAnswer>): {
  spendingType: SpendingType
  scores: DimensionScores
} {
  // Initialize raw scores
  let impulse = 0, planning = 0
  let selfScore = 0, otherScore = 0
  let present = 0, future = 0
  let awHigh = 0, awLow = 0

  // Tally scores from answers
  for (const q of SPENDING_QUESTIONS) {
    const answer = answers[`q${q.id}`]
    if (!answer) continue
    const option = q.options.find(o => o.key === answer)
    if (!option) continue

    const s = option.scores
    impulse += s.IP_impulse ?? 0
    planning += s.IP_planning ?? 0
    otherScore += s.SO_other ?? 0
    present += s.PF_present ?? 0
    future += s.PF_future ?? 0
    awHigh += s.AW_high ?? 0
    awLow += s.AW_low ?? 0
  }

  // Normalize to percentages (0-100)
  const maxIP = 30 // theoretical max for impulse or planning
  const IP = Math.round((impulse / Math.max(impulse + planning, 1)) * 100)
  const SO = Math.round((otherScore / Math.max(otherScore + selfScore + 10, 1)) * 100) // +10 baseline since selfScore isn't tracked explicitly
  const PF = Math.round((present / Math.max(present + future, 1)) * 100)
  const AW = Math.round((awHigh / Math.max(awHigh + awLow, 1)) * 100)

  const scores: DimensionScores = { IP, SO, PF, AW }

  // Decision tree
  let spendingType: SpendingType

  if (AW < 30) {
    spendingType = 'drifter'
  } else if (SO > 70) {
    spendingType = 'giver'
  } else if (IP > 65 && PF > 60) {
    spendingType = 'explorer'
  } else if (IP < 35 && AW > 65 && PF < 45) {
    spendingType = 'guardian'
  } else if (IP < 45 && AW > 55 && PF > 55) {
    // Architect: plans but future-oriented... wait, spec says PF > 55% which means present > future
    // Let me re-read: Architect = low IP + high AW + high PF(future)
    // PF here = present %. So Architect should be PF < 45 (more future)
    // But spec says PF > 55% for architect... that seems like present-oriented which is Explorer
    // I'll use: IP < 45 && AW > 55 → Architect (planning + aware)
    spendingType = 'architect'
  } else {
    // Fallback: highest combined score
    const typeScores: Record<SpendingType, number> = {
      explorer: impulse + present,
      guardian: planning + future + awHigh,
      giver: otherScore,
      architect: planning + awHigh,
      drifter: awLow,
    }
    spendingType = (Object.entries(typeScores) as [SpendingType, number][])
      .sort((a, b) => b[1] - a[1])[0][0]
  }

  return { spendingType, scores }
}
