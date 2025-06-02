"use client"

import { useEffect, useState } from "react"
import { ChefHat } from "lucide-react"

const cookingQuotes = [
  "Cooking is love made visible. ❤️",
  "The secret ingredient is always love. 🥰",
  "Good food is the foundation of genuine happiness. 😊",
  "Cooking is an art, but all art requires knowing something about the technique. 🎨",
  "A recipe has no soul. You, as the cook, must bring soul to the recipe. 👨‍🍳",
  "Cooking is like painting or writing a song. Just as there are only so many notes or colors, there are only so many flavors. 🎵",
  "The kitchen is the heart of the home. 🏠",
  "Food is symbolic of love when words are inadequate. 💕",
  "Cooking is not about convenience. It's about love. 💝",
  "Great cooking is about being inspired by the simple things around you. ✨",
  "The best meals are those shared with the people you love. 👨‍👩‍👧‍👦",
  "Cooking is a way of giving. It's an act of love. 🎁",
]

interface LoadingQuotesProps {
  isLoading: boolean
  hideForGraffiti?: boolean
}

export function LoadingQuotes({ isLoading, hideForGraffiti = false }: LoadingQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState("")

  useEffect(() => {
    if (isLoading && !hideForGraffiti) {
      const randomQuote = cookingQuotes[Math.floor(Math.random() * cookingQuotes.length)]
      setCurrentQuote(randomQuote)
    }
  }, [isLoading, hideForGraffiti])

  // Don't show loading quotes if graffiti effect should be prioritized
  if (!isLoading || hideForGraffiti) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100 flex items-center justify-center z-40">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center animate-bounce">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-orange-400/20 rounded-full animate-ping" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>

          <p className="text-xl font-medium text-gray-800 max-w-md mx-auto leading-relaxed">{currentQuote}</p>

          <p className="text-sm text-gray-600">Preparing your culinary adventure...</p>
        </div>
      </div>
    </div>
  )
}
