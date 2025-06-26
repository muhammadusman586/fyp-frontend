import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, ChefHat, Loader2 } from "lucide-react";
import { useRemoveFavoriteMutation, useGetFavoritesQuery } from "../redux/api/favoriteApiSlice";
import { toast } from 'react-toastify';

export default function FavoriteRecipes() {
  const { data: favorites = [], isLoading, error, refetch } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [removingRecipe, setRemovingRecipe] = useState(null); // Track which recipe is being removed
  const navigate = useNavigate();

  // Function to handle removing a recipe from favorites
  const handleRemoveFavorite = async (e, recipe) => {
    e.preventDefault(); // Prevent any navigation
    e.stopPropagation(); // Stop event from bubbling to parent
  
    // Detailed debug logging
    console.log('===== REMOVE FAVORITE DEBUG =====');
    console.log('Recipe to remove:', recipe);
    
    if (!recipe || !recipe.recipe_name) {
      console.error('Invalid recipe data:', recipe);
      toast.error('Cannot remove recipe: missing recipe name');
      return;
    }
    
    // Get the raw recipe name - the API slice will handle encoding
    const recipeName = recipe.recipe_name;
    console.log('Recipe name for API call:', recipeName);
    
    // Set recipe-specific loading state
    setRemovingRecipe(recipe.recipe_name);
    
    try {
      console.log(`Removing favorite: ${recipe.recipe_name}`);
      
      // Call the API with the raw recipe name - API slice handles encoding
      const result = await removeFavorite(recipeName).unwrap();
      console.log('Remove favorite API response:', result);
      
      // Force a refresh of favorites list to update UI
      await refetch();
      
      // Show success message based on API response
      if (result.success) {
        toast.success(result.message || 'Recipe removed from favorites');
      } else {
        toast.success('Recipe removed from favorites');
      }
      
      // Clear loading state
      setRemovingRecipe(null);
    } catch (err) {
      // Full error dump for debugging
      console.error('===== ERROR REMOVING FAVORITE =====');
      console.error('Error object:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      // Handle different error types appropriately
      if (err.status) {
        console.error(`API Error Status: ${err.status}`);
        console.error('Error data:', err.data);
        
        // Match backend error status codes with appropriate messages
        switch (err.status) {
          case 404:
            toast.error('Recipe not found in favorites');
            break;
          case 401:
          case 403:
            toast.error('Authentication error. Please log in again.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error(err.data?.message || 'Failed to remove favorite');
        }
      } else if (err.name === 'AbortError') {
        console.error('Request was aborted');
        toast.error('Request timed out. Please try again.');
      } else {
        console.error('Network or other error:', err.message);
        toast.error('Network error: Failed to update favorites');
      }
      
      // Always refresh favorites to ensure UI is in sync with server
      try {
        await refetch();
      } catch (refetchErr) {
        console.error('Error refreshing favorites:', refetchErr);
      }
      
      // Clear loading state regardless of error
      setRemovingRecipe(null);
    }
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/favoriterecipedetail/${encodeURIComponent(recipe.recipe_name)}`, {
      state: { recipe },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/30 backdrop-blur-sm rounded-full mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Your Favorite Recipes
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            All your saved recipes in one place
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white/20 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl">
          {/* Recipes Section */}
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-purple-600 mb-4" />
                <p className="text-gray-600">Loading your favorite recipes...</p>
              </div>
            ) : error ? (
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl text-center max-w-3xl mx-auto">
                <p className="text-red-600 text-lg mb-2">
                  Error loading favorites
                </p>
                <p className="text-gray-500">
                  Please try again later
                </p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 bg-purple-50 rounded-full mb-4">
                  <ChefHat className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  No favorite recipes yet.
                </p>
                <p className="text-gray-500">
                  Add recipes to your favorites by clicking the heart icon on
                  recipes you love.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe, index) => (
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
                        <p className="text-gray-500 italic">
                          No image available
                        </p>
                      </div>
                    )}

                    <div className="p-5 relative">
                      <button
                        className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
                        onClick={(e) => handleRemoveFavorite(e, recipe)}
                        disabled={removingRecipe === recipe.recipe_name}
                        aria-label={`Remove ${recipe.recipe_name} from favorites`}
                      >
                        {removingRecipe === recipe.recipe_name ? (
                          <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
                        ) : (
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        )}
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
                          {recipe.cooking_time && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                              {recipe.cooking_time} min
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-purple-600 font-medium">
                          View Recipe →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
