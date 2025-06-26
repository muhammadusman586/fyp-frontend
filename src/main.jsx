import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import Home from "./components/Home.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";

import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";

import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Recipes from "./pages/Recipes.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import Order from "./pages/Orders/Order.jsx";
import Checkout from "./pages/Orders/Checkout.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import OrderList from "./pages/Admin/orderList.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Kitchen from "./pages/Kitchen.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import FavoriteRecipes from "./pages/FavoriteRecipes.jsx";
import FavoriteRecipesDetail from "./pages/FavoriteRecipesDetail.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/favoriterecipedetail/:id" element={<FavoriteRecipesDetail/>} /> 

        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/favorite" element={<FavoriteRecipes />} />

        {/* Order Process Flow */}
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
