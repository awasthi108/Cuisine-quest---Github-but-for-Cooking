"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Users, Eye } from "lucide-react"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { Meal } from "@/lib/meal-api"
import Link from "next/link"

interface RecipeCardProps {
  recipe: Meal
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useFirebaseAuth()
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save favorites",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      if (isFavorited) {
        const response = await fetch(`/api/favorites?mealId=${recipe.idMeal}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          setIsFavorited(false)
          toast({
            title: "Removed from favorites",
            description: "Recipe has been removed from your favorites",
          })
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealId: recipe.idMeal,
            mealData: {
              strMeal: recipe.strMeal,
              strMealThumb: recipe.strMealThumb,
              strCategory: recipe.strCategory,
              strArea: recipe.strArea,
              strInstructions: recipe.strInstructions,
              strTags: recipe.strTags,
            },
          }),
        })

        if (response.ok) {
          setIsFavorited(true)
          toast({
            title: "Added to favorites",
            description: "Recipe has been saved to your favorites",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group overflow-hidden border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={recipe.strMealThumb || "/placeholder.svg"}
          alt={recipe.strMeal}
          className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 w-7 h-7 lg:w-8 lg:h-8 bg-white hover:bg-slate-50"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`w-3 h-3 lg:w-4 lg:h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-600"}`}
          />
        </Button>

        {/* View Button */}
        <Link href={`/recipes/${recipe.idMeal}`}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 w-7 h-7 lg:w-8 lg:h-8 bg-white hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Eye className="w-3 h-3 lg:w-4 lg:h-4 text-slate-600" />
          </Button>
        </Link>
      </div>

      <CardContent className="p-3 lg:p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm lg:text-base text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {recipe.strMeal}
          </h3>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-200 text-slate-700 text-xs">
              {recipe.strCategory}
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs">
              {recipe.strArea}
            </Badge>
          </div>

          {recipe.strTags && (
            <div className="flex flex-wrap gap-1">
              {recipe.strTags
                .split(",")
                .slice(0, 2)
                .map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-slate-200 text-slate-600">
                    {tag.trim()}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 lg:p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
            <span>30 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 lg:w-4 lg:h-4" />
            <span>4 servings</span>
          </div>
        </div>

        <Link href={`/recipes/${recipe.idMeal}`}>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs lg:text-sm h-7 lg:h-8 px-2 lg:px-3"
          >
            View Recipe
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
