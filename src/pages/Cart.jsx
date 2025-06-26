
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa"
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice"
const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)
  const { cartItems } = cart

  // Calculate cart summary values
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    try {
      if (userInfo) {
        navigate("/shipping")
      } else {
        navigate("/login?redirect=/shipping")
      }
    } catch (error) {
      console.error("Navigation error:", error)
      // You could add a toast notification here to inform the user
      // toast.error("There was a problem proceeding to checkout");
    }
  }

  // Empty cart component
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full mb-6 shadow-md">
        <FaShoppingCart className="text-indigo-700 w-16 h-16" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love!
      </p>
      <Link
        to="/shop"
        className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        <FaArrowLeft className="mr-2" />
        Continue Shopping
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}>
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-200"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg font-medium text-indigo-700 hover:text-indigo-500 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 text-gray-600">{item.brand}</div>
                        <div className="mt-2 font-bold text-gray-800">${item.price}</div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-4">
                        <div>
                          <label htmlFor={`qty-${item._id}`} className="sr-only">
                            Quantity
                          </label>
                          <select
                            id={`qty-${item._id}`}
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                            value={item.qty}
                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Remove Button */}
                        <button
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => removeFromCartHandler(item._id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg sticky top-4">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200 text-gray-800">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-800">
                    <span className="text-gray-600">Items ({itemsCount})</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-gray-800">${subtotal}</span>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center shadow-md"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6">
                  <Link
                    to="/shop"
                    className="flex items-center justify-center text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    <FaArrowLeft className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
