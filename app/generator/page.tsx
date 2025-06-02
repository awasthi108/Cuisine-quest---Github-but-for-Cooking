"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ChefHat, Clock, Users } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { getRandomMeals, type Meal } from "@/lib/meal-api"
import { useToast } from "@/hooks/use-toast"

export default function GeneratorPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipes, setGeneratedRecipes] = useState<Meal[]>([])

  // Form state
  const [ingredients, setIngredients] = useState("")
  const [chefStyle, setChefStyle] = useState(false)
  const [country, setCountry] = useState("")
  const [dishCategory, setDishCategory] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [cookingMethod, setCookingMethod] = useState("")
  const [michelinRecipe, setMichelinRecipe] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Generate 3-4 random recipes as requested
      const recipes = await getRandomMeals(4)
      setGeneratedRecipes(recipes)

      toast({
        title: "Recipes Generated! 🎉",
        description: `Found ${recipes.length} amazing recipes for you to try!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setIngredients("")
    setChefStyle(false)
    setCountry("")
    setDishCategory("")
    setCuisine("")
    setCookingMethod("")
    setMichelinRecipe(false)
    setGeneratedRecipes([])
  }

  return (
    <SidebarInset>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-orange-200/50 p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Recipe Generator</h1>
                <p className="text-gray-600">Create personalized recipes with AI</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Generator Form */}
          <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <ChefHat className="w-5 h-5" />
                Recipe Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
                  Main Ingredients
                </Label>
                <Textarea
                  id="ingredients"
                  placeholder="Enter base ingredients here. Example: (1 Onion, 1 Garlic, 3 Tomatoes, 2 Carrots)"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="min-h-[80px] border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              {/* Chef Style Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50/50 border border-orange-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Apply Popular Chef Style?</Label>
                  <p className="text-xs text-gray-500 mt-1">Get recipes inspired by famous chefs</p>
                </div>
                <Switch
                  checked={chefStyle}
                  onCheckedChange={setChefStyle}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italy">Italy</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="china">China</SelectItem>
                      <SelectItem value="japan">Japan</SelectItem>
                      <SelectItem value="mexico">Mexico</SelectItem>
                      <SelectItem value="thailand">Thailand</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dish Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Dish Category</Label>
                  <div className="flex gap-2">
                    {["Breakfast", "Lunch", "Dinner"].map((category) => (
                      <Button
                        key={category}
                        variant={dishCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDishCategory(category)}
                        className={
                          dishCategory === category
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "border-orange-200 hover:bg-orange-50"
                        }
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cuisine */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Cuisine</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Italian", "Mexican", "Asian", "Vegetarian"].map((type) => (
                      <Button
                        key={type}
                        variant={cuisine === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCuisine(type)}
                        className={
                          cuisine === type
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "border-orange-200 hover:bg-orange-50"
                        }
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cooking Method */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Cooking Method</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Baking", "Grilling", "Frying", "Sautéing"].map((method) => (
                      <Button
                        key={method}
                        variant={cookingMethod === method ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCookingMethod(method)}
                        className={
                          cookingMethod === method
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "border-orange-200 hover:bg-orange-50"
                        }
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Michelin Recipe Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50/50 border border-purple-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Michelin Recipe</Label>
                  <p className="text-xs text-gray-500 mt-1">Generate restaurant-quality recipes</p>
                </div>
                <Switch
                  checked={michelinRecipe}
                  onCheckedChange={setMichelinRecipe}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Let's Cook!
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="px-6 h-12 border-orange-200 hover:bg-orange-50"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Recipes */}
          {generatedRecipes.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Generated Recipes</h2>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {generatedRecipes.length} recipes
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {generatedRecipes.length === 0 && (
            <Card className="border-orange-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Sparkles className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Recipes?</h3>
                <p className="text-gray-600 mb-6">
                  Fill in your preferences above and click "Let's Cook!" to generate personalized recipes.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Quick Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Multiple Recipes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    <span>Chef Quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
