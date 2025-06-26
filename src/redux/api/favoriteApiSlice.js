import { apiSlice } from './apiSlice';
import { FAVORITES_URL } from '../constants';

export const favoriteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => ({
        url: FAVORITES_URL,
      }),
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation({
      query: (recipe) => ({
        url: FAVORITES_URL,
        method: 'POST',
        body: recipe,
      }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation({
      query: (recipeName) => {
        // Ensure the recipe name is properly encoded for URL
        // If it's already encoded, we don't want to double-encode
        const encodedName = recipeName.includes('%') 
          ? recipeName 
          : encodeURIComponent(recipeName);
        
        return {
          url: `${FAVORITES_URL}/${encodedName}`,
          method: 'DELETE',
        };
      },
      // Transform error responses for better client-side handling
      transformErrorResponse: (response, meta, arg) => {
        console.log('Delete favorite error response:', response);
        return response;
      },
      // Add additional error handling
      async onQueryStarted(recipeName, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error(`Error removing favorite "${recipeName}":`, error);
        }
      },
      invalidatesTags: ['Favorites'],
    }),
    toggleFavorite: builder.mutation({
      query: (recipe) => ({
        url: `${FAVORITES_URL}/toggle`,
        method: 'POST',
        body: recipe,
      }),
      // Transform error responses for better client-side handling
      transformErrorResponse: (response, meta, arg) => {
        console.log('Toggle favorite error response:', response);
        return response;
      },
      invalidatesTags: ['Favorites'],
    }),
    checkFavorite: builder.query({
      query: (recipeName) => {
        // Ensure the recipe name is properly encoded for URL
        const encodedName = recipeName.includes('%') 
          ? recipeName 
          : encodeURIComponent(recipeName);
          
        return {
          url: `${FAVORITES_URL}/check/${encodedName}`,
        };
      },
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useToggleFavoriteMutation,
  useCheckFavoriteQuery,
} = favoriteApiSlice;

