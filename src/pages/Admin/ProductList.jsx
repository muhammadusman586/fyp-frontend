import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
// import AdminMenu from "./AdminMenu";
import { Upload } from "lucide-react";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* <AdminMenu /> */}
          <div className="w-full md:w-3/4 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
              Create Product
            </h2>

            {imageUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="product"
                  className="block mx-auto max-h-[200px] rounded-lg border border-gray-200 p-2 bg-white"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="border border-gray-200 bg-white/50 text-gray-700 px-4 block w-full text-center rounded-lg cursor-pointer font-medium py-10 hover:bg-white transition-colors duration-200 shadow-sm flex flex-col items-center justify-center">
                <Upload size={24} className="mb-2 text-indigo-600" />
                <span className="text-gray-800">
                  {image ? image.name : "Upload Product Image"}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Click to browse files
                </span>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="text-gray-700 text-sm font-medium block mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="text-gray-700 text-sm font-medium block mb-2"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="quantity"
                    className="text-gray-700 text-sm font-medium block mb-2"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Product quantity"
                  />
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="text-gray-700 text-sm font-medium block mb-2"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    className="p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Product brand"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="text-gray-700 text-sm font-medium block mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="p-3 bg-white border border-gray-300 rounded-lg w-full text-gray-800 min-h-[120px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label
                    htmlFor="stock"
                    className="text-gray-700 text-sm font-medium block mb-2"
                  >
                    Count In Stock
                  </label>
                  <input
                    type="text"
                    id="stock"
                    className="p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Stock count"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="text-gray-700 text-sm font-medium block mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="" disabled>
                      Choose Category
                    </option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`py-3 px-8 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-colors duration-200 shadow-md ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
