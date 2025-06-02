"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Users, ChefHat, Play, Pause, RotateCcw, Share2 } from "lucide-react"
import { getMealById, formatMealIngredients, type Meal } from "@/lib/meal-api"
import { useToast } from "@/hooks/use-toast"

export default function RecipeDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<Meal | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadRecipe(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerRunning(false)
            setActiveTimer(null)
            toast({
              title: "Timer finished! ⏰",
              description: "Your cooking step is complete!",
            })
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (!isTimerRunning) {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timeLeft, toast])

  const loadRecipe = async (id: string) => {
    try {
      const meal = await getMealById(id)
      setRecipe(meal)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recipe details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startTimer = (minutes: number, stepIndex: number) => {
    setActiveTimer(stepIndex)
    setTimeLeft(minutes * 60)
    setIsTimerRunning(true)
    toast({
      title: "Timer started! ⏱️",
      description: `${minutes} minute timer is now running`,
    })
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resumeTimer = () => {
    setIsTimerRunning(true)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setActiveTimer(null)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const shareRecipe = () => {
    if (navigator.share && recipe) {
      navigator.share({
        title: recipe.strMeal,
        text: `Check out this amazing recipe: ${recipe.strMeal}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Recipe link has been copied to clipboard",
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

  if (!recipe) {
    return (
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
          <div className="flex items-center justify-center min-h-screen">
            <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipe not found</h3>
                <p className="text-gray-600">The recipe you're looking for doesn't exist.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    )
  }

  const ingredients = formatMealIngredients(recipe)
  const instructions = recipe.strInstructions.split(".").filter((step) => step.trim().length > 0)

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-orange-200/50 p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{recipe.strMeal}</h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {recipe.strCategory}
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-600">
                  {recipe.strArea}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={shareRecipe} className="border-orange-200 hover:bg-orange-50">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto space-y-8">
          {/* Recipe Image and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
              <img
                src={recipe.strMealThumb || "/placeholder.svg"}
                alt={recipe.strMeal}
                className="w-full h-64 lg:h-80 object-cover"
              />
            </Card>

            <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  Recipe Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>45 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>4 servings</span>
                  </div>
                </div>

                {recipe.strTags && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.strTags.split(",").map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-gray-200 text-gray-600">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {recipe.strYoutube && (
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => window.open(recipe.strYoutube, "_blank")}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video Tutorial
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingredients */}
          <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-orange-50/50">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="font-medium text-gray-900">{item.measure}</span>
                    <span className="text-gray-600">{item.ingredient}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions with Timer */}
          <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              {activeTimer !== null && (
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">{formatTime(timeLeft)}</div>
                  <div className="flex gap-2">
                    {isTimerRunning ? (
                      <Button size="sm" variant="outline" onClick={pauseTimer}>
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={resumeTimer}>
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={resetTimer}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {instructions.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{step.trim()}.</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startTimer(5, index)}
                          className="border-orange-200 hover:bg-orange-50"
                        >
                          <Clock className="w-3 h-3 mr-1" />5 min
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startTimer(10, index)}
                          className="border-orange-200 hover:bg-orange-50"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          10 min
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startTimer(15, index)}
                          className="border-orange-200 hover:bg-orange-50"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          15 min
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
