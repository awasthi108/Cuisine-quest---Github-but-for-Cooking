'use client'

import { ReactNode, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/loading-quotes'

interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
}

export const FirebaseAuthContext = React.createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
})

import React from 'react'

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      // Redirect unauthenticated users to signin
      if (!currentUser && typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (!currentPath.startsWith('/auth')) {
          router.push('/auth/signin')
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <Loading />
  }

  return (
    <FirebaseAuthContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = React.useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider')
  }
  return context
}
