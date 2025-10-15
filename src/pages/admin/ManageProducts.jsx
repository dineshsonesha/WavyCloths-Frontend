import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManageProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { id: categoryId } = useParams();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/products/all");
      const responseObject = await response.json();
      let responseData = responseObject.data;

      if (categoryId) {
        responseData = responseData.filter(
          (p) => String(p.category?.id) === String(categoryId)
        );

        if (responseData.length > 0) {
          setCategoryName(responseData[0].category?.name);
        } else {
          const catResponse = await fetch(
            `http://localhost:8080/category/${categoryId}`
          );
          if (catResponse.ok) {
            const catData = await catResponse.json();
            setCategoryName(catData.data?.name);
          }
        }
      }

      setProducts(responseData);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/product/delete/${id}`,
        { method: "DELETE" }
      );
      const responseData = await response.json();
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: responseData.message,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchProducts();
      } else {
        Swal.fire("Error", responseData.message || "Failed to delete product", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const getStatusLabel = (product) => {
  if (!product.status) return "Out of Stock";

  const status = product.status.toString().toUpperCase().trim();

  if (status === "IN_STOCK" || status === "TRUE") return "In Stock";
  if (status === "OUT_OF_STOCK" || status === "FALSE") return "Out of Stock";

  return "Out of Stock";
};

const getStatusColor = (product) =>
  getStatusLabel(product) === "In Stock" ? "text-green-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <span className="text-blue-600">Manage</span>{" "}
          {categoryId ? `Products in "${categoryName || `Category ${categoryId}`}"` : "Products"}
        </h1>
        <button onClick={() => navigate("/admin/product/add")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow" >
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-1/3">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={22} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-700 outline-none rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 transition-all duration-200 ease-in-out hover:border-blue-400"
        />
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="px-6 py-4">
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover border" />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category?.name}</td>
                <td className="px-6 py-4">₹{product.price}</td>
                <td className={`px-6 py-4 ${getStatusColor(product)}`}>{getStatusLabel(product)}</td>
                <td className="px-6 py-4 flex gap-2 justify-center">
                  <button onClick={() => navigate(`/admin/product/update/${product.id}`)} className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900">
                    <FiEdit2 className="text-blue-600" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900">
                    <FiTrash2 className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="grid gap-4 md:hidden">
        {filtered.map((product) => (
          <div key={product.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex gap-4">
              <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-lg object-cover border" />
              <div className="flex flex-col flex-1">
                <h2 className="font-medium text-gray-800 dark:text-gray-100">{product.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category?.name}</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">₹{product.price}</p>
                <p className={`text-xs mt-1 ${getStatusColor(product)}`}>{getStatusLabel(product)}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigate(`/admin/product/update/${product.id}`)} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
