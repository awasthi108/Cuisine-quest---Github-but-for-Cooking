"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ChefHat, Menu } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { searchMealByName, getMealsByFirstLetter, type Meal } from "@/lib/meal-api"
import { useToast } from "@/hooks/use-toast"

const categories = ["All", "Chicken", "Beef", "Seafood", "Vegetarian", "Dessert", "Pasta", "Soup", "Salad"]
const areas = [
  "All",
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Vietnamese",
]

export default function RecipesPage() {
  const { user } = useFirebaseAuth()
  const { toast } = useToast()
  const [recipes, setRecipes] = useState<Meal[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Meal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedArea, setSelectedArea] = useState("All")
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadInitialRecipes()
  }, [])

  useEffect(() => {
    filterRecipes()
  }, [recipes, searchQuery, selectedCategory, selectedArea])

  const loadInitialRecipes = async () => {
    try {
      // Load random recipes from different letters to get variety
      const letters = ["a", "b", "c", "d", "e"]
      const allRecipes: Meal[] = []

      for (const letter of letters) {
        const meals = await getMealsByFirstLetter(letter)
        allRecipes.push(...meals.slice(0, 4)) // Take 4 recipes from each letter
      }

      // Shuffle the recipes for variety
      const shuffled = allRecipes.sort(() => Math.random() - 0.5)
      setRecipes(shuffled)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recipes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterRecipes = () => {
    let filtered = recipes

    // Always filter to show only vegetarian recipes
    filtered = filtered.filter((recipe) =>
      recipe.strCategory === "Vegetarian" || 
      recipe.strMeal.toLowerCase().includes("vegetarian") ||
      recipe.strTags?.toLowerCase().includes("vegetarian")
    )

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.strCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.strArea.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((recipe) => recipe.strCategory.toLowerCase().includes(selectedCategory.toLowerCase()))
    }

    // Filter by area
    if (selectedArea !== "All") {
      filtered = filtered.filter((recipe) => recipe.strArea.toLowerCase() === selectedArea.toLowerCase())
    }

    setFilteredRecipes(filtered)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchMealByName(searchQuery)
      setRecipes(results)
      if (results.length === 0) {
        toast({
          title: "No results",
          description: "No recipes found for your search query",
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

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedArea("All")
    loadInitialRecipes()
  }

  if (!user) {
    return null
  }

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-orange-200/50 p-4 lg:hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">All Recipes</h1>
                <p className="text-sm text-gray-600">Discover amazing recipes</p>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-orange-200/50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
                <p className="text-gray-600">Discover amazing recipes from around the world</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
          {/* Search and Filters */}
          <Card className="border-orange-200/50 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6 space-y-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                  <Input
                    placeholder="Search recipes, ingredients, or cuisine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 lg:pl-12 h-10 lg:h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
                <div className="flex gap-2 lg:gap-4">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="flex-1 sm:flex-none h-10 lg:h-12 px-4 lg:px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                    className="h-10 lg:h-12 px-4 lg:px-6 border-orange-200 hover:bg-orange-50"
                  >
                    Reset
                  </Button>
                </div>
              </form>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <div className="flex-1">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-10 lg:h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="h-10 lg:h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                      <SelectValue placeholder="Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== "All" || selectedArea !== "All" || searchQuery) && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Category: {selectedCategory}
                    </Badge>
                  )}
                  {selectedArea !== "All" && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Cuisine: {selectedArea}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? "s" : ""} Found
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtered results</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 lg:h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            ) : (
              <Card className="border-orange-200/50 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8 lg:p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                  <p className="text-gray-600 text-sm lg:text-base mb-6">
                    Try adjusting your search criteria or browse our featured recipes.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
