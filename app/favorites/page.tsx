"use client"

import { useEffect, useState } from "react"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, RefreshCw } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { useToast } from "@/hooks/use-toast"
import type { Meal } from "@/lib/meal-api"

interface FavoriteRecipe extends Meal {
  addedAt: string
}

export default function FavoritesPage() {
  const { user } = useFirebaseAuth()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const loadFavorites = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (mealId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/favorites?mealId=${mealId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.mealId !== mealId))
        toast({
          title: "Removed from favorites",
          description: "Recipe has been removed from your favorites",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-orange-200/50 p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
                <p className="text-gray-600">Your saved recipes</p>
              </div>
            </div>
            <div className="ml-auto">
              <Button variant="outline" onClick={loadFavorites} className="border-orange-200 hover:bg-orange-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <div key={recipe.mealId} className="relative">
                  <RecipeCard recipe={recipe} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600"
                    onClick={() => removeFavorite(recipe.mealId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Heart className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring recipes and add them to your favorites to see them here.
                </p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Explore Recipes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
