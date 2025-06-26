import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import BackBtn from "../../components/BackBtn";
import CreditCard from "../../components/CreditCard";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  // Get cart state from Redux
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  // Get user info for payment data
  const { userInfo } = useSelector((state) => state.auth);

  // Create order mutation
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  // Redirect to shipping if no shipping address or cart is empty
  useEffect(() => {
    if (!shippingAddress?.address) {
      toast.error("Please enter shipping address first");
      navigate("/shipping");
    } else if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [shippingAddress, navigate, cartItems]);
  // Validate form and proceed to place order page
  const handleCreditCardSubmit = async (cardData) => {
    setIsProcessingPayment(true);

    try {
      // Basic card validation
      if (
        !cardData.number ||
        !cardData.name ||
        !cardData.expiry ||
        !cardData.cvc
      ) {
        toast.error("Please fill in all credit card details");
        setIsProcessingPayment(false);
        return;
      }

      // Validate expiry date
      const [month, year] = cardData.expiry.split("/");
      const expiryDate = new Date(
        2000 + Number.parseInt(year),
        Number.parseInt(month) - 1
      );
      const currentDate = new Date();

      if (expiryDate < currentDate) {
        toast.error("Card has expired");
        setIsProcessingPayment(false);
        return;
      }

      // Create payment data to store in session
      const paymentData = {
        id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        status: "PENDING",
        update_time: new Date().toISOString(),
        payer: {
          email_address: userInfo?.email || "customer@example.com",
          name: cardData.name,
          last4: cardData.number.slice(-4),
          card_type: getCardType(cardData.number),
          card_details: {
            expiry: cardData.expiry,
            cvc: cardData.cvc, // Storing temporarily for payment processing
          },
        },
      };

      // Save payment info in sessionStorage for PlaceOrder component
      sessionStorage.setItem("paymentData", JSON.stringify(paymentData));

      // Set form as validated and navigate to place order page
      setFormValidated(true);
      toast.success("Payment information validated. Please review your order.");
      navigate("/placeorder");
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred during payment processing"
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Simple utility to determine card type
  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, "");
    if (/^4/.test(number)) return "VISA";
    if (/^5[1-5]/.test(number)) return "MASTERCARD";
    if (/^3[47]/.test(number)) return "AMEX";
    if (/^6(?:011|5)/.test(number)) return "DISCOVER";
    return "UNKNOWN";
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <BackBtn to={"/cart"}>Back to cart</BackBtn>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <Message>Your cart is empty</Message>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Order Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-700 font-medium">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-medium">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-medium">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cartItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-800">{item.qty}</td>
                        <td className="py-3 px-4 text-gray-800">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium bg-gray-50">
                      <td colSpan="2" className="py-3 px-4 text-gray-800">
                        Subtotal:
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        ${cart.itemsPrice}
                      </td>
                    </tr>
                    <tr className="font-medium">
                      <td colSpan="2" className="py-3 px-4 text-gray-800">
                        Shipping:
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        ${cart.shippingPrice}
                      </td>
                    </tr>
                    <tr className="font-medium bg-gray-50">
                      <td colSpan="2" className="py-3 px-4 text-gray-800">
                        Tax:
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        ${cart.taxPrice}
                      </td>
                    </tr>
                    <tr className="font-bold text-lg">
                      <td colSpan="2" className="py-3 px-4 text-gray-800">
                        Total:
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        ${cart.totalPrice}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Shipping Address
                </h3>
                <p className="text-gray-700">
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Payment Details
              </h2>
              {isProcessingPayment ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader />
                  <p className="mt-4 text-gray-700">
                    Validating payment details...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-center mb-6 text-gray-700">
                    Enter your payment details to continue to order review
                  </p>
                  <CreditCard onSubmit={handleCreditCardSubmit} />
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                      Your payment will be processed when you review and place
                      your order on the next screen
                    </p>
                  </div>
                </>
              )}
              {error && (
                <div className="mt-6">
                  <Message variant="error">
                    {error?.data?.message ||
                      "An error occurred during checkout"}
                  </Message>
                </div>
              )}
            </section>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
