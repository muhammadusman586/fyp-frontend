import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Search, ChevronDown, X, Loader2, ChefHat } from "lucide-react";
import { toast } from "react-toastify";
import {
  useToggleFavoriteMutation,
  useGetFavoritesQuery,
} from "../redux/api/favoriteApiSlice";

// Local storage keys
const STORAGE_KEYS = {
  RECIPES: "recipeRecommender_recipes",
  INGREDIENTS: "recipeRecommender_ingredients",
  NUTRITION: "recipeRecommender_nutrition",
};

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize state from local storage or location state
  const [recipes, setRecipes] = useState(() => {
    // First check if we have state from navigation
    if (location.state?.recipes) {
      return location.state.recipes;
    }
    // Then check local storage
    const savedRecipes = localStorage.getItem(STORAGE_KEYS.RECIPES);
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  
  const [ingredients, setIngredients] = useState(() => {
    if (location.state?.ingredients) {
      return location.state.ingredients;
    }
    const savedIngredients = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    return savedIngredients || "";
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { data: favorites = [], refetch: refetchFavorites } =
    useGetFavoritesQuery();

  const [nutrition, setNutrition] = useState(() => {
    if (location.state?.nutrition) {
      return location.state.nutrition;
    }
    const savedNutrition = localStorage.getItem(STORAGE_KEYS.NUTRITION);
    return savedNutrition
      ? JSON.parse(savedNutrition)
      : {
          calories: "",
          fat: "",
          carbohydrates: "",
          protein: "",
          cholesterol: "",
          sodium: "",
          fiber: "",
        };
  });

  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, ingredients);
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(nutrition));
  }, [nutrition]);

  const nutritionFields = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbohydrates", label: "Carbs", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
    { key: "fiber", label: "Fiber", unit: "g" },
    { key: "sodium", label: "Sodium", unit: "mg" },
    { key: "cholesterol", label: "Cholesterol", unit: "mg" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if input contains only numbers or is empty
    if (value !== "" && !/^\d*$/.test(value)) {
      toast.error(
        `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } must contain only numbers`
      );
      alert(
        `Please enter only numbers for ${
          name.charAt(0).toUpperCase() + name.slice(1)
        }`
      );
      return;
    }

    const numValue = Number(value);

    // Check if the value is negative
    if (numValue < 0) {
      toast.warning(
        `${name.charAt(0).toUpperCase() + name.slice(1)} can't be negative`
      );
      return;
    }

    setNutrition((prev) => ({
      ...prev,
      [name]: value === "" ? "" : numValue,
    }));
  };

  const handleIngredientsChange = (e) => {
    const value = e.target.value;

    // Allow only letters, commas, and spaces
    const isValid = /^[a-zA-Z,\s]*$/.test(value);

    if (isValid) {
      setIngredients(value);
    } else {
      toast.warn(
        "Ingredients should contain only letters, commas, and spaces."
      );
    }
  };

  const handleRecommend = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!ingredients.trim()) {
        toast.error("Please enter at least one ingredient.");
        setIsLoading(false);
        return;
      }

      const inputIngredients = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await axios.post("http://127.0.0.1:5000/api/recommend", {
        ingredients: inputIngredients,
        ...nutrition,
      });

      setRecipes(response.data);
    } catch (err) {
      setError("Error fetching recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    // Save current state before navigating
    navigate(`/recipe/${encodeURIComponent(recipe.recipe_name)}`, {
      state: { 
        recipe,
        returnState: {
          recipes,
          ingredients,
          nutrition
        }
      },
    });
  };

  const handleToggleFavorite = async (e, recipe) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const recipeData = {
        recipe_name: recipe.recipe_name,
        image_url: recipe.image_url || "",
        ingredients: recipe.ingredients_list || [],
        calories: recipe.nutrition?.calories || 0,
        instructions: recipe.ingredient_quantity_list || [],
        nutrition: {
          protein: recipe.nutrition?.protein || 0,
          carbohydrates: recipe.nutrition?.carbohydrates || 0,
          fat: recipe.nutrition?.fat || 0,
          fiber: recipe.nutrition?.fiber || 0,
          sodium: recipe.nutrition?.sodium || 0,
          cholesterol: recipe.nutrition?.cholesterol || 0,
        },
      };

      const result = await toggleFavorite(recipeData).unwrap();

      await refetchFavorites();

      toast.success(
        result.isFavorite
          ? "Recipe added to favorites"
          : "Recipe removed from favorites"
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast.error("Failed to update favorites");
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const clearRecipes = () => {
    setRecipes([]);
    localStorage.removeItem(STORAGE_KEYS.RECIPES);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Recipe Recommender
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Enter your ingredients and nutritional preferences to discover
          delicious recipes tailored just for you
        </p>
      </div>

      <div className="bg-white/20 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl">
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                What ingredients do you have?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ingredients}
                  onChange={handleIngredientsChange}
                  placeholder="Enter ingredients separated by commas"
                  className="border border-gray-200 p-4 pl-12 w-full rounded-xl bg-white/70 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Example: chicken, rice, broccoli
              </p>
            </div>

            <div className="mb-6">
              <button
                onClick={() => toggleSection("nutrition")}
                className="flex items-center justify-between w-full p-4 bg-purple-50 rounded-xl text-gray-700 font-medium"
              >
                <span>Nutritional Requirements</span>
                <ChevronDown
                  className={`h-5 w-5 text-purple-500 transition-transform ${
                    expandedSection === "nutrition"
                      ? "transform rotate-180"
                      : ""
                  }`}
                />
              </button>

              {expandedSection === "nutrition" && (
                <div className="mt-4 p-4 bg-white/50 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nutritionFields.map(({ key, label, unit }) => (
                    <div key={key} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} ({unit})
                      </label>
                      <input
                        type="number"
                        name={key}
                        value={nutrition[key]}
                        onChange={handleInputChange}
                        className="border border-gray-200 p-3 w-full rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                        placeholder={`e.g. 200`}
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleRecommend}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 w-full text-lg font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Finding Recipes...
                </>
              ) : (
                "Recommend Recipes"
              )}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {recipes.length > 0
                ? "Recommended Recipes"
                : "Your Recommendations"}
            </h2>
            {recipes.length > 0 && (
              <button
                onClick={clearRecipes}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Results
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg max-w-3xl mx-auto">
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-purple-600 mb-4" />
              <p className="text-gray-600">
                Finding the perfect recipes for you...
              </p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-3 bg-purple-50 rounded-full mb-4">
                <ChefHat className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-gray-600 text-lg mb-2">
                No recommendations available yet.
              </p>
              <p className="text-gray-500">
                Enter your ingredients and nutritional preferences to get
                personalized recipe recommendations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  {recipe.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.image_url || "/placeholder.svg"}
                        alt={recipe.recipe_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                      <p className="text-gray-500 italic">No image available</p>
                    </div>
                  )}

                  <div className="p-5 relative">
                    <button
                      className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                      onClick={(e) => handleToggleFavorite(e, recipe)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.some(
                            (fav) => fav.recipe_name === recipe.recipe_name
                          )
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 pr-10">
                      {recipe.recipe_name}
                    </h3>

                    {recipe.ingredients && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {recipe.ingredients.slice(0, 3).join(", ")}
                        {recipe.ingredients.length > 3 && "..."}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex space-x-2">
                        {recipe.calories && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                            {recipe.calories} cal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}