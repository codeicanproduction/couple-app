import { redirect } from 'next/navigation'

// Assessment step removed from onboarding — accessible anytime from Games menu
export default function OnboardingAssessmentPage() {
  redirect('/onboarding/install')
}
