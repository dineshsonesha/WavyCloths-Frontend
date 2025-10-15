import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import ProductCard from "../../components/user/ProductCard";
import useWishlistAndCart from "../../Hook/useWishlistAndCart";

export default function Products() {
  const { filterProducts, sortProductsByPrice } = useOutletContext();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: categoryId || "all", 
    gender: "",
    color: "",
    size: "",
  });

  const { wishlist, toggleWishlist, addToCart } = useWishlistAndCart(userId);

  const genders = ["MEN", "WOMEN"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories/all");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: categoryId || "all" }));
  }, [categoryId]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () =>
    setFilters({
      category: categoryId || "all",
      gender: "",
      color: "",
      size: "",
    });

  const filteredList = filterProducts.filter((p) => p.status && p.status.toUpperCase() === "IN_STOCK") .filter((p) => {
    let match = true;
    if (filters.category && filters.category !== "all") {match = match && String(p.category?.id) === String(filters.category);}
    if (filters.gender) {match = match && p.gender?.toLowerCase() === filters.gender.toLowerCase();}
    if (filters.color) {match = match && p.color?.toLowerCase().includes(filters.color.toLowerCase());}
    if (filters.size) {match = match && String(p.size) === String(filters.size);}
    return match;
  });

  return (
    <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="md:col-span-1 bg-white p-6 sticky top-24 h-fit shadow-md border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Category Filter */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange("category", value);
              navigate(value === "all" ? "/products/all" : `/products/${value}`);
            }}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Gender Filter */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={filters.gender}
            label="Gender"
            onChange={(e) => handleFilterChange("gender", e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {genders.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Color Filter */}
        <TextField
          fullWidth
          margin="normal"
          label="Color"
          value={filters.color}
          onChange={(e) => handleFilterChange("color", e.target.value)}
        />

        {/* Size Filter */}
        <TextField
          fullWidth
          margin="normal"
          label="Size"
          value={filters.size}
          onChange={(e) => handleFilterChange("size", e.target.value)}
        />

        {/* Sort Options */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Sort By Price</h3>
          <div className="flex gap-2 mb-4">
            <Button
              variant="outlined"
              className="flex-1"
              onClick={() => sortProductsByPrice("asc")}
            >
              Low to High
            </Button>
            <Button
              variant="outlined"
              className="flex-1"
              onClick={() => sortProductsByPrice("desc")}
            >
              High to Low
            </Button>
          </div>
        </div>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>

      {/* Product List */}
      <div className="md:col-span-3">
        {filteredList.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                initialWished={wishlist.includes(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                addToCartProp={(id) => addToCart(id, 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
