'use client'

import { ReactNode, useEffect, useState, createContext, useContext } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'
import { LoadingQuotes } from '@/components/loading-quotes'

interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
}

export const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
})

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [mounted])

  // Handle redirects after both mounted and auth state are ready
  useEffect(() => {
    if (!mounted || loading) return

    const isAuthPage = pathname.startsWith('/auth')

    if (!user && !isAuthPage) {
      router.push('/auth/signin')
    }
  }, [user, loading, pathname, router, mounted])

  if (!mounted || loading) {
    return <LoadingQuotes isLoading={true} />
  }

  return (
    <FirebaseAuthContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider')
  }
  return context
}
