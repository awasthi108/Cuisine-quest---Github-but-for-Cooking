"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Users, Menu } from "lucide-react"
import { ChefCarousel } from "@/components/chef-carousel"
import { RecipeCard } from "@/components/recipe-card"
import { LoadingQuotes } from "@/components/loading-quotes"
import { searchMealByName, getRandomMeals, type Meal } from "@/lib/meal-api"
import { useToast } from "@/hooks/use-toast"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"

export default function HomePage() {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingRecipes, setTrendingRecipes] = useState<Meal[]>([])
  const [searchResults, setSearchResults] = useState<Meal[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loadingTrending, setLoadingTrending] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadTrendingRecipes()
    }
  }, [user])

  const loadTrendingRecipes = async () => {
    try {
      // Load only 6 recipes instead of 12, then filter
      const meals = await getRandomMeals(8)
      const vegetarianMeals = meals.filter((meal) =>
        meal.strCategory === "Vegetarian" || 
        meal.strMeal.toLowerCase().includes("vegetarian") ||
        meal.strTags?.toLowerCase().includes("vegetarian")
      )
      const finalMeals = vegetarianMeals.length > 0 ? vegetarianMeals.slice(0, 6) : meals.slice(0, 6)
      setTrendingRecipes(finalMeals)
      setLoadingTrending(false)
    } catch (error) {
      console.error("Error loading trending recipes:", error)
      setLoadingTrending(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchMealByName(searchQuery)
      // Filter to show only vegetarian recipes
      const vegetarianResults = results.filter((meal) =>
        meal.strCategory === "Vegetarian" || 
        meal.strMeal.toLowerCase().includes("vegetarian") ||
        meal.strTags?.toLowerCase().includes("vegetarian")
      )
      const finalResults = vegetarianResults.length > 0 ? vegetarianResults : results
      setSearchResults(finalResults)
      if (finalResults.length === 0) {
        toast({
          title: "No results",
          description: "No vegetarian recipes found for your search query",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search recipes",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  if (loading) {
    return <LoadingQuotes isLoading={true} />
  }

  if (!user) {
    return null
  }

  const displayRecipes = searchResults.length > 0 ? searchResults : trendingRecipes

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 p-4 lg:hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900">Hello, {user?.displayName || user?.email || 'Chef'}</h1>
              <p className="text-sm text-slate-600">What would you like to cook today?</p>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 bg-white border-b border-slate-200 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.displayName || user?.email || 'Chef'}</h1>
            <p className="text-slate-600">What would you like to cook today?</p>
          </div>
        </header>

        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Search Bar */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 lg:w-5 lg:h-5" />
                  <Input
                    placeholder="Search for recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 lg:pl-12 h-10 lg:h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2 lg:gap-4">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="h-10 lg:h-12 bg-emerald-600 hover:bg-emerald-700 text-white px-4 lg:px-6"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  {searchResults.length > 0 && (
                    <Button
                      type="button"
                      onClick={clearSearch}
                      variant="outline"
                      className="h-10 lg:h-12 border-slate-200 hover:bg-slate-50"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Top Chefs Carousel */}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Top Chefs</h2>
            <ChefCarousel />
          </div>

          {/* Food Categories */}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">Popular Categories</h2>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {["Chicken", "Beef", "Seafood", "Vegetarian", "Dessert", "Pasta", "Soup", "Salad"].map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-3 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer transition-colors"
                  onClick={() => {
                    setSearchQuery(category)
                    handleSearch({ preventDefault: () => {} } as React.FormEvent)
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recipes Section */}
          <div>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                {searchResults.length > 0 ? "Search Results" : "Trending Recipes"}
              </h2>
              {searchResults.length === 0 && (
                <Button
                  variant="outline"
                  onClick={loadTrendingRecipes}
                  disabled={loadingTrending}
                  className="border-slate-200 hover:bg-slate-50 text-sm lg:text-base"
                >
                  Refresh
                </Button>
              )}
            </div>

            {loadingTrending ? (
              <LoadingQuotes isLoading={true} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {displayRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            )}

            {displayRecipes.length === 0 && !loadingTrending && (
              <Card className="border-slate-200 bg-white">
                <CardContent className="p-8 lg:p-12 text-center">
                  <div className="text-slate-400 mb-4">
                    <Search className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-2">No recipes found</h3>
                  <p className="text-slate-600 text-sm lg:text-base">
                    Try searching for something else or check out our trending recipes.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Learn More Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2 text-lg lg:text-xl">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                  Healthful Meal Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm lg:text-base">
                  Discover nutritious recipes tailored to your health goals and dietary preferences.
                </p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-sm lg:text-base"
                  onClick={() => router.push("/health")}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2 text-lg lg:text-xl">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                  Recipe Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4 text-sm lg:text-base">
                  Generate personalized recipes using AI based on your preferences and ingredients.
                </p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-sm lg:text-base"
                  onClick={() => router.push("/generator")}
                >
                  Explore Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
