import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiPackage, FiDollarSign, FiCalendar } from "react-icons/fi";
import { useClerk } from "@clerk/clerk-react";

export default function MyOrders() {
  const { user } = useClerk();
  const [orders, setOrders] = useState([]);

  // Fetch orders for logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:8080/orders/user/${user.id}`);
        const data = await response.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      }
    };
    fetchOrders();
  }, [user?.id]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce((a, b) => a + (b.carts?.length || 0), 0);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          👋 Hi,{" "}
          <span className="text-blue-600">
            {user?.fullName || user?.username || "Customer"}
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Track all your orders and purchases here
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3">
          <FiDollarSign size={28} className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              ₹{totalSpent.toFixed(2)}
            </h2>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3">
          <FiPackage size={28} className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {totalOrders}
            </h2>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3">
          <FiShoppingBag size={28} className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Items Purchased</p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {totalItems}
            </h2>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  You haven’t placed any orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiCalendar size={14} />{" "}
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {order.carts?.length} item(s)
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        order.orderStatus === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Delivered"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
