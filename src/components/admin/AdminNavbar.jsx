import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiShoppingBag, FiGrid, FiShoppingCart } from "react-icons/fi";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { useAuth } from "@clerk/clerk-react";

export default function AdminNavbar() {
  const location = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [isOpen, setIsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const api = import.meta.env.VITE_API_URL;

  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    // Fetch all orders to count
    fetch(`${api}/orders/all`)
      .then(res => res.json())
      .then(data => {
        const orders = data.data || [];
        setOrdersCount(orders.length);
      })
      .catch(err => console.error("Error fetching orders:", err));
  }, [isSignedIn]);

  const menuItems = [
    { path: "/admin", icon: <FiHome />, label: "Dashboard" },
    { path: "/admin/products", icon: <FiShoppingBag />, label: "Products" },
    { path: "/admin/categories", icon: <FiGrid />, label: "Categories" },
    { path: "/admin/orders", icon: <FiShoppingCart />, label: "Orders", badge: ordersCount },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed md:static z-50 top-0 left-0 h-screen bg-white/80 backdrop-blur-xl shadow-lg border-r border-gray-200 flex flex-col justify-between transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed && (
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-blue-600">Wavy</span>Cloths
            </span>
          )}
          <button
            className="text-gray-600 hover:text-blue-600 transition"
            onClick={() => {
              if (isMobile) setIsOpen(false);
              else setCollapsed(!collapsed);
            }}
          >
            {collapsed ? <HiChevronDoubleRight size={22} /> : <HiChevronDoubleLeft size={22} />}
          </button>
        </div>

        {/* Menu */}
        <div className="mt-4 flex-1">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={`group flex items-center px-4 py-3 rounded-xl mx-2 mb-2 relative transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              {item.badge > 0 && !collapsed && (
                <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex items-center p-4 border-t border-gray-100 ${collapsed ? "justify-center" : ""}`}>
          <img
            src={"/src/assets/profile_image.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          {!collapsed && (
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-gray-800">Dinesh Sonesha</h4>
              <p className="text-xs text-gray-500">dineshsonesha@gmail.com</p>
            </div>
          )}
        </div>
      </div>

      {!isOpen && isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <HiChevronDoubleRight size={20} />
        </button>
      )}
    </>
  );
}
