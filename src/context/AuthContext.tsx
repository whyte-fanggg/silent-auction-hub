import { useEffect, useState, ReactNode } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"
import { AuthContext } from "./AuthContextInstance"

export type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("🔥 getSession() ->", data)
      setUser(data.session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("📦 Auth state change:", session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    setUser(data.user ?? null)
  }

  const register = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    setUser(data.user ?? null)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
