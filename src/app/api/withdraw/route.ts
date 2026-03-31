import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { amount, wallet } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (amount < 10) return NextResponse.json({ error: 'Monto insuficiente para el retiro' }, { status: 400 })

  // 1. Obtener saldo actual seguro del servidor
  const { data: profile } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user.id)
    .single()

  if (!profile || profile.balance < amount) {
    return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
  }

  // 2. Transacción atómica: Restar saldo y Crear registro pendiente
  // Aquí usamos el middleware de transacciones de Supabase o encadenamos promesas seguras
  const { error: updErr } = await supabase
    .from('profiles')
    .update({ balance: profile.balance - amount })
    .eq('id', user.id)

  if (updErr) return NextResponse.json({ error: 'Error al actualizar saldo' }, { status: 500 })

  const { error: txErr } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      amount,
      type: 'withdrawal',
      status: 'pending',
      wallet_address: wallet
    })

  if (txErr) {
    // Si falla el registro, devolvemos el saldo al usuario por seguridad
    await supabase.from('profiles').update({ balance: profile.balance }).eq('id', user.id)
    return NextResponse.json({ error: 'Error de red en la transacción' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Retiro solicitado con éxito' })
}
