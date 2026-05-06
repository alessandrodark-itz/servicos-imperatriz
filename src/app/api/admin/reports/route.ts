import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* GET /api/admin/reports
   Returns all reports enriched with:
   - reporter info (name, user_type)
   - reported user info (author of the flagged review/reply)
   - target content details
*/
export async function GET() {
  const db = createAdmin() as any

  const { data: reports, error } = await db
    .from('review_reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!reports?.length) return NextResponse.json([])

  const reviewIds: string[] = reports.filter((r: any) => r.target_type === 'review').map((r: any) => r.target_id)
  const replyIds: string[]  = reports.filter((r: any) => r.target_type === 'reply').map((r: any) => r.target_id)

  const [reviewsRes, repliesRes] = await Promise.all([
    reviewIds.length
      ? db.from('reviews').select('id, comment, rating, reviewer_name, user_id, provider_id, providers(name)').in('id', reviewIds)
      : Promise.resolve({ data: [] as any[] }),
    replyIds.length
      ? db.from('review_replies').select('id, reply_comment, provider_user_id, review_id').in('id', replyIds)
      : Promise.resolve({ data: [] as any[] }),
  ])

  const reviewMap = new Map<string, any>((reviewsRes.data ?? []).map((r: any) => [r.id, r]))
  const replyMap  = new Map<string, any>((repliesRes.data ?? []).map((r: any) => [r.id, r]))

  // Collect all involved user IDs: reporters + reported content authors
  const reporterIds: string[] = reports.map((r: any) => r.reporter_user_id).filter(Boolean)
  const reportedIds: string[] = []
  for (const r of reports as any[]) {
    if (r.target_type === 'review') {
      const rev = reviewMap.get(r.target_id)
      if (rev?.user_id) reportedIds.push(rev.user_id)
    } else {
      const rep = replyMap.get(r.target_id)
      if (rep?.provider_user_id) reportedIds.push(rep.provider_user_id)
    }
  }

  const allUserIds = [...new Set([...reporterIds, ...reportedIds])]
  const { data: profiles } = allUserIds.length
    ? await db.from('profiles').select('id, full_name, user_type, created_at').in('id', allUserIds)
    : { data: [] as any[] }

  const profileMap = new Map<string, any>((profiles ?? []).map((p: any) => [p.id, p]))

  const enriched = (reports as any[]).map((r: any) => {
    const isReview = r.target_type === 'review'
    const target: any = isReview ? reviewMap.get(r.target_id) : replyMap.get(r.target_id)
    const reporter: any = profileMap.get(r.reporter_user_id)

    const reportedUserId: string | null = isReview
      ? (target?.user_id ?? null)
      : (target?.provider_user_id ?? null)
    const reported: any = reportedUserId ? profileMap.get(reportedUserId) : null

    return {
      ...r,
      // Reporter (who filed the report)
      reporter_name:      reporter?.full_name      ?? null,
      reporter_user_type: reporter?.user_type       ?? null,
      // Reported (author of the flagged content)
      reported_user_id:   reportedUserId,
      reported_name:      reported?.full_name ?? (isReview ? target?.reviewer_name : null) ?? null,
      reported_user_type: reported?.user_type ?? null,
      // Content details
      target_content: isReview ? (target?.comment ?? null) : (target?.reply_comment ?? null),
      target_rating:  isReview ? (target?.rating  ?? null) : null,
      provider_name:  isReview ? (target?.providers?.name ?? null) : null,
    }
  })

  return NextResponse.json(enriched)
}
