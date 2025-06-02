"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoadingQuotes } from "@/components/loading-quotes"
import { GraffitiEffect } from "@/components/graffiti-effect"

interface User {
  id: string
  email: string
  username: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [showGraffitiEffect, setShowGraffitiEffect] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if user is logged in on mount
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token with backend
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user)
          } else {
            localStorage.removeItem("token")
          }
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [mounted])

  // Redirect logic - only redirect after loading is complete and component is mounted
  useEffect(() => {
    if (!loading && mounted) {
      const isAuthPage = pathname.startsWith("/auth")

      if (!user && !isAuthPage) {
        router.push("/auth/signin")
      } else if (user && isAuthPage) {
        router.push("/")
      }
    }
  }, [user, loading, pathname, router, mounted])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setShowGraffitiEffect(true) // Trigger graffiti effect
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setShowGraffitiEffect(true) // Trigger graffiti effect
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/auth/signin")
  }

  // Show loading quotes while checking authentication
  if (loading || !mounted) {
    return <LoadingQuotes isLoading={true} />
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
      <GraffitiEffect isActive={showGraffitiEffect} onComplete={() => setShowGraffitiEffect(false)} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
