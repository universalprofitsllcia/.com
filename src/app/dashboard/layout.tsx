'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BarChart3, 
  Wallet, 
  History, 
  User, 
  ShieldAlert, 
  LogOut,
  Menu,
  X,
  CreditCard
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
      
      // Auto-update earnings on visit
      await supabase.rpc('apply_auto_profits', { target_uid: user.id })
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { label: 'Resumen', icon: BarChart3, href: '/dashboard' },
    { label: 'Invertir', icon: Wallet, href: '/dashboard/invest' },
    { label: 'Retirar', icon: CreditCard, href: '/dashboard/withdraw' },
    { label: 'Transacciones', icon: History, href: '/dashboard/transactions' },
    { label: 'Perfil', icon: User, href: '/dashboard/profile' },
  ]

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-200 bg-clip-text text-transparent">Universal Profits</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-slate-800 hover:text-amber-500 transition-all group"
              >
                <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {profile?.is_admin && (
              <Link
                href="/admin"
                className="flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Panel Admin</span>
              </Link>
            )}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-2xl overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold border border-amber-500/30">
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.username || 'Cargando...'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-all text-slate-400 group"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-500" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-8 z-30">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:flex items-center gap-2 text-slate-500 text-sm">
            <span>Universal Profiles</span>
            <span>&raquo;</span>
            <span className="text-slate-300 font-medium">Dashboard Lux</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Estado de Cuenta</span>
               <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Operativo
               </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
