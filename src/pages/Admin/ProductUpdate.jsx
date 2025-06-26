import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData, isLoading } = useGetProductByIdQuery(params._id);

  console.log("Product Data:", productData);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  // Set form data when productData changes
  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      // Fix for category - ensure we're using the ID correctly
      setCategory(productData.category || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      // Fix for stock - ensure we're setting it correctly
      setStock(productData.countInStock || 0);
    }
  }, [productData]);


  
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Update product using the RTK Query mutation
      const result = await updateProduct({ 
        productId: params._id, 
        formData 
      }).unwrap();

      // Fix for toast notification - check if the result was successful
      if (result._id) {
        toast.success(`Product successfully updated`);
        navigate("/admin/allproductslist");
      } else {
        toast.error("Product update failed. Try again.");
      }
    } catch (err) {
      console.log(err);
      toast.error(`Update failed: ${err.message || "Unknown error"}`);
    }
  };

  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      // Fix for delete toast notification
      const result = await deleteProduct(params._id).unwrap();
      
      if (result._id) {
        toast.success(`"${result.name}" is deleted`);
        navigate("/admin/allproductslist");
      } else {
        toast.error("Delete failed. Try again.");
      }
    } catch (err) {
      console.log(err);
      toast.error(`Delete failed: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="container mx-auto pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Update Product
                </h2>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading product data...</p>
                  </div>
                ) : (
                  <>
                    {/* Image Preview */}
                    {image && (
                      <div className="mb-6">
                        <div className="relative rounded-lg overflow-hidden shadow-md h-64 bg-gray-100 flex items-center justify-center">
                          <img
                            src={image}
                            alt={name || "Product"}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-3 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              ></path>
                            </svg>
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={uploadFileHandler}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Price ($)
                          </label>
                          <input
                            type="number"
                            id="price"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                          />
                        </div>

                        {/* Quantity */}
                        <div>
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Quantity
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                          />
                        </div>

                        {/* Brand */}
                        <div>
                          <label
                            htmlFor="brand"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Brand
                          </label>
                          <input
                            type="text"
                            id="brand"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                          />
                        </div>

                        {/* Count In Stock */}
                        <div>
                          <label
                            htmlFor="stock"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Count In Stock
                          </label>
                          <input
                            type="number"
                            id="stock"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                          >
                            <option value="">Select a category</option>
                            {categories?.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4 mt-8">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          Update Product
                        </button>

                        <button
                          type="button"
                          onClick={handleDelete}
                          className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Product
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate("/admin/allproductslist")}
                          className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;