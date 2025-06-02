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
      }, 3500) // Total duration: 3.5 seconds

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete, mounted])

  if (!mounted || !isActive) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Animated Background - darker for better contrast */}
      <div className="absolute inset-0 bg-black/20 animate-pulse" />

      {/* Spray Paint Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#ff4757", "#3742fa"][
                Math.floor(Math.random() * 8)
              ],
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${0.8 + Math.random() * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Large Spray Splashes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-70 animate-ping" />
      <div
        className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-ping"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-50 animate-ping"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-10 right-10 w-18 h-18 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-60 animate-ping"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Main Welcome Text - Enhanced */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent transform rotate-2 animate-bounce drop-shadow-2xl">
            WELCOME TO
          </h1>
          <h2
            className="text-4xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent transform -rotate-1 mt-4 animate-bounce drop-shadow-2xl"
            style={{ animationDelay: "0.3s" }}
          >
            CUISINE QUEST!
          </h2>
          <div
            className="text-2xl md:text-3xl font-bold text-yellow-400 mt-4 animate-pulse"
            style={{ animationDelay: "0.6s" }}
          >
            🎉 LET'S START COOKING! 🎉
          </div>
        </div>
      </div>

      {/* Graffiti Elements - Enhanced */}
      <div className="absolute top-20 left-10 text-4xl animate-spin" style={{ animationDuration: "2s" }}>
        🎨
      </div>
      <div className="absolute top-32 right-20 text-4xl animate-bounce" style={{ animationDelay: "0.2s" }}>
        🍳
      </div>
      <div className="absolute bottom-20 left-32 text-4xl animate-pulse" style={{ animationDelay: "0.4s" }}>
        ⭐
      </div>
      <div
        className="absolute bottom-32 right-10 text-4xl animate-spin"
        style={{ animationDelay: "0.6s", animationDuration: "1.5s" }}
      >
        🚀
      </div>

      {/* Street Art Style Text */}
      <div className="absolute top-1/4 left-10 transform rotate-12 text-orange-500 font-black text-xl opacity-90 animate-pulse">
        FRESH!
      </div>
      <div
        className="absolute bottom-1/4 right-10 transform -rotate-12 text-purple-500 font-black text-xl opacity-90 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        AMAZING!
      </div>
      <div
        className="absolute top-3/4 left-1/4 transform rotate-6 text-green-500 font-black text-xl opacity-90 animate-bounce"
        style={{ animationDelay: "1s" }}
      >
        COOK IT!
      </div>
      <div
        className="absolute top-1/3 right-1/4 transform -rotate-6 text-blue-500 font-black text-xl opacity-90 animate-bounce"
        style={{ animationDelay: "1.2s" }}
      >
        DELICIOUS!
      </div>

      {/* Fade Out Animation - FIXED: Only starts at the very end */}
      <div
        className="absolute inset-0 bg-white opacity-0"
        style={{
          animation: "fadeOut 0.5s ease-in-out 3s forwards",
        }}
      />

      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
