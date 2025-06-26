import { createSlice } from "@reduxjs/toolkit";

// Helper function to get favorites from localStorage
const getFavoritesFromLocalStorage = () => {
  try {
    const favoritesFromStorage = localStorage.getItem("favorites");
    return favoritesFromStorage ? JSON.parse(favoritesFromStorage) : [];
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToLocalStorage = (favorites) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

const initialState = {
  favorites: getFavoritesFromLocalStorage(),
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      // Check if the recipe is already in favorites
      const isAlreadyFavorite = state.favorites.some(
        (fav) => fav.recipe_name === action.payload.recipe_name
      );
      
      if (!isAlreadyFavorite) {
        state.favorites.push(action.payload);
        saveFavoritesToLocalStorage(state.favorites);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (fav) => fav.recipe_name !== action.payload.recipe_name
      );
      saveFavoritesToLocalStorage(state.favorites);
    },
    toggleFavorite: (state, action) => {
      const isAlreadyFavorite = state.favorites.some(
        (fav) => fav.recipe_name === action.payload.recipe_name
      );

      if (isAlreadyFavorite) {
        state.favorites = state.favorites.filter(
          (fav) => fav.recipe_name !== action.payload.recipe_name
        );
      } else {
        state.favorites.push(action.payload);
      }
      
      saveFavoritesToLocalStorage(state.favorites);
    }
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoriteSlice.actions;

// Selectors
export const selectAllFavorites = (state) => state.favorites.favorites;
export const selectIsFavorite = (state, recipeName) => 
  state.favorites.favorites.some(fav => fav.recipe_name === recipeName);

export default favoriteSlice.reducer;

