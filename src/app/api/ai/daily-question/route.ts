import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get couple
    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()
    if (!membership?.couple_id) return NextResponse.json({ error: 'No couple' }, { status: 400 })

    const coupleId = membership.couple_id
    const today = new Date().toISOString().split('T')[0]

    // Check if already generated today
    const { data: existing } = await supabase
      .from('ai_daily_questions')
      .select('question')
      .eq('couple_id', coupleId)
      .eq('question_date', today)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ question: existing.question, alreadyGenerated: true })
    }

    // Gather context about the couple
    const { data: myProfile } = await supabase
      .from('profiles').select('name, gender, birthday, relationship_start_date')
      .eq('id', user.id).single()

    // Get partner
    const { data: partnerMembers } = await supabase
      .from('couple_members').select('profile_id')
      .eq('couple_id', coupleId).neq('profile_id', user.id)

    let partnerProfile = null
    if (partnerMembers?.[0]) {
      const { data: pp } = await supabase
        .from('profiles').select('name, gender, birthday')
        .eq('id', partnerMembers[0].profile_id).single()
      partnerProfile = pp
    }

    // Get MBTI if available
    const { data: myMbti } = await supabase
      .from('mbti_results').select('mbti_type')
      .eq('profile_id', user.id).order('taken_at', { ascending: false }).limit(1).maybeSingle()

    let partnerMbti = null
    if (partnerMembers?.[0]) {
      const { data: pm } = await supabase
        .from('mbti_results').select('mbti_type')
        .eq('profile_id', partnerMembers[0].profile_id).order('taken_at', { ascending: false }).limit(1).maybeSingle()
      partnerMbti = pm
    }

    // Get recent AI questions to avoid repetition
    const { data: recentQuestions } = await supabase
      .from('ai_daily_questions')
      .select('question')
      .eq('couple_id', coupleId)
      .order('question_date', { ascending: false })
      .limit(7)

    // Get upcoming events
    const { data: upcomingEvents } = await supabase
      .from('couple_events')
      .select('title, event_date, event_type')
      .eq('couple_id', coupleId)
      .gte('event_date', today)
      .order('event_date')
      .limit(3)

    // Calculate ages and days together
    const calcAge = (birthday: string | null) => {
      if (!birthday) return null
      return Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 86400000))
    }

    const daysTogether = myProfile?.relationship_start_date
      ? Math.floor((Date.now() - new Date(myProfile.relationship_start_date).getTime()) / 86400000)
      : null

    const dayOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()]

    // Build context
    const context = {
      myName: myProfile?.name,
      myGender: myProfile?.gender,
      myAge: calcAge(myProfile?.birthday ?? null),
      myMbti: myMbti?.mbti_type,
      partnerName: partnerProfile?.name,
      partnerGender: partnerProfile?.gender,
      partnerAge: calcAge(partnerProfile?.birthday ?? null),
      partnerMbti: partnerMbti?.mbti_type,
      daysTogether,
      dayOfWeek,
      upcomingEvents: upcomingEvents?.map(e => `${e.title} (${e.event_date})`),
      recentQuestions: recentQuestions?.map(q => q.question),
    }

    // Build prompt
    const systemPrompt = `Kamu adalah AI yang membantu pasangan Indonesia untuk saling mengenal lebih dalam melalui pertanyaan harian.

ATURAN:
- Generate SATU pertanyaan dalam Bahasa Indonesia yang casual dan hangat
- Pertanyaan harus mendorong diskusi dan refleksi bersama
- Jangan terlalu berat atau terlalu ringan — cari sweet spot
- Pertanyaan harus bisa dijawab oleh KEDUA pasangan
- Jangan pernah menanyakan hal yang terlalu pribadi/sensitif
- Gunakan bahasa anak muda Indonesia yang natural
- JANGAN ulangi pertanyaan yang sudah pernah ditanyakan
- Output HANYA pertanyaan saja, tanpa penjelasan atau embel-embel lain`

    const userPrompt = `Konteks pasangan:
- ${context.myName ?? 'User'} (${context.myGender === 'male' ? 'cowok' : context.myGender === 'female' ? 'cewek' : 'unknown'}${context.myAge ? `, ${context.myAge} tahun` : ''}${context.myMbti ? `, MBTI: ${context.myMbti}` : ''})
- ${context.partnerName ?? 'Pasangan'} (${context.partnerGender === 'male' ? 'cowok' : context.partnerGender === 'female' ? 'cewek' : 'unknown'}${context.partnerAge ? `, ${context.partnerAge} tahun` : ''}${context.partnerMbti ? `, MBTI: ${context.partnerMbti}` : ''})
${context.daysTogether ? `- Sudah bersama ${context.daysTogether} hari` : ''}
- Hari ini: ${context.dayOfWeek}
${context.upcomingEvents?.length ? `- Event mendatang: ${context.upcomingEvents.join(', ')}` : ''}

${context.recentQuestions?.length ? `Pertanyaan yang SUDAH ditanyakan (JANGAN ulangi):
${context.recentQuestions.map(q => `- ${q}`).join('\n')}` : ''}

Generate satu pertanyaan harian yang personal dan menarik untuk pasangan ini.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const question = (message.content[0] as { type: string; text: string }).text.trim()

    // Save to DB
    await supabase.from('ai_daily_questions').insert({
      couple_id: coupleId,
      question_date: today,
      question,
      context_used: context,
      generated_by: user.id,
    })

    return NextResponse.json({ question, alreadyGenerated: false })
  } catch (error) {
    console.error('AI daily question error:', error)
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 })
  }
}

// GET: fetch today's AI question if exists
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()
    if (!membership?.couple_id) return NextResponse.json({ question: null })

    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('ai_daily_questions')
      .select('question')
      .eq('couple_id', membership.couple_id)
      .eq('question_date', today)
      .maybeSingle()

    return NextResponse.json({ question: data?.question ?? null })
  } catch {
    return NextResponse.json({ question: null })
  }
}
