import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import {
  Filter,
  ShoppingBag,
  Tag,
  Bookmark,
  DollarSign,
  RefreshCw,
} from "lucide-react";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("categories"); // Track active filter section

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === Number.parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  const resetFilters = () => {
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen py-6 pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-2 text-purple-500" size={28} />
            Shop Products
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="md:w-80">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Filter className="mr-2" size={20} />
                  Filter Products
                </h2>
              </div>

              {/* Filter Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveFilter("categories")}
                  className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${
                    activeFilter === "categories"
                      ? "text-purple-600 border-b-2 border-purple-500"
                      : "text-gray-600 hover:text-purple-500"
                  }`}
                >
                  <Tag className="mr-2" size={16} />
                  Categories
                </button>
                <button
                  onClick={() => setActiveFilter("brands")}
                  className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${
                    activeFilter === "brands"
                      ? "text-purple-600 border-b-2 border-purple-500"
                      : "text-gray-600 hover:text-purple-500"
                  }`}
                >
                  <Bookmark className="mr-2" size={16} />
                  Brands
                </button>
                <button
                  onClick={() => setActiveFilter("price")}
                  className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center ${
                    activeFilter === "price"
                      ? "text-purple-600 border-b-2 border-purple-500"
                      : "text-gray-600 hover:text-purple-500"
                  }`}
                >
                  {/* <DollarSign className="mr-2" size={16} /> */}
                  Price
                </button>
              </div>

              {/* Categories Filter */}
              <div
                className={`p-4 ${
                  activeFilter === "categories" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {categoriesQuery.isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader />
                    </div>
                  ) : categories?.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No categories found
                    </p>
                  ) : (
                    categories?.map((c) => (
                      <div key={c._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${c._id}`}
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`category-${c._id}`}
                          className="ml-3 text-sm font-medium text-gray-700 hover:text-purple-600 cursor-pointer"
                        >
                          {c.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Brands Filter */}
              <div
                className={`p-4 ${
                  activeFilter === "brands" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredProductsQuery.isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader />
                    </div>
                  ) : uniqueBrands?.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No brands found
                    </p>
                  ) : (
                    uniqueBrands?.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="radio"
                          id={brand}
                          name="brand"
                          onChange={() => handleBrandClick(brand)}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={brand}
                          className="ml-3 text-sm font-medium text-gray-700 hover:text-purple-600 cursor-pointer"
                        >
                          {brand}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div
                className={`p-4 ${
                  activeFilter === "price" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="price-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enter Price
                    </label>
                    <input
                      type="text"
                      id="price-filter"
                      placeholder="Filter by price..."
                      value={priceFilter}
                      onChange={handlePriceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <ShoppingBag className="mr-2 text-purple-500" size={20} />
                  Products
                  <span className="ml-2 bg-purple-100 text-purple-800 text-sm py-1 px-2 rounded-full">
                    {products?.length || 0}
                  </span>
                </h2>

                <div className="text-sm text-gray-500">
                  Showing {products?.length || 0} results
                </div>
              </div>
            </div>

            {filteredProductsQuery.isLoading ? (
              <div className="flex justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <Loader />
              </div>
            ) : products?.length === 0 ? (
              <div className="flex justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <p className="text-gray-500">
                  No products found matching your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
