import React, { useEffect, useState } from "react";
import { FiBox, FiTag, FiShoppingCart, FiDollarSign, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersRes = await fetch("http://localhost:8080/orders/all");
        const ordersData = await ordersRes.json();
        const orders = ordersData.data || [];

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        // Recent 5 orders
        const sortedOrders = [...orders].sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setRecentOrders(sortedOrders.slice(0, 5));

        // Fetch products
        const productsRes = await fetch("http://localhost:8080/products/all");
        const productsData = await productsRes.json();
        const products = productsData.data || [];
        const totalProducts = products.length;

        // Fetch categories
        const categoriesRes = await fetch("http://localhost:8080/categories/all");
        const categoriesData = await categoriesRes.json();
        const categories = categoriesData.data || [];
        const totalCategories = categories.length;

        // Update stats
        setStats({
          totalProducts,
          totalCategories,
          totalOrders,
          totalRevenue,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Please login as Admin</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-blue-600">Admin</span> Dashboard
        </h1>
        <p className="text-gray-500">Welcome back, here’s what’s happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FiBox />} label="Products" value={stats.totalProducts} />
        <StatCard icon={<FiTag />} label="Categories" value={stats.totalCategories} />
        <StatCard icon={<FiShoppingCart />} label="Orders" value={stats.totalOrders} />
        <StatCard icon={<FiDollarSign />} label="Revenue" value={`$${stats.totalRevenue}`} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <ActionButton
          icon={<FiPlus />}
          label="Add Product"
          onClick={() => navigate("/admin/product/add")}
        />
        <ActionButton
          icon={<FiPlus />}
          label="Add Category"
          onClick={() => navigate("/admin/category/add")}
        />
        <ActionButton
          icon={<FiShoppingCart />}
          label="View Orders"
          onClick={() => navigate("/admin/orders")}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 hidden md:block mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.userId}</td>
                <td className="px-6 py-4">${order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.orderStatus === "COMPLETED"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Reusable Stat Card Component */
function StatCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow border border-gray-200 flex items-center gap-4">
      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg text-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* Reusable Action Button Component */
function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
    >
      {icon} {label}
    </button>
  );
}
