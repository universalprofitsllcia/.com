'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CreditCard, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react'

export default function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [wallet, setWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amount)
    
    // Safety check on client side
    if (val < 10) {
      alert('El retiro mínimo es de $10 USDT.')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        // Double check balance
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single()
        
        if (!profile || profile.balance < val) {
            alert('Saldo insuficiente.')
            setLoading(false)
            return
        }

      // 1. Deduct balance first for security
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - val })
        .eq('id', user.id)
      
      if (updErr) {
          alert('Error al procesar el saldo.')
          setLoading(false)
          return
      }

      // 2. Create pending withdrawal
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: val,
          type: 'withdrawal',
          status: 'pending',
          wallet_address: wallet
        })
      
      if (error) {
        // Restore balance if transaction fails
        await supabase.from('profiles').update({ balance: profile.balance }).eq('id', user.id)
        alert(error.message)
      } else {
        alert('Solicitud de retiro enviada. Recibirás tu dinero en un lapso de 24-48h.')
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-red-200 bg-clip-text text-transparent">Retirar Ganancias</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Solicita el retiro de tus dividendos a tu billetera personal en la red TRC20.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />
          
          <h2 className="text-xl font-bold flex items-center gap-3">
             <CreditCard className="w-6 h-6 text-red-500" />
             Nuevo Retiro
          </h2>

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 font-bold uppercase tracking-wider">Monto a Retirar (USDT)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-600">$</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-6 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl text-3xl font-extrabold focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:opacity-20"
                  placeholder="0.00"
                  min="10"
                  required
                />
              </div>
            </div>

             <div className="space-y-2">
              <label className="text-sm text-slate-500 font-bold uppercase tracking-wider">Billetera de Destino (TRC20)</label>
              <input 
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono placeholder:text-slate-700"
                placeholder="Escribe tu wallet TRC20"
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Comisión de Retiro (5% Fee)</span>
                 <span className="text-white font-bold">{amount ? `$${(parseFloat(amount) * 0.05).toFixed(2)}` : '$0.00'}</span>
               </div>
               <div className="flex justify-between text-base border-t border-red-500/20 pt-2 mt-2">
                 <span className="text-slate-400">Recibirás Total Neto</span>
                 <span className="text-red-500 font-black">{amount ? `$${(parseFloat(amount) * 0.95).toFixed(2)}` : '$0.00'}</span>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white font-black text-lg hover:from-red-500 hover:to-red-600 transform transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Confirmar Retiro
              <ArrowUpRight className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Security & Alerts */}
        <div className="space-y-6">
           <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Ciclos de Retiro</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Solo puedes retirar cada 7 días naturales. Esto nos permite equilibrar la liquidez de los bots algorítmicos. Las solicitudes se procesan por orden de llegada.</p>
           </div>

           <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl border-green-500/10">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-800 relative flex items-center justify-center">
                 <ShieldCheck className="w-16 h-16 text-green-500/20 absolute" />
                 <div className="relative text-center p-6">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Liquidez Verificada</p>
                   <p className="text-lg font-extrabold text-white">Pool Institucional ACTIVO</p>
                   <div className="mt-2 w-24 h-1 bg-green-500 mx-auto rounded-full" />
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest">Reserva Asegurada 1:1</p>
           </div>
        </div>
      </div>
    </div>
  )
}
