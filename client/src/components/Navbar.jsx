import React, { useState } from "react";
import { ShoppingCart, User, Home, ChevronDown, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "./images/logo.png"
import { useDispatch } from "react-redux";
import { authSliceActions } from "@/store/authSlice";
import toast from "react-hot-toast";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.myCart);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.user?.isAdmin);

  const handleLogout = () => {
    dispatch(authSliceActions.logout());
    // localStorage.removeItem("user");
    toast.success("Logout successful");
    navigate("/");
  };


  const userItems = [
    { name: "Login", to: "/login", active: !isLoggedIn },
    { name: "Sign Up", to: "/signup", active: !isLoggedIn },
    { name: "Profile", to: "/user-profile", active: isLoggedIn },
    { name: "Orders", to: "/my-orders", active: isLoggedIn },
    // { name: "Settings", to: "/settings", active: isLoggedIn },
    { name: "Go to Admin Panel", to: "/admin-panel", active: isAdmin },
    // { name: "Start Selling", to: "/start-selling", active: !isAdmin},
    // { name: "Logout", to: "/logout", active: isLoggedIn },
  ];

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md ">
      <div className="flex items-center justify-center">
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-10 object-cover"
        />
        <span className="ml-2 text-xl font-bold">NEXT-GEN TECH</span>
      </div>
      <div className="flex items-center space-x-4" >
        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => navigate("/")}>
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => navigate("/all-products")}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full relative" onClick={() => navigate("/cart")}>
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Cart</span>
          {cart?.cartItems?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart?.cartItems?.length}
            </span>
          )}
        </button>
        <div className="relative border border-gray-300 rounded-full">
          <button
            className="p-2 hover:bg-gray-100 rounded-full flex items-center"
            onClick={toggleDropdown}
          >
            <User className="h-5 w-5" />
            <ChevronDown className="h-4 w-4 ml-1" />
            <span className="sr-only">User menu</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ">
              {userItems?.map(
                (item, index) =>
                  item.active && (
                    <Link to={item.to} key={index}>
                      <div
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.name}
                      </div>
                    </Link>
                  )
              )}

              {isLoggedIn && (

                <button
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;




