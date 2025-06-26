import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Edit2, Calendar, DollarSign, Tag, Eye } from "lucide-react";

const AllProducts = () => {
  const { data: products, isLoading, isError, error } = useAllProductsQuery();

  return (
    <div
      className="min-h-screen py-6"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Product Management{" "}
                {products && (
                  <span className="ml-2 text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                    {products.length} products
                  </span>
                )}
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : isError ? (
                <Message variant="error">
                  {error?.data?.message || "Error loading products"}
                </Message>
              ) : products?.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-700">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex flex-wrap justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-gray-800">
                                {product.name}
                              </h3>
                              <div className="flex items-center text-gray-500 text-sm">
                                <Calendar size={14} className="mr-1" />
                                {moment(product.createdAt).format(
                                  "MMMM Do YYYY"
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Tag size={12} className="mr-1" />
                                {product.category?.name || "Uncategorized"}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <DollarSign size={12} className="mr-1" />$
                                {product.price}
                              </span>
                              {product.countInStock > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  In Stock: {product.countInStock}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Out of Stock
                                </span>
                              )}
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {product.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap justify-between items-center mt-4">
                            <Link
                              to={`/admin/product/update/${product._id}`}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md transition-colors text-sm font-medium"
                            >
                              <Edit2 size={16} className="mr-2" />
                              Update Product
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
