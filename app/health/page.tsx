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
  const [gender, setGender] = useState("male")
  const [currentWeight, setCurrentWeight] = useState("")
  const [targetWeight, setTargetWeight] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBalance, setSelectedBalance] = useState("")
  const [selectedDensity, setSelectedDensity] = useState("Rich in Vitamins")
  const [selectedCalorie, setSelectedCalorie] = useState("")
  const [selectedSugar, setSelectedSugar] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Healthy Recipes Generated! 🥗",
        description: "Found personalized healthy recipes based on your goals!",
      })
    }, 2000)
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
          {/* Health Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Apple className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Daily Calories</p>
                    <p className="text-xl font-bold text-gray-900">1,847</p>
                    <p className="text-xs text-green-600">-153 from goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Minutes</p>
                    <p className="text-xl font-bold text-gray-900">45</p>
                    <p className="text-xs text-blue-600">+15 from yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight Progress</p>
                    <p className="text-xl font-bold text-gray-900">-2.3kg</p>
                    <p className="text-xs text-purple-600">This month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Health Score</p>
                    <p className="text-xl font-bold text-gray-900">87/100</p>
                    <p className="text-xs text-orange-600">Excellent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Goals */}
          <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Today's Nutrition Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nutritionGoals.map((goal) => (
                  <div key={goal.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                      <span className="text-sm text-gray-600">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{Math.round((goal.current / goal.target) * 100)}% complete</span>
                      <span>
                        {goal.target - goal.current} {goal.unit} to go
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Profile Form */}
          <Card className="border-green-200/50 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Health Profile & Recipe Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
                  Preferred Ingredients
                </Label>
                <Textarea
                  id="ingredients"
                  placeholder="Enter ingredients you'd like to include. Example: (Spinach, Quinoa, Salmon, Avocado)"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="min-h-[80px] border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Gender</Label>
                <div className="flex gap-3">
                  <Button
                    variant={gender === "male" ? "default" : "outline"}
                    onClick={() => setGender("male")}
                    className={`rounded-xl ${
                      gender === "male"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "border-green-200 hover:bg-green-50"
                    }`}
                  >
                    Male
                  </Button>
                  <Button
                    variant={gender === "female" ? "default" : "outline"}
                    onClick={() => setGender("female")}
                    className={`rounded-xl ${
                      gender === "female"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "border-green-200 hover:bg-green-50"
                    }`}
                  >
                    Female
                  </Button>
                </div>
              </div>

              {/* Weight Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-weight" className="text-sm font-medium text-gray-700">
                    Current Weight (kg)
                  </Label>
                  <Input
                    id="current-weight"
                    type="number"
                    placeholder="Enter current weight"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="border-green-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-weight" className="text-sm font-medium text-gray-700">
                    Target Weight (kg)
                  </Label>
                  <Input
                    id="target-weight"
                    type="number"
                    placeholder="Enter target weight"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="border-green-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Dish Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Meal Category</Label>
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

              {/* Macronutrient Balance */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Macronutrient Focus</Label>
                <div className="flex flex-wrap gap-2">
                  {["High Protein", "Low Carb", "Balanced", "High Fiber"].map((balance) => (
                    <Button
                      key={balance}
                      variant={selectedBalance === balance ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBalance(balance)}
                      className={
                        selectedBalance === balance
                          ? "bg-green-500 hover:bg-green-600"
                          : "border-green-200 hover:bg-green-50"
                      }
                    >
                      {balance}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Nutrient Density */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Nutrient Focus</Label>
                <div className="flex flex-wrap gap-2">
                  {["Rich in Vitamins", "High in Minerals", "Antioxidant Rich", "Heart Healthy"].map((density) => (
                    <Button
                      key={density}
                      variant={selectedDensity === density ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDensity(density)}
                      className={
                        selectedDensity === density
                          ? "bg-green-500 hover:bg-green-600"
                          : "border-green-200 hover:bg-green-50"
                      }
                    >
                      {density}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calorie Control */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Calorie Target</Label>
                <div className="flex flex-wrap gap-2">
                  {["Low (1200-1500)", "Medium (1500-2000)", "High (2000+)"].map((calorie) => (
                    <Button
                      key={calorie}
                      variant={selectedCalorie === calorie ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCalorie(calorie)}
                      className={
                        selectedCalorie === calorie
                          ? "bg-green-500 hover:bg-green-600"
                          : "border-green-200 hover:bg-green-50"
                      }
                    >
                      {calorie}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sugar Preference */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Sugar Preference</Label>
                <div className="flex flex-wrap gap-2">
                  {["No Added Sugar", "Low Sugar", "Sugar Free", "Natural Sweeteners"].map((sugar) => (
                    <Button
                      key={sugar}
                      variant={selectedSugar === sugar ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSugar(sugar)}
                      className={
                        selectedSugar === sugar
                          ? "bg-green-500 hover:bg-green-600"
                          : "border-green-200 hover:bg-green-50"
                      }
                    >
                      {sugar}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Healthy Recipes...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Generate Healthy Recipes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recommended Healthy Recipes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended Healthy Recipes</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Personalized for you
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {healthyRecipes.map((recipe) => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
