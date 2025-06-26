import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
      async onQueryStarted({ orderId, details }, { dispatch, queryFulfilled }) {
        // Immediately update the cache optimistically before the API call completes
        const patchResult = dispatch(
          orderApiSlice.util.updateQueryData('getOrderDetails', orderId, (draft) => {
            if (draft) {
              draft.isPaid = true;
              draft.paidAt = new Date().toISOString();
              draft.paymentResult = {
                id: details.id,
                status: details.status,
                update_time: details.update_time,
                email_address: details.payer?.email_address,
              };
            }
          })
        );
        
        try {
          // Wait for the actual API call to complete
          const { data } = await queryFulfilled;
          
          // Force immediate cache update for all order-related queries
          dispatch(orderApiSlice.util.invalidateTags(['Order']));
          
          // Force update of this specific order query with actual server data
          dispatch(
            orderApiSlice.util.updateQueryData('getOrderDetails', orderId, (draft) => {
              if (draft && data) {
                Object.assign(draft, data);
              }
            })
          );
        } catch (err) {
          // If the payment failed, revert the optimistic update
          patchResult.undo();
          console.error('Payment failed:', err);
        }
      },
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
      async onQueryStarted(orderId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update the order details in the cache immediately
          dispatch(
            orderApiSlice.util.updateQueryData('getOrderDetails', orderId, (draft) => {
              if (draft) {
                draft.isDelivered = true;
                draft.deliveredAt = new Date().toISOString();
              }
            })
          );
          
          // Also update any orders in the list queries
          dispatch(orderApiSlice.util.invalidateTags(['Order']));
        } catch (err) {
          console.error('Delivery update failed:', err);
        }
      },
    }),
    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),
    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),
    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;