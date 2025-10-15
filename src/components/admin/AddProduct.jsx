import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:8080/categories/all");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const responseObject = await response.json();
        setCategories(responseObject.data || []);
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
    fetchCategories();
  }, []);

  const collectFormData = async (formData) => {
    try {
      const res = await fetch(
        `http://localhost:8080/product/category/${formData.categoryId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Product added successfully",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
        reset();
        navigate("/admin/products");
      } else {
        Swal.fire("Error", data.message || "Failed to add product", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6  bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        <span className="text-blue-600">Add</span> Product
      </h2>

      <form
        onSubmit={handleSubmit(collectFormData)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Product Name */}
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter product name"
            {...register("name", {
              required: "Product name is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="categoryId"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
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
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            {...register("price", {
              required: "Price is required",
              min: { value: 0.01, message: "Price must be greater than 0" },
            })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.price ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            {...register("status", { required: "Please select a status" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.status ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label
            htmlFor="size"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Size
          </label>
          <input
            id="size"
            type="text"
            placeholder="Enter size"
            {...register("size")}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Color */}
        <div>
          <label
            htmlFor="color"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Color
          </label>
          <input
            id="color"
            type="text"
            placeholder="Enter color"
            {...register("color")}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        {/* Gender */}
<div>
  <label
    htmlFor="gender"
    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    Gender <span className="text-red-500">*</span>
  </label>
  <select
    id="gender"
    {...register("gender", { required: "Please select a gender" })}
    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
      errors.gender
        ? "border-red-500"
        : "border-gray-300 dark:border-gray-600"
    }`}
  >
    <option value="">Select gender</option>
    <option value="MEN">Men</option>
    <option value="WOMEN">Women</option>
  </select>
  {errors.gender && (
    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
  )}
</div>


        {/* Description */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter product description"
            {...register("description")}
            className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            rows="3"
          ></textarea>
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label
            htmlFor="imageUrl"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="imageUrl"
            type="text"
            placeholder="Enter image URL"
            {...register("imageUrl", { required: "Image URL is required" })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
              errors.imageUrl ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.imageUrl.message}
            </p>
          )}
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
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
