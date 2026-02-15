"use client"

import { useEffect, useState } from "react"

const cookingQuotes = [
  "Cooking is love made visible.",
  "The secret ingredient is always love.",
  "Good food is the foundation of genuine happiness.",
  "Cooking is an art that requires knowing the technique.",
  "A recipe has no soul. You must bring soul to it.",
  "Great cooking is about being inspired by simple things.",
  "The best meals are those shared with people you love.",
  "Cooking is a way of giving. It's an act of love.",
]

interface LoadingQuotesProps {
  isLoading: boolean
}

export function LoadingQuotes({ isLoading }: LoadingQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState("")

  useEffect(() => {
    if (isLoading) {
      const randomQuote = cookingQuotes[Math.floor(Math.random() * cookingQuotes.length)]
      setCurrentQuote(randomQuote)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>

          <p className="text-base font-normal text-slate-700 max-w-md mx-auto leading-relaxed">{currentQuote}</p>

          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    </div>
  )
}
