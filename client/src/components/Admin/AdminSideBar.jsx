import React from "react";
import { Home, User, Settings, BarChart, LogOut, Plus,ShoppingCart  } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {

  const adminPanelLinks = [
    { label: "Dashboard", icon: <Home className="w-5 h-5" />, to: "/admin-panel" },
    { label: "Users", icon: <User  className="w-5 h-5"/>, to: "/admin-panel/users" },
    { label: "Products", icon: <ShoppingCart className="w-5 h-5" />, to: "/admin-panel/products" },
    { label: "Orders", icon: <Settings className="w-5 h-5" />, to: "/admin-panel/orders" },
    {label: "Charts", icon: <BarChart className="w-5 h-5" />, to: "/admin-panel/charts"},
    { label: "Add Product", icon: <Plus className="w-5 h-5" />, to: "/admin-panel/add-product" },
  ];
  return (
    <div className="h-full bg-gray-800 text-white flex flex-col w-full">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4">
        <ul className="space-y-4">
          {adminPanelLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.to}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-700">
        <a
          href="#"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
