import { INVENTORY_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all inventory items with optional filtering
    getInventory: builder.query({
      query: ({ keyword = '', category = 'all' }) => ({
        url: `${INVENTORY_URL}`,
        params: { keyword, category },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Inventory"],
    }),

    // Get a single inventory item by ID
    getInventoryItem: builder.query({
      query: (itemId) => `${INVENTORY_URL}/${itemId}`,
      providesTags: (result, error, itemId) => [
        { type: "InventoryItem", id: itemId },
      ],
    }),

    // Create a new inventory item
    addInventoryItem: builder.mutation({
      query: (itemData) => ({
        url: `${INVENTORY_URL}`,
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["Inventory"],
    }),

    // Update an existing inventory item
    updateInventoryItem: builder.mutation({
      query: ({ itemId, itemData }) => ({
        url: `${INVENTORY_URL}/${itemId}`,
        method: "PUT",
        body: itemData,
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "InventoryItem", id: itemId },
        "Inventory",
      ],
    }),

    // Delete an inventory item
    deleteInventoryItem: builder.mutation({
      query: (itemId) => ({
        url: `${INVENTORY_URL}/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory"],
    }),

    // Update inventory item quantity (increase/decrease)
    updateQuantity: builder.mutation({
      query: ({ itemId, action, amount = 1 }) => ({
        url: `${INVENTORY_URL}/${itemId}/quantity`,
        method: "PATCH",
        body: { action, amount },
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "InventoryItem", id: itemId },
        "Inventory",
      ],
    }),

    // Get items below their threshold
    getLowStockItems: builder.query({
      query: () => `${INVENTORY_URL}/low-stock`,
      keepUnusedDataFor: 5,
      providesTags: ["Inventory"],
    }),

    // Get statistics about categories
    getCategoryStats: builder.query({
      query: () => `${INVENTORY_URL}/category-stats`,
      keepUnusedDataFor: 5,
      providesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetInventoryItemQuery,
  useAddInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useUpdateQuantityMutation,
  useGetLowStockItemsQuery,
  useGetCategoryStatsQuery,
} = inventoryApiSlice;

