import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
    fulfilledTimeStamp, // Track when query last fulfilled
  } = useGetOrderDetailsQuery(orderId, {
    // No need for polling interval here as we'll handle it in useEffect
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // Check if this order was just placed (within last 30 seconds)
  const isRecentOrder =
    order?.createdAt && new Date() - new Date(order.createdAt) < 30000;

  // Check if we have payment data from sessionStorage (from order creation)
  const lastOrderId = sessionStorage.getItem("lastOrderId");
  const isLastOrder = lastOrderId === orderId;

  // Validate payment status immediately upon component mount and periodically thereafter
  useEffect(() => {
    // Always fetch initially to get the latest data
    const validateOrderStatus = async () => {
      try {
        // Refetch to get latest data
        await refetch();

        // Handle case where payment might not be reflected despite being processed
        if (order && !order.isPaid && isLastOrder) {
          console.log(
            "Detected order from previous checkout. Validating payment status..."
          );

          // Force an additional refetch after a short delay to ensure backend processing completed
          setTimeout(() => {
            refetch().catch((err) => {
              console.error("Error refreshing order status:", err);
            });
          }, 2000);
        }
      } catch (err) {
        console.error("Error validating order status:", err);
      }
    };

    // Run validation immediately
    validateOrderStatus();

    let intervalId;

    // Set up an interval to check payment status
    if (order) {
      // Different polling frequencies based on payment status and order age
      if (!order.isPaid) {
        // For unpaid orders, check more frequently initially
        const orderAge = order.createdAt
          ? new Date() - new Date(order.createdAt)
          : 0;

        // Determine check frequency based on order age
        let checkFrequency = 5000; // Default: 5 seconds

        if (isLastOrder || orderAge < 60000) {
          // Recently placed order or less than 1 minute old: check every 2 seconds
          checkFrequency = 2000;
        } else if (orderAge > 180000) {
          // More than 3 minutes old: check every 30 seconds
          checkFrequency = 30000;
        }

        console.log(`Setting payment check interval: ${checkFrequency}ms`);
        intervalId = setInterval(() => {
          refetch().catch((err) => {
            console.error("Error refreshing order status:", err);
          });
        }, checkFrequency);
      } else {
        // For paid orders, just check occasionally for delivery status updates
        intervalId = setInterval(() => {
          refetch().catch((err) => {
            console.error("Error refreshing order status:", err);
          });
        }, 30000);
      }
    }
    // Clean up interval on unmount or when status changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Clear lastOrderId from sessionStorage if this order is now paid
      if (order?.isPaid && lastOrderId === orderId) {
        sessionStorage.removeItem("lastOrderId");
      }
    };
  }, [
    order?.isPaid,
    orderId,
    refetch,
    isLastOrder,
    lastOrderId,
    order?.createdAt,
  ]);

  // Payment is handled during order creation, so no separate payment handling is needed here

  // Deliver order handler with improved synchronization
  const deliverHandler = async () => {
    const toastId = toast.loading("Updating delivery status...");

    try {
      await deliverOrder(orderId).unwrap();

      // Immediately refetch to ensure UI is in sync with server
      await refetch();

      // Update toast to success
      toast.update(toastId, {
        render: "Order marked as delivered",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Force a refetch after a short delay to ensure any server-side processing completes
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      // Update toast to show error
      toast.update(toastId, {
        render:
          error?.data?.message ||
          error.message ||
          "Failed to update delivery status",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return isLoading ? (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <Loader />
    </div>
  ) : error ? (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <Message variant="error">{error}</Message>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Order {order._id}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Shipping</h2>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700">
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email: </strong> {order.user.email}
                </p>
                <p className="text-gray-700">
                  <strong>Address: </strong> {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {new Date(order.deliveredAt).toLocaleString()}
                </Message>
              ) : (
                <Message variant="error">Not Delivered</Message>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Payment Method
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Method: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div>
                  <Message variant="success">
                    <div className="font-semibold">Payment Confirmed</div>
                    <div>
                      Completed on{" "}
                      {new Date(order.paidAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </Message>
                  {order.paymentResult && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Payment Details
                      </h3>
                      <p className="mb-1 text-gray-700">
                        <strong>Transaction ID:</strong>{" "}
                        {order.paymentResult.id || "N/A"}
                      </p>
                      <p className="mb-1 text-gray-700">
                        <strong>Status:</strong>
                        <span className="text-green-600 font-semibold ml-1">
                          {order.paymentResult.status || "Completed"}
                        </span>
                      </p>
                      {order.paymentResult.card?.last4 && (
                        <p className="mb-1 text-gray-700">
                          <strong>Card:</strong> ••••{" "}
                          {order.paymentResult.card.last4}
                        </p>
                      )}
                      {order.paymentResult.email_address && (
                        <p className="mb-1 text-gray-700">
                          <strong>Email:</strong>{" "}
                          {order.paymentResult.email_address}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Different message based on how long we've been waiting */}
                  {(() => {
                    const orderAge = order.createdAt
                      ? new Date() - new Date(order.createdAt)
                      : 0;

                    // Special message for orders that were just placed and should be paid
                    if (isLastOrder && orderAge < 30000) {
                      return (
                        <Message variant="info">
                          <div className="font-semibold">
                            Payment Confirmation in Progress
                          </div>
                          <div>
                            Your payment was processed when you placed this
                            order. The system is now finalizing your payment
                            records.
                          </div>
                        </Message>
                      );
                    } else if (orderAge < 30000) {
                      return (
                        <Message variant="info">
                          <div className="font-semibold">
                            Payment Processing
                          </div>
                          <div>
                            Your payment is being processed. This typically
                            takes less than a minute.
                          </div>
                        </Message>
                      );
                    } else if (orderAge < 120000) {
                      return (
                        <Message variant="info">
                          <div className="font-semibold">
                            Payment Verification in Progress
                          </div>
                          <div>
                            Your payment is being verified with the payment
                            processor. This may take a few moments.
                          </div>
                        </Message>
                      );
                    } else {
                      return (
                        <Message variant="warning">
                          <div className="font-semibold">
                            Payment Status Delayed
                          </div>
                          <div>
                            Payment is taking longer than expected. This may be
                            due to processing delays. Use the refresh button
                            below to check the latest status.
                          </div>
                        </Message>
                      );
                    }
                  })()}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={async () => {
                        const toastId = toast.loading(
                          "Checking latest payment status..."
                        );
                        try {
                          await refetch();

                          if (order.isPaid) {
                            toast.update(toastId, {
                              render: "Payment confirmed! Order is now paid.",
                              type: "success",
                              isLoading: false,
                              autoClose: 2000,
                            });
                          } else {
                            toast.update(toastId, {
                              render:
                                "Status updated - Payment still processing",
                              type: "info",
                              isLoading: false,
                              autoClose: 2000,
                            });
                          }
                        } catch (err) {
                          toast.update(toastId, {
                            render:
                              "Error checking payment status. Please try again.",
                            type: "error",
                            isLoading: false,
                            autoClose: 3000,
                          });
                        }
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Refresh Payment Status
                    </button>

                    {/* Only show Contact Support if order is over 2 minutes old */}
                    {order?.createdAt &&
                      new Date() - new Date(order.createdAt) > 120000 && (
                        <button
                          onClick={() => (window.location.href = "/contact")}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center shadow-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          Contact Support
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Order Items
              </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex border-b border-gray-200 pb-4"
                    >
                      <div className="w-20 mr-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-auto rounded-md border border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-700 mt-1">
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Items</span>
                <span className="text-gray-800 font-medium">
                  ${order.itemsPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="text-gray-800 font-medium">
                  ${order.shippingPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax</span>
                <span className="text-gray-800 font-medium">
                  ${order.taxPrice}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">${order.totalPrice}</span>
              </div>
            </div>

            {/* Payment is handled during order creation so no payment button is needed here */}

            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center shadow-md"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
