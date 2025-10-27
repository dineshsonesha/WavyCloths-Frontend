import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Hero from "../../components/user/Hero";
import ProductCard from "../../components/user/ProductCard";
import useWishlistAndCart from "../../Hook/useWishlistAndCart";

export default function Home() {
  const { user } = useUser();
  const userId = user?.id;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const { wishlist, toggleWishlist, addToCart } = useWishlistAndCart(userId);
  const api = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${api}/products/all`,{method: 'GET',});
      const responseObject = await response.json();
      const inStockProducts = (responseObject.data || []).filter(
          (p) => p.status && p.status.toUpperCase() === "IN_STOCK"
        );
      setProducts(inStockProducts);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${api}/categories/all`,{method: 'GET',});
      const responseObject = await response.json();
      setCategories(responseObject.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    fetchCategories().then(fetchProducts);
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.slice(0, 7).map((cat) => (
            <Link
              key={cat.id || cat._id} 
              to={`/products/${cat.id || cat._id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-32 object-contain rounded-lg mb-2"
              />
              <h3 className="font-medium">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            to="/products/all"
            className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            <span>View Products</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {products.slice(0, 10).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                initialWished={wishlist.includes(product.id)}
                addToCartProp={(id) => addToCart(id, 1)}
                onToggleWishlist={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
