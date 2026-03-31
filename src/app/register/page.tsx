'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) {
      alert(error.message)
    } else if (data.user) {
      // Create profile entry via RPC or just navigate (database trigger handles this usually)
      alert('¡Registro exitoso! Por favor, verifica tu correo electrónico.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
        
        <div className="relative text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Crear Cuenta</h1>
          <p className="text-slate-400">Únete a la nueva era financiera</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
           <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nombre de Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="tu_nombre_inv"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Empezar ahora'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <a href="/login" className="text-amber-500 hover:underline">Inicia Sesión</a>
        </div>
      </div>
    </div>
  )
}
