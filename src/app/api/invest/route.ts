import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { amount } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (amount < 50) return NextResponse.json({ error: 'Monto insuficiente' }, { status: 400 })

  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      amount,
      type: 'deposit',
      status: 'pending'
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Depósito registrado correctamente' })
}
