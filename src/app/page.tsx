'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, ShieldCheck, Zap, Globe, Coins, ArrowRight, Menu, X, Users, DollarSign, Wallet } from 'lucide-react'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-emerald-300 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Coins className="text-[#020617] w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">UNIVERSAL PROFITS</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-white/60 hover:text-emerald-400 transition-colors">Tecnología</Link>
            <Link href="#statistics" className="text-white/60 hover:text-emerald-400 transition-colors">Seguridad</Link>
            <Link href="/login" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#020617] font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
              Acceso Inversor
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white/50">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <motion.div 
            initial={false}
            animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-slate-900 border-b border-white/5"
        >
            <div className="flex flex-col p-6 gap-4 font-bold tracking-tight">
                <Link href="/login" className="py-3 text-emerald-400 border-b border-white/5">Acceso</Link>
                <Link href="/register" className="py-3">Registro</Link>
            </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden lg:pt-48 lg:pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                 Pool de Liquidez Activo (NASDAQ/DOW JONES)
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] lg:leading-[0.85] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 mb-8">
                TU CAPITAL,<br />POTENCIADO AL <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8 italic">MÁXIMO.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12">
                Experimenta el poder del 1.25% de dividendo diario garantizado mediante algoritmos de alta frecuencia y reserva institucional 1:1.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8"
            >
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-[#020617] text-lg font-black rounded-2xl transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30">
                Iniciar Inversión
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-lg font-bold transition-all backdrop-blur-xl">
                Ver Panel Real
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Asset Display */}
        <div className="mt-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 opacity-60">
                {[
                    { l: 'NASDAQ', v: '+2.41%', c: 'text-emerald-400' },
                    { l: 'DOW JONES', v: '+1.87%', c: 'text-emerald-400' },
                    { l: 'GOLD (XAU)', v: '-0.12%', c: 'text-rose-400' },
                    { l: 'USDT (TRC20)', v: 'STABLE', c: 'text-blue-400' }
                ].map((a, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{a.l}</p>
                        <p className={`text-lg font-black ${a.c}`}>{a.v}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Seguridad Institucional</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Tus fondos están resguardados por carteras Multifirma y Reder de Liquidez TRC20, asegurando retiros inmediatos 24/7.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ganancia Automatizada</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Nuestro motor de beneficios aplica el 1.25% fijo cada vez que inicias sesión, eliminando complicaciones externas.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Alcance Global</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Opera desde cualquier país del mundo. La universalidad del USDT nos permite despliegues financieros sin fronteras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-sm font-medium">
          <p>© 2026 UNIVERSAL PROFITS | Plataforma Cuántica Certificada</p>
          <div className="mt-4 flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <span>Binance</span>
              <span>KuCoin</span>
              <span>Kraken</span>
              <span>Coinbase</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
