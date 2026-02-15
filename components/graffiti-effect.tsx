"use client"

import { useEffect, useState } from "react"

interface GraffitiEffectProps {
  isActive: boolean
  onComplete: () => void
}

export function GraffitiEffect({ isActive, onComplete }: GraffitiEffectProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isActive && mounted) {
      const timer = setTimeout(() => {
        onComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete, mounted])

  if (!mounted || !isActive) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-0" style={{ animation: "fadeOut 0.5s ease-in-out 0.5s forwards" }} />
      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
