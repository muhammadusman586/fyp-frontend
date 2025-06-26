import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaGlobe,
  FaCreditCard,
  FaArrowRight,
} from "react-icons/fa";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validate the form fields
  const validateForm = () => {
    const newErrors = {};

    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save shipping address and payment method to state
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      dispatch(savePaymentMethod(paymentMethod));

      // Show success message
      toast.success("Shipping information saved");

      // Navigate to checkout page
      navigate("/checkout");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto max-w-4xl">
        <ProgressSteps step1 step2 />

        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              Shipping Information
            </h1>

            <form onSubmit={submitHandler}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address Field */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      className={`w-full bg-white border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-lg py-3 pl-10 pr-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                      placeholder="Enter your street address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City Field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    City
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCity className="text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      className={`w-full bg-white border ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } rounded-lg py-3 pl-10 pr-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>

                {/* Postal Code Field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Postal Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMailBulk className="text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      className={`w-full bg-white border ${
                        errors.postalCode ? "border-red-500" : "border-gray-300"
                      } rounded-lg py-3 pl-10 pr-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                      placeholder="Enter postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                {/* Country Field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobe className="text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      className={`w-full bg-white border ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      } rounded-lg py-3 pl-10 pr-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                      placeholder="Enter country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  {errors.country && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Payment Method
                </h2>
                <div className="bg-white/50 border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentMethod === "Credit Card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label
                      htmlFor="creditCard"
                      className="flex items-center cursor-pointer"
                    >
                      <FaCreditCard className="text-indigo-600 mr-2" />
                      <span className="text-gray-800">Credit Card</span>
                    </label>
                  </div>

                  {/* You can add more payment methods here */}
                  {/* 
                  <div className="flex items-center space-x-3 mt-3">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="paypal" className="flex items-center cursor-pointer">
                      <FaPaypal className="text-blue-500 mr-2" />
                      <span className="text-gray-800">PayPal</span>
                    </label>
                  </div>
                  */}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Continue to Checkout
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
