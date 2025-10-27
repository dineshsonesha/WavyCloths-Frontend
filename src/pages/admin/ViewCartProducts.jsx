import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function ViewCartProducts() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${api}/orders/${orderId}/cart-products`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [orderId]);

  const totalAmount = products.reduce((sum, p) => sum + (p.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <span className="text-blue-600">Order #{orderId}</span> — Cart Products
        </h1>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No products found for this order.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 hidden md:block">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">{p.name}</td>
                    <td className="px-6 py-4">{p.quantity}</td>
                    <td className="px-6 py-4">₹{p.price?.toFixed(2)}</td>
                    <td className="px-6 py-4">₹{p.totalPrice?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                <h2 className="font-medium text-gray-800 dark:text-gray-100">{p.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {p.quantity}</p>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Price: ₹{p.price?.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Subtotal: ₹{p.totalPrice?.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="flex justify-end mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl px-6 py-3">
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </p>
            </div>
         

          </div>
        </>
      )}
    </div>
  );
}
