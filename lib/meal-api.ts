export interface Meal {
  idMeal: string
  strMeal: string
  strDrinkAlternate?: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags?: string
  strYoutube?: string
  strIngredient1?: string
  strIngredient2?: string
  strIngredient3?: string
  strIngredient4?: string
  strIngredient5?: string
  strIngredient6?: string
  strIngredient7?: string
  strIngredient8?: string
  strIngredient9?: string
  strIngredient10?: string
  strIngredient11?: string
  strIngredient12?: string
  strIngredient13?: string
  strIngredient14?: string
  strIngredient15?: string
  strIngredient16?: string
  strIngredient17?: string
  strIngredient18?: string
  strIngredient19?: string
  strIngredient20?: string
  strMeasure1?: string
  strMeasure2?: string
  strMeasure3?: string
  strMeasure4?: string
  strMeasure5?: string
  strMeasure6?: string
  strMeasure7?: string
  strMeasure8?: string
  strMeasure9?: string
  strMeasure10?: string
  strMeasure11?: string
  strMeasure12?: string
  strMeasure13?: string
  strMeasure14?: string
  strMeasure15?: string
  strMeasure16?: string
  strMeasure17?: string
  strMeasure18?: string
  strMeasure19?: string
  strMeasure20?: string
}

export interface MealResponse {
  meals: Meal[] | null
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export async function searchMealByName(name: string): Promise<Meal[]> {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`)
    const data: MealResponse = await response.json()
    return data.meals || []
  } catch (error) {
    console.error("Error searching meals:", error)
    return []
  }
}

export async function getMealsByFirstLetter(letter: string): Promise<Meal[]> {
  try {
    const response = await fetch(`${BASE_URL}/search.php?f=${letter}`)
    const data: MealResponse = await response.json()
    return data.meals || []
  } catch (error) {
    console.error("Error getting meals by letter:", error)
    return []
  }
}

export async function getMealById(id: string): Promise<Meal | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
    const data: MealResponse = await response.json()
    return data.meals?.[0] || null
  } catch (error) {
    console.error("Error getting meal by ID:", error)
    return null
  }
}

export async function getRandomMeal(): Promise<Meal | null> {
  try {
    const response = await fetch(`${BASE_URL}/random.php`)
    const data: MealResponse = await response.json()
    return data.meals?.[0] || null
  } catch (error) {
    console.error("Error getting random meal:", error)
    return null
  }
}

export async function getRandomMeals(count = 4): Promise<Meal[]> {
  const meals: Meal[] = []

  for (let i = 0; i < count; i++) {
    const meal = await getRandomMeal()
    if (meal) {
      meals.push(meal)
    }
  }

  return meals
}

export function formatMealIngredients(meal: Meal): Array<{ ingredient: string; measure: string }> {
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string
    const measure = meal[`strMeasure${i}` as keyof Meal] as string

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      })
    }
  }

  return ingredients
}
