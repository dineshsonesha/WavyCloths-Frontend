import { Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${api}/orders/all`);
      const data = await res.json();
      if (data && data.data) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔍 Filter orders by ID or username
  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.username || "Unknown";
    return (
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search)
    );
  });

  // 🗑️ Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch(`${api}/order/${id}`, {
        method: "DELETE",
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  // 🛠️ Update order status
  const handleStatusUpdate = async (id, status) => {
    try {
      await fetch(`${api}/order/status/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <span className="text-blue-600">Manage</span> Orders
        </h1>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-1/3">
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Customer Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.userId || "Unknown"}</td>
                <td className="px-6 py-4">₹{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.orderStatus} />
                </td>
                <td className="px-6 py-4 flex justify-end items-center gap-2">
  {/* Status Update Dropdown */}
  <select
    value={order.orderStatus}
    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
    className="border rounded-lg text-sm p-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
  >
    <option value="PENDING">Pending</option>
    <option value="CONFIRMED">Confirmed</option>
    <option value="DELIVERED">Delivered</option>
    <option value="CANCELLED">Cancelled</option>
  </select>

  <Eye
    size={18}
    className="cursor-pointer text-blue-600"
    onClick={() => navigate(`/orders/${order.id}/cart-products`)}
  />

  <button
    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900"
    onClick={() => handleDelete(order.id)}
  >
    <FiTrash2 className="text-red-600 dark:text-red-400" />
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm"
          >
            <div className="flex justify-between">
              <h2 className="font-medium text-gray-800 dark:text-gray-100">
                Order #{order.id}
              </h2>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {order.userId || "Unknown"}
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              ₹{order.totalAmount}
            </p>
            <div className="flex gap-2 mt-3">
              <Eye
  size={18}
  className="cursor-pointer text-blue-600 flex items-center"
  onClick={() => navigate(`/orders/${order.id}/cart-products`)}
/>
              
              <button
                className="flex-1 px-3 py-1 text-sm rounded-lg bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900 dark:hover:bg-red-800"
                onClick={() => handleDelete(order.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let styles = "";
  if (status === "DELIVERED") styles = "bg-green-100 text-green-600";
  else if (status === "PENDING") styles = "bg-yellow-100 text-yellow-600";
  else if (status === "CANCELLED") styles = "bg-red-100 text-red-600";
  else if (status === "CONFIRMED") styles = "bg-blue-100 text-blue-600";
  else styles = "bg-gray-100 text-gray-600";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}
