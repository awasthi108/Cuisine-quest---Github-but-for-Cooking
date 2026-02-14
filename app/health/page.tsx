"use client"

import { useState } from "react"
import { useFirebaseAuth } from "@/components/firebase-auth-provider"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Target, TrendingUp, Menu, Apple, Zap, Shield } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { useToast } from "@/hooks/use-toast"

// Mock health recipes data
const healthyRecipes = [
  {
    idMeal: "health1",
    strMeal: "Quinoa Buddha Bowl",
    strCategory: "Healthy",
    strArea: "International",
    strMealThumb: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    strInstructions: "A nutritious bowl packed with quinoa, vegetables, and healthy fats.",
    strTags: "Healthy,Vegetarian,High Protein",
  },
  {
    idMeal: "health2",
    strMeal: "Grilled Salmon with Avocado",
    strCategory: "Healthy",
    strArea: "Mediterranean",
    strMealThumb: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    strInstructions: "Omega-3 rich salmon with heart-healthy avocado.",
    strTags: "Healthy,High Protein,Low Carb",
  },
  {
    idMeal: "health3",
    strMeal: "Green Smoothie Bowl",
    strCategory: "Healthy",
    strArea: "International",
    strMealThumb: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
    strInstructions: "Nutrient-dense smoothie bowl with superfoods.",
    strTags: "Healthy,Vegetarian,Antioxidants",
  },
]

// Mock nutrition data
const nutritionGoals = [
  { name: "Protein", current: 65, target: 80, unit: "g", color: "bg-blue-500" },
  { name: "Fiber", current: 22, target: 25, unit: "g", color: "bg-green-500" },
  { name: "Vitamins", current: 85, target: 100, unit: "%", color: "bg-yellow-500" },
  { name: "Water", current: 6, target: 8, unit: "glasses", color: "bg-cyan-500" },
]

export default function HealthPage() {
  const { user } = useFirebaseAuth()
  const { toast } = useToast()
  const [preferences, setPreferences] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showRecipeAfterGenerate, setShowRecipeAfterGenerate] = useState(false)
  const [randomRecipe, setRandomRecipe] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate API call and load random recipe
    setTimeout(async () => {
      try {
        const { getRandomMeals } = await import("@/lib/meal-api")
        const meals = await getRandomMeals(1)
        setRandomRecipe(meals[0])
        setShowRecipeAfterGenerate(true)
        setIsGenerating(false)
        toast({
          title: "Recipe suggestion ready",
          description: "Here's a healthy recipe for you!",
        })
      } catch (error) {
        setIsGenerating(false)
        toast({
          title: "Error",
          description: "Failed to load recipe",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  if (!user) {
    return null
  }

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green-200/50 p-4 lg:hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Health Mode</h1>
                <p className="text-sm text-gray-600">Personalized nutrition</p>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green-200/50 p-6">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Healthy Recipe Generator</h1>
              <p className="text-gray-600">Personalized nutrition for your health goals</p>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 lg:space-y-8">

          {/* Simple Health Form */}
          <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Healthy Recipe Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferences" className="text-sm font-medium text-gray-700">
                  What you're in the mood for (optional)
                </Label>
                <Textarea
                  id="preferences"
                  placeholder="e.g., something light, quick to make, high protein..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="min-h-[60px] border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Meal Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-green-500 hover:bg-green-600"
                          : "border-green-200 hover:bg-green-50"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading recipe...
                  </>
                ) : (
                  "Get Recipe Suggestion"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recipe Suggestion */}
          {showRecipeAfterGenerate && randomRecipe && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Suggestion</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <RecipeCard recipe={randomRecipe} />
              </div>
            </div>
          )}

          {/* Default Healthy Recipes */}
          {!showRecipeAfterGenerate && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Healthy Recipes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {healthyRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
