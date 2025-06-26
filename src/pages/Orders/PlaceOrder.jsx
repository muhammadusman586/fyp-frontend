import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [orderError, setOrderError] = useState(null);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [payOrder, { isLoading: isLoadingPayment }] = usePayOrderMutation();

  useEffect(() => {
    // Validate that we have shipping address and payment method
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      toast.error("Payment method is not selected");
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    setOrderError(null);

    // Validate cart is not empty
    if (cart.cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Get payment data from sessionStorage (set in Checkout.jsx)
    const paymentDataString = sessionStorage.getItem("paymentData");
    if (!paymentDataString) {
      toast.error("Payment information not found. Please go back to checkout.");
      navigate("/checkout");
      return;
    }

    const paymentData = JSON.parse(paymentDataString);

    // Create a toast ID for status updates
    const toastId = toast.loading("Processing your order...");
    try {
      // Create payment details first
      const paymentDetails = {
        id: paymentData.id || `pay_${Date.now()}`,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address:
          userInfo?.email ||
          paymentData.payer?.email_address ||
          "customer@example.com",
      };

      // Step 1: Create the order with payment already processed
      toast.update(toastId, { render: "Creating your order..." });
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod || "Credit Card",
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        // Include payment information directly in the order creation
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: paymentDetails,
      }).unwrap();

      // The order is already marked as paid during creation
      // No need to call payOrder separately

      // Update toast to show success
      toast.update(toastId, {
        render:
          "Order placed and paid successfully! Redirecting to order details...",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Store the order ID in sessionStorage for reference
      sessionStorage.setItem("lastOrderId", res._id);
      // Clear payment data as it's been used
      sessionStorage.removeItem("paymentData");

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      // Update the toast to show the error
      toast.update(toastId, {
        render:
          error?.data?.message ||
          error.message ||
          "An error occurred while placing your order. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      setOrderError(
        error?.data?.message ||
          error.message ||
          "An error occurred while placing your order. Please try again."
      );
      toast.error(
        error?.data?.message ||
          error.message ||
          "An error occurred while placing your order. Please try again."
      );
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto max-w-6xl">
        <ProgressSteps step1 step2 step3 />

        <div className="mt-8">
          {cart.cartItems.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Message>Your cart is empty</Message>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Review Your Order
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {cart.cartItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          />
                        </td>

                        <td className="p-4 text-gray-800">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-4 text-gray-800">{item.qty}</td>
                        <td className="p-4 text-gray-800">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="p-4 text-gray-800">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-3">
                  <span className="font-medium text-gray-700">Items:</span>
                  <span className="text-gray-800">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-medium text-gray-700">Shipping:</span>
                  <span className="text-gray-800">${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-medium text-gray-700">Tax:</span>
                  <span className="text-gray-800">${cart.taxPrice}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-800 text-lg">
                    Total:
                  </span>
                  <span className="font-bold text-gray-800 text-lg">
                    ${cart.totalPrice}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4">
                  <Message variant="error">{error.data.message}</Message>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Shipping
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                    {cart.shippingAddress.city}{" "}
                    {cart.shippingAddress.postalCode},{" "}
                    {cart.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Payment Method
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    <strong>Method:</strong> {cart.paymentMethod}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={
                  cart.cartItems.length === 0 || isLoading || isLoadingPayment
                }
                onClick={placeOrderHandler}
              >
                {isLoading || isLoadingPayment ? (
                  <>
                    <Loader sm />{" "}
                    {isLoadingPayment
                      ? "Processing Payment..."
                      : "Processing Order..."}
                  </>
                ) : (
                  "Place Order & Pay"
                )}
              </button>

              {orderError && (
                <div className="mt-4">
                  <Message variant="error">{orderError}</Message>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
