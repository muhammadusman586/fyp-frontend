import { useLocation } from "react-router-dom";
import {
  Clock,
  Utensils,
  ShoppingBag,
  BarChart,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

function RecipeDetails() {
  const { state } = useLocation();
  const recipe = state?.recipe;
  console.log("Recipe Details:", recipe);

  if (!recipe) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
      >
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-md mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Recipe Found
          </h2>
          <p className="text-gray-600 mb-6">
            The recipe details you're looking for are not available.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="inline-block mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format nutrition data for display
  const nutritionItems = Object.entries(recipe.nutrition || {}).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      unit:
        key === "calories"
          ? "kcal"
          : key === "sodium" || key === "cholesterol"
          ? "mg"
          : "g",
    })
  );

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 hover:text-purple-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to recipes</span>
          </button>
        </div>

        {/* Recipe Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-8">
          {recipe.image_url && (
            <div className="relative h-72 md:h-96 overflow-hidden">
              <img
                src={recipe.image_url || "/placeholder.svg"}
                alt={recipe.recipe_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">
                  {recipe.recipe_name}
                </h1>
                {recipe.cooking_time && (
                  <div className="flex items-center text-white/90">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{recipe.cooking_time} minutes</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!recipe.image_url && (
            <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {recipe.recipe_name}
              </h1>
            </div>
          )}

          {/* Recipe Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients Section */}
              <div>
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-5 w-5 text-purple-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Ingredients
                  </h2>
                </div>

                <ul className="space-y-3">
                  {recipe.ingredients &&
                    recipe.ingredients.map((ingredient, index) => {
                      const quantity =
                        recipe.ingredient_quantity_list &&
                        recipe.ingredient_quantity_list[index]
                          ? recipe.ingredient_quantity_list[index]
                          : "";

                      return (
                        <li key={index} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-medium mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <span className="text-gray-800">{ingredient}</span>
                            {quantity && (
                              <span className="text-gray-500 ml-1">
                                ({quantity})
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>

              {/* Nutritional Information */}
              <div>
                <div className="flex items-center mb-4">
                  <BarChart className="h-5 w-5 text-purple-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Nutritional Information
                  </h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {nutritionItems.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        <div className="text-sm text-gray-500">{item.name}</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {item.value}{" "}
                          <span className="text-xs text-gray-500">
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section (if available) */}
            {recipe.instructions && (
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <Utensils className="h-5 w-5 text-purple-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Instructions
                  </h2>
                </div>

                <ol className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="mt-1">
                        <p className="text-gray-700">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
