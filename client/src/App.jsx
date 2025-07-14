import React, { useEffect, useState } from "react";
import { ShoppingCart, User, Home, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Outlet } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";
import SingleProductInfo from "./components/SingleProductInfo";
import  HomeComponent from "./pages/HomePage";
import CartItem from "./components/CartItem";
import OrdersList from "./components/OrderList";


import { Toaster } from "react-hot-toast";
function App() {
  const {user} = useSelector((state)=> state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin-panel");
    }
  }, [user, navigate]);
  
  return (
    <>
     <Toaster />
     <Navbar />
     <Outlet />
    </>
    
  );
 
}

export default App;
