import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch categories dynamically
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${api}/categories/all`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.data || []);
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
    fetchCategories();
  }, []);

  // Fetch product details by ID
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${api}/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        const product = data.data;
        if (product) {
          setValue("name", product.name);
          setValue("categoryId", product.category?.id || "");
          setValue("price", product.price);
          setValue("status", product.status || "");
          setValue("size", product.size || "");
          setValue("color", product.color || "");
          setValue("description", product.description || "");
          setValue("imageUrl", product.imageUrl || "");
          setValue("gender", product.gender || "");
        }
      } catch {
        Swal.fire("Error", "Failed to fetch product details", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, setValue]);

  // Update product handler
  const collectFormData = async (formData) => {
    try {
      const response = await fetch(
        `${api}/product/${id}/category/${formData.categoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Product updated successfully",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
        navigate("/admin/products");
      } else {
        Swal.fire("Error", data.message || "Failed to update product", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 text-gray-700 dark:text-gray-300">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg my-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        <span className="text-blue-600">Update</span> Product
      </h2>

      <form
        onSubmit={handleSubmit(collectFormData)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name", {
              required: "Product name is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("categoryId", { required: "Please select a category" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.categoryId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("price", { required: "Price is required" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.price ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register("status", { required: "Please select a status" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.status ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>

        {/* Size */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
          <input
            type="text"
            {...register("size")}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
          <input
            type="text"
            {...register("color")}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            {...register("gender", { required: "Please select a gender" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.gender ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select gender</option>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            rows="3"
          ></textarea>
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("imageUrl", { required: "Image URL is required" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.imageUrl ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center md:col-span-2 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
