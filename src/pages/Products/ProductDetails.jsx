import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import moment from "moment";
// import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  ShoppingCart,
  Clock,
  Package,
  Star,
  Store,
  ArrowLeft,
  Tag,
  DollarSign,
  Truck,
} from "lucide-react";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div
      className="min-h-screen py-6"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4">
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center text-gray-700 font-medium hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="error">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Product Image Section */}
              <div className="lg:w-1/2 relative">
                <div className="bg-white p-4 h-full flex items-center justify-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="max-h-[500px] object-contain"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  {/* <HeartIcon product={product} /> */}
                </div>
              </div>

              {/* Product Details Section */}
              <div className="lg:w-1/2 p-6 lg:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag size={12} className="mr-1" />
                    {product.category?.name || "Uncategorized"}
                  </span>
                  {product.countInStock > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Package size={12} className="mr-1" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Package size={12} className="mr-1" />
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>

                <div className="mb-4">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>

                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                    {product.price}
                  </h2>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Store className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-medium text-gray-800">
                        {product.brand}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Added</p>
                      <p className="font-medium text-gray-800">
                        {moment(product.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Reviews</p>
                      <p className="font-medium text-gray-800">
                        {product.numReviews}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">In Stock</p>
                      <p className="font-medium text-gray-800">
                        {product.countInStock}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mr-3"
                      >
                        Quantity:
                      </label>
                      <select
                        id="quantity"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-gray-800 py-2 px-3"
                        disabled={product.countInStock === 0}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Free shipping
                    </div>
                  </div>

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                      product.countInStock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                    } transition-colors`}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.countInStock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Tabs Section */}
            <div className="border-t border-gray-200">
              <div className="p-6">
                <ProductTabs
                  loadingProductReview={loadingProductReview}
                  userInfo={userInfo}
                  submitHandler={submitHandler}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  product={product}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
