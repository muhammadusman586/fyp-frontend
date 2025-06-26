"use client"

import { useState, useEffect, useRef } from "react"
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineOrderedList,
  AiOutlineAppstore,
  AiOutlineTags,
} from "react-icons/ai"
import { FaHeart } from "react-icons/fa"
import { HiMenuAlt2, HiX } from "react-icons/hi"
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLogoutMutation } from "../../redux/api/usersApiSlice"
import { logout } from "../../redux/features/auth/authSlice"

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("")
  const location = useLocation()
  const dropdownRef = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  // Set active menu item based on current path
  useEffect(() => {
    const path = location.pathname
    if (path.includes("/home")) setActiveItem("home")
    else if (path.includes("/shop")) setActiveItem("shop")
    else if (path.includes("/cart")) setActiveItem("cart")
    else if (path.includes("/favorite")) setActiveItem("favorite")
    else if (path.includes("/admin/dashboard")) setActiveItem("dashboard")
    else if (path.includes("/admin/productlist")) setActiveItem("createProduct")
    else if (path.includes("/admin/allproductslist")) setActiveItem("allProducts")
    else if (path.includes("/admin/orderlist")) setActiveItem("orders")
    else if (path.includes("/admin/categorylist")) setActiveItem("categories")
    else if (path.includes("/admin/userlist")) setActiveItem("users")
    else if (path.includes("/login")) setActiveItem("login")
    else if (path.includes("/register")) setActiveItem("register")
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      setDropdownOpen(false)
      setMobileMenuOpen(false)
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  // Link styles with active state
  const getLinkClass = (itemName) => {
    const baseClass = "flex items-center relative rounded-lg my-1 px-3 py-2.5 transition-all duration-200 group"
    const activeClass = "bg-gradient-to-r from-blue-50 to-purple-50 text-indigo-700"
    const inactiveClass = "hover:bg-gray-50"

    return `${baseClass} ${activeItem === itemName ? activeClass : inactiveClass}`
  }

  // Icon styles with active state
  const getIconClass = (itemName) => {
    const baseClass = "transition-colors duration-200"
    const activeClass = "text-indigo-600"
    const inactiveClass = "text-gray-600 group-hover:text-blue-500"

    return `${baseClass} ${activeItem === itemName ? activeClass : inactiveClass}`
  }

  // Text styles with active state - Fixed to ensure text stays within container
  const getTextClass = (itemName) => {
    const baseClass = "hidden nav-item-name font-medium ml-3 transition-colors duration-200 truncate"
    const activeClass = "text-indigo-700"
    const inactiveClass = "text-gray-600 group-hover:text-blue-500"

    return `${baseClass} ${activeItem === itemName ? activeClass : inactiveClass}`
  }

  // Mobile menu styles
  const mobileMenuClass = `
    fixed inset-0 z-50 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    transition-transform duration-300 ease-in-out md:hidden
  `

  // Render navigation items based on user role
  const renderNavItems = (isMobile = false) => {
    const itemContainerClass = isMobile ? "flex flex-col space-y-1 mt-8" : "flex flex-col justify-start space-y-1 mt-6"

    return (
      <div className={itemContainerClass}>
        {userInfo && !userInfo.isAdmin ? (
          // User Navigation
          <>
            <Link to="/home" className={getLinkClass("home")} onClick={isMobile ? closeMobileMenu : undefined}>
              <div className="icon-wrapper">
                <AiOutlineHome className={getIconClass("home")} size={22} />
              </div>
              <span className={getTextClass("home")}>Home</span>
              {activeItem === "home" && <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>}
            </Link>

            <Link to="/shop" className={getLinkClass("shop")} onClick={isMobile ? closeMobileMenu : undefined}>
              <div className="icon-wrapper">
                <AiOutlineShopping className={getIconClass("shop")} size={22} />
              </div>
              <span className={getTextClass("shop")}>Shop</span>
              {activeItem === "shop" && <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>}
            </Link>

            <Link to="/cart" className={getLinkClass("cart")} onClick={isMobile ? closeMobileMenu : undefined}>
              <div className="icon-wrapper">
                <div className="relative">
                  <AiOutlineShoppingCart className={getIconClass("cart")} size={22} />
                  {/* <span className="cart-badge">0</span> */}
                </div>
              </div>
              <span className={getTextClass("cart")}>Cart</span>
              {activeItem === "cart" && <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>}
            </Link>

            <Link to="/favorite" className={getLinkClass("favorite")} onClick={isMobile ? closeMobileMenu : undefined}>
              <div className="icon-wrapper">
                <FaHeart
                  className={`${getIconClass("favorite")} ${
                    activeItem === "favorite" ? "text-pink-500" : "text-pink-400 group-hover:text-pink-500"
                  }`}
                  size={18}
                />
              </div>
              <span className={getTextClass("favorite")}>Favorites</span>
              {activeItem === "favorite" && (
                <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>
              )}
            </Link>
          </>
        ) : userInfo && userInfo.isAdmin ? (
          // Admin Navigation
          <>
            <Link
              to="/admin/dashboard"
              className={getLinkClass("dashboard")}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <div className="icon-wrapper">
                <AiOutlineDashboard className={getIconClass("dashboard")} size={22} />
              </div>
              <span className={getTextClass("dashboard")}>Dashboard</span>
              {activeItem === "dashboard" && (
                <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>
              )}
            </Link>

            <Link
              to="/admin/productlist"
              className={getLinkClass("createProduct")}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <div className="icon-wrapper">
                <AiOutlineShoppingCart className={getIconClass("createProduct")} size={22} />
              </div>
              <span className={getTextClass("createProduct")}>Create Product</span>
              {activeItem === "createProduct" && (
                <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>
              )}
            </Link>

            <Link
              to="/admin/allproductslist"
              className={getLinkClass("allProducts")}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <div className="icon-wrapper">
                <AiOutlineAppstore className={getIconClass("allProducts")} size={22} />
              </div>
              <span className={getTextClass("allProducts")}>All Products</span>
              {activeItem === "allProducts" && (
                <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>
              )}
            </Link>

            <Link
              to="/admin/orderlist"
              className={getLinkClass("orders")}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <div className="icon-wrapper">
                <AiOutlineOrderedList className={getIconClass("orders")} size={22} />
              </div>
              <span className={getTextClass("orders")}>Orders</span>
              {activeItem === "orders" && <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>}
            </Link>

            <Link
              to="/admin/categorylist"
              className={getLinkClass("categories")}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <div className="icon-wrapper">
                <AiOutlineTags className={getIconClass("categories")} size={22} />
              </div>
              <span className={getTextClass("categories")}>Categories</span>
              {activeItem === "categories" && (
                <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>
              )}
            </Link>

            <Link
              to="/admin/userlist"
              className={getLinkClass("users")}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <div className="icon-wrapper">
                <AiOutlineUser className={getIconClass("users")} size={22} />
              </div>
              <span className={getTextClass("users")}>Users</span>
              {activeItem === "users" && <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>}
            </Link>
          </>
        ) : (
          // Guest Navigation (not logged in)
          <>
            <Link to="/login" className={getLinkClass("login")} onClick={isMobile ? closeMobileMenu : undefined}>
              <div className="icon-wrapper">
                <AiOutlineLogin className={getIconClass("login")} size={22} />
              </div>
              <span className={getTextClass("login")}>Login</span>
              {activeItem === "login" && <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>}
            </Link>

            <Link to="/register" className={getLinkClass("register")} onClick={isMobile ? closeMobileMenu : undefined}>
              <div className="icon-wrapper">
                <AiOutlineUserAdd className={getIconClass("register")} size={22} />
              </div>
              <span className={getTextClass("register")}>Register</span>
              {activeItem === "register" && (
                <span className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-md"></span>
              )}
            </Link>
          </>
        )}
      </div>
    )
  }

  // Render user profile section
  const renderUserProfile = (isMobile = false) => {
    if (!userInfo) return null

    const profileContainerClass = isMobile ? "mt-auto border-t border-gray-200 pt-4" : "mt-auto mb-4 px-2"

    return (
      <div className={profileContainerClass} ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center w-full rounded-lg p-2 hover:bg-gray-50 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              {userInfo.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <span
            className={`${isMobile ? "block" : "hidden nav-item-name"} ml-3 text-sm font-medium text-gray-700 truncate max-w-[100px]`}
          >
            {userInfo.username}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${isMobile ? "block" : "hidden nav-item-name"} h-4 w-4 ml-auto transition-transform text-gray-500 ${
              dropdownOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div
            className={`${isMobile ? "relative mt-2" : "absolute bottom-14 right-0 mt-1"} w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50`}
          >
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <AiOutlineUser className="mr-2" size={16} />
              Profile
            </Link>
            <div className="border-t border-gray-100">
              <button
                onClick={logoutHandler}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <AiOutlineLogin className="mr-2" size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-40 md:hidden bg-white p-2 rounded-lg shadow-md"
        aria-label="Toggle menu"
      >
        <HiMenuAlt2 size={24} className="text-gray-700" />
      </button>

      {/* Mobile Menu */}
      <div className={mobileMenuClass}>
        <div className="relative h-full w-64 max-w-[80vw] bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userInfo ? (userInfo.isAdmin ? "Admin Panel" : "Menu") : "Welcome"}
            </h2>
            <button onClick={closeMobileMenu} className="p-2 rounded-lg hover:bg-gray-100">
              <HiX size={20} className="text-gray-700" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col h-full">
            {renderNavItems(true)}
            <div className="flex-grow"></div>
            {renderUserProfile(true)}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        style={{ zIndex: 30 }}
        className="hidden md:flex flex-col justify-between p-3 text-black bg-white/95 backdrop-blur-sm w-[4rem] hover:w-[15rem] h-[100vh] fixed transition-all duration-300 ease-in-out shadow-xl border-r border-gray-100 overflow-hidden"
      >
        {renderNavItems()}
        {renderUserProfile()}
      </div>
    </>
  )
}

export default Navigation
