'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Coins, ShieldCheck, ArrowRight, Wallet } from 'lucide-react'

export default function InvestPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (val < 50) {
      alert('La inversión mínima es de $50 USDT.')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Create a pending deposit transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: val,
          type: 'deposit',
          status: 'pending'
        })
      
      if (error) {
        alert(error.message)
      } else {
        alert('Solicitud de depósito enviada. Por favor, realiza el pago a la billetera de la empresa.')
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-500 to-amber-200 bg-clip-text text-transparent">Multiplica tu Capital</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Invierte en nuestro fondo algorítmico global operado por 10 bots institucionales en NASDAQ, US30 y ORO.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Investment Form */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
          
          <h2 className="text-xl font-bold flex items-center gap-3">
             <Coins className="w-6 h-6 text-amber-500" />
             Nueva Inversión
          </h2>

          <form onSubmit={handleInvest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 font-bold uppercase tracking-wider">Monto a Invertir (USDT)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-600">$</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-6 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl text-3xl font-extrabold focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="0.00"
                  min="50"
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Comisión (5% Fee)</span>
                 <span className="text-white font-bold">{amount ? `$${(parseFloat(amount) * 0.05).toFixed(2)}` : '$0.00'}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Inversión Neta</span>
                 <span className="text-amber-500 font-bold">{amount ? `$${(parseFloat(amount) * 0.95).toFixed(2)}` : '$0.00'}</span>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-slate-950 font-black text-lg hover:from-amber-400 hover:to-amber-500 transform transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Confirmar Inversión
              <ArrowRight className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Instructions/Security */}
        <div className="space-y-6">
           <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Seguridad Garantizada</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Tu capital es operado mediante auditoría algorítmica constante. Los retornos son fijos al 1.25% diario, protegidos por nuestro fondo de reserva institucional.</p>
           </div>

           <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Billetera de Depósito</h3>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 font-mono text-xs break-all text-amber-500 select-all cursor-copy">
                TGCEGCmXpcxEv8RwyebbCUyHAYn8ugCVZ7
              </div>
              <p className="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest">Red TRC20 (USDT) únicamente</p>
           </div>
        </div>
      </div>
    </div>
  )
}
