'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Search,
  Settings,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState({ totalBalance: 0, totalInvested: 0, pendingWithdrawals: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
    fetchData()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!profile?.is_admin) router.push('/dashboard')
  }

  const fetchData = async () => {
    setLoading(true)
    
    // 1. Fetch Profiles
    const { data: profs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    
    // 2. Fetch Transactions
    const { data: txs } = await supabase.from('transactions').select('*, profiles(username)').order('created_at', { ascending: false })
    
    // 3. Fetch Investments for Stats
    const { data: invs } = await supabase.from('investments').select('amount')

    if (profs) setProfiles(profs)
    if (txs) setTransactions(txs)
    
    const balanceSum = profs?.reduce((acc, p) => acc + (p.balance || 0), 0) || 0
    const investSum = invs?.reduce((acc, i) => acc + (i.amount || 0), 0) || 0
    const pendingCount = txs?.filter(t => t.status === 'pending' && t.type === 'withdrawal').length || 0

    setStats({ totalBalance: balanceSum, totalInvested: investSum, pendingWithdrawals: pendingCount })
    setLoading(false)
  }

  const handleUpdateBalance = async (userId: string, newBalance: number) => {
    const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId)
    if (!error) fetchData()
  }

  const handleTransactionStatus = async (txId: string, status: 'completed' | 'rejected') => {
    const { error } = await supabase.from('transactions').update({ status }).eq('id', txId)
    if (!error) fetchData()
  }

  const filteredProfiles = profiles.filter(p => 
    p.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">CENTRO DE MANDO</h1>
          <p className="text-slate-500 font-medium">Gestión financiera y operativa de Universal Profits</p>
        </div>
        <button onClick={fetchData} className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl hover:bg-emerald-500/20 transition-all">
          Refrescar Datos
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-12 h-12" /></div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Balance Total Usuarios</p>
          <p className="text-4xl font-black">${stats.totalBalance.toLocaleString()}</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-12 h-12" /></div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Pool de Inversión Activo</p>
          <p className="text-4xl font-black text-emerald-400">${stats.totalInvested.toLocaleString()}</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><AlertCircle className="w-12 h-12" /></div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Retiros Pendientes</p>
          <p className="text-4xl font-black text-rose-500 font-mono">{stats.pendingWithdrawals}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: User Management */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5">
             <h2 className="text-xl font-bold flex items-center gap-3"><Users className="text-emerald-400" />Usuarios Activos</h2>
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Buscar usuario..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 pr-6 py-2 bg-slate-950 border border-white/5 rounded-full text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
               />
             </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-[10px] uppercase font-black tracking-widest text-slate-500">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4 text-right">Balance Disponible</th>
                  <th className="px-6 py-4 text-center">Referido por</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProfiles.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs">{user.username?.[0].toUpperCase()}</div>
                         <span className="font-bold">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono font-bold text-emerald-400">
                       ${user.balance?.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center text-slate-500 text-sm">{user.referral_by || 'Ninguno'}</td>
                    <td className="px-6 py-5 text-right">
                       <button 
                         onClick={() => {
                           const val = prompt('Nuevo balance para ' + user.username, user.balance);
                           if (val) handleUpdateBalance(user.id, parseFloat(val));
                         }}
                         className="p-2 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-emerald-400 transition-all"
                       >
                         <Settings className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Activity / Approvals */}
        <div className="space-y-8">
           <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex items-center gap-3">
              <Clock className="text-rose-400" />
              <h2 className="text-xl font-bold">Solicitudes de Retiro</h2>
           </div>

           <div className="space-y-4">
              {transactions.filter(t => t.status === 'pending' && t.type === 'withdrawal').map((tx) => (
                <div key={tx.id} className="p-6 rounded-3xl bg-slate-900 border border-white/5 space-y-4 relative overflow-hidden group">
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{tx.profiles?.username}</p>
                        <p className="text-2xl font-black text-rose-500">-${tx.amount.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg text-[10px] font-black uppercase text-slate-400">Pending</div>
                   </div>
                   
                   <div className="p-3 bg-slate-950 rounded-xl text-[10px] font-mono text-slate-500 break-all border border-white/5">
                      WALLET: {tx.wallet_address || 'NOT PROVIDED'}
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleTransactionStatus(tx.id, 'completed')}
                        className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all text-xs"
                      >
                         APROBAR
                      </button>
                      <button 
                        onClick={() => handleTransactionStatus(tx.id, 'rejected')}
                        className="py-3 bg-white/5 hover:bg-rose-500/20 text-rose-500 font-bold rounded-2xl transition-all text-xs"
                      >
                         RECHAZAR
                      </button>
                   </div>
                </div>
              ))}
              
              {transactions.filter(t => t.status === 'pending' && t.type === 'withdrawal').length === 0 && (
                <div className="p-12 text-center text-slate-700 bg-slate-900/20 rounded-3xl border-2 border-dashed border-white/5">
                   No hay retiros pendientes
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
