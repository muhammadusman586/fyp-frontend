import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { ShoppingCart,  Tag, DollarSign, Star } from "lucide-react";

const ProductCard = ({ p }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    setIsAddingToCart(true);

    // Add to cart
    dispatch(addToCart({ ...product, qty }));

    // Show success toast
    toast.success("Added to your cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        background: "linear-gradient(to right, #bfdbfe, #e9d5ff)",
        color: "#1e293b",
        borderRadius: "8px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      },
      icon: <ShoppingCart size={24} />,
    });

    // Reset button state after a short delay
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-[220px] overflow-hidden bg-gray-50 border-b border-gray-100">
        {/* Sale badge */}
        {p.discountPercentage && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {Math.round(p.discountPercentage)}% OFF
          </div>
        )}

        {/* Product image */}
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image || "/placeholder.svg"}
            alt={p.name}
            className={`w-full h-full object-contain transition-all duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <Tag size={12} className="mr-1" />
            {p?.brand || "Brand"}
          </span>
          <div className="flex items-center">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-gray-500 ml-1">
              {p?.rating?.toFixed(1) || "4.5"}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <Link to={`/product/${p._id}`}>
          <h3 className="font-medium text-gray-800 line-clamp-2 h-12 mb-1 hover:text-purple-600 transition-colors">
            {p?.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <DollarSign size={16} className="text-purple-600" />
            <div className="flex flex-col">
              {p.originalPrice && p.originalPrice > p.price ? (
                <>
                  <span className="text-gray-400 line-through text-xs">
                    ${p.originalPrice?.toFixed(2)}
                  </span>
                  <span className="font-bold text-gray-800">
                    ${p?.price?.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-gray-800">
                  ${p?.price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCartHandler(p, 1)}
            disabled={isAddingToCart}
            className={`px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors ${
              isAddingToCart ? "opacity-75" : ""
            }`}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>

      {/* View Details Button - Appears on Hover */}
      <div
        className={`transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link
          to={`/product/${p._id}`}
          className="block w-full py-2 bg-gray-100 text-center text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
