import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin()

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, reviewer_name, created_at, flagged, user_id, provider_id, providers(name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []).map((r: {
    id: string; rating: number; comment: string | null; reviewer_name: string | null
    created_at: string; flagged: boolean | null; user_id: string | null
    providers: { name: string } | null
  }) => ({
    id:            r.id,
    rating:        r.rating,
    comment:       r.comment,
    reviewer_name: r.reviewer_name,
    created_at:    r.created_at,
    flagged:       r.flagged ?? false,
    user_id:       r.user_id,
    provider_name: r.providers?.name ?? null,
  }))

  return NextResponse.json(rows)
}
