'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

import { TrendingUp, PieChart, Activity, DollarSign, Wallet2 } from 'lucide-react'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)

      // Get investments
      const { data: investments } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
      
      setInvestments(investments || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full">Cargando datos maestros...</div>

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Balance Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 shadow-lg shadow-amber-500/5 relative group hover:scale-[1.02] transition-all">
          <div className="absolute top-4 right-4 p-2 rounded-xl bg-amber-500/20 text-amber-500">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-4">Balance Disponible</h3>
          <p className="text-4xl font-extrabold text-white">{formatCurrency(profile?.balance || 0)}</p>
          <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>+1.25% Hoy</span>
          </div>
        </div>

        {/* Invested Card */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-lg relative h-full hover:bg-slate-900 transition-colors">
          <div className="absolute top-4 right-4 p-2 rounded-xl bg-blue-500/20 text-blue-500">
             <Wallet2 className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-4">Capital Invertido</h3>
          <p className="text-4xl font-extrabold text-white">{formatCurrency(profile?.invested || 0)}</p>
          <p className="mt-4 text-xs text-slate-500 font-medium">Protegido por Smart Contracts</p>
        </div>

        {/* Total Earnings Card */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-lg relative h-full hover:bg-slate-900 transition-colors">
          <div className="absolute top-4 right-4 p-2 rounded-xl bg-green-500/20 text-green-500">
             <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-4">Inversión Generada</h3>
          <p className="text-4xl font-extrabold text-white font-mono">{formatCurrency(profile?.earnings || 0)}</p>
          <p className="mt-4 text-xs text-slate-500 font-medium font-bold">Abonos Automáticos al Día</p>
        </div>

         {/* Active Contracts Card */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-lg relative h-full hover:bg-slate-900 transition-colors">
          <div className="absolute top-4 right-4 p-2 rounded-xl bg-purple-500/20 text-purple-500">
             <PieChart className="w-5 h-5" />
          </div>
          <h3 className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-4">Bots en Ejecución</h3>
          <p className="text-4xl font-extrabold text-white">{investments.filter(i => i.status === 'active').length}</p>
          <p className="mt-4 text-xs text-slate-500 font-medium">Estrategias XAUUSD / NAS100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Investments List */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px]" />
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
             <div className="w-2 h-8 bg-amber-500 rounded-full" />
             Tus Contratos Activos
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                 <tr className="text-slate-500 text-xs tracking-widest uppercase border-b border-slate-800">
                   <th className="pb-4 pt-2">ID Contrato</th>
                   <th className="pb-4 pt-2">Capital</th>
                   <th className="pb-4 pt-2">Retorno Diario</th>
                   <th className="pb-4 pt-2">Estado</th>
                   <th className="pb-4 pt-2">Fecha</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                 {investments.length > 0 ? (
                   investments.map((inv) => (
                      <tr key={inv.id} className="group hover:bg-slate-800/30 transition-all">
                        <td className="py-5 font-mono text-xs text-slate-400">#INV-{inv.id.substring(0, 8)}</td>
                        <td className="py-5 font-bold">{formatCurrency(inv.amount)}</td>
                        <td className="py-5 text-amber-500 font-bold">{formatCurrency(inv.amount * 0.0125)}</td>
                        <td className="py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${inv.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-800 text-slate-500'}`}>
                            {inv.status === 'active' ? 'Operativo' : 'Completado'}
                          </span>
                        </td>
                        <td className="py-5 text-slate-500 text-xs">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                   ))
                 ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-500">No tienes inversiones activas aún.</td>
                    </tr>
                 )}
               </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Info - Market stats or profile status */}
        <div className="space-y-8">
           <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
             <h3 className="text-lg font-bold mb-6 text-amber-500">Alertas del Mercado</h3>
             <ul className="space-y-4">
                <li className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                   <p className="text-sm text-slate-300 font-medium">Oro (XAUUSD) muestra señales alcistas. Nuestros bots aumentan exposición.</p>
                </li>
                <li className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                   <p className="text-sm text-slate-300 font-medium">Nasdaq 100 consolidado tras apertura. Estrategia neutral activa.</p>
                </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  )
}
