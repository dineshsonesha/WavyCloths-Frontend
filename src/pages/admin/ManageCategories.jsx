import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManageCategories() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); 
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${api}/categories/all`);
      const responseObject = await response.json();
      setCategories(responseObject.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${api}/products/all`);
      const responseObject = await response.json();
      setProducts(responseObject.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProducts(); 
  }, []);

  const getCategoryProductCount = (categoryId) => {
    return products.filter((p) => p.category?.id === categoryId).length;
  };

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await fetch(
        `${api}/category/delete/${id}`,
        { method: "DELETE" }
      );
      const responseData = await response.json();
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: responseData.message || "Category deleted successfully",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        fetchCategory();
        fetchProducts();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          <span className="text-blue-600">Manage</span> Categories
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg shadow transition"
          onClick={() => navigate("/admin/category/add")}
        >
          <FiPlus size={18} /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-1/3">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          size={22}
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-700 outline-none rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 transition-all duration-200 ease-in-out hover:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Image
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Category Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Total Products
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <td className="px-6 py-4 text-center">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700 mx-auto"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100 text-center">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                  {getCategoryProductCount(category.id)}
                </td>
                <td className="px-6 py-4 flex gap-2 justify-center">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => navigate(`/admin/category/${category.id}/products`)}
                  >
                    <FiEye className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    onClick={() =>
                      navigate(`/admin/category/update/${category.id}`)
                    }
                  >
                    <FiEdit2 className="text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition"
                    onClick={() => handleDelete(category.id)}
                  >
                    <FiTrash2 className="text-red-600 dark:text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
