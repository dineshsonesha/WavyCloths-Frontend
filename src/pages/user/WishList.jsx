import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import ProductCard from "../../components/user/ProductCard";

export default function Wishlist() {
  const { user } = useUser();
  const userId = user?.id;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`http://localhost:8080/wishlist/${userId}`);
        const data = await res.json();
        const inStockWishlist = (data.data).filter(
          (item) =>
            item.product.status &&
            item.product.status.toUpperCase() === "IN_STOCK"
        );
        setWishlist(inStockWishlist);

      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [userId]);

  const removeFromWishlist = async (productId) => {
    try {
      await fetch(`http://localhost:8080/wishlist/${userId}/${productId}`, {
        method: "DELETE",
      });
      setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await fetch(`http://localhost:8080/cart/${userId}/${productId}?quantity=1`, {method: "POST",});
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
  if (!userId) {return <p className="text-center mt-8">Please login to view your wishlist.</p>;}
  if (loading) {return <p className="text-center mt-8">Loading wishlist...</p>;}

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {wishlist.map((item) => (
            <ProductCard
              key={item.id} 
              product={item.product}
              addToCart={addToCart}
              showRemove={true}     
              onRemove={removeFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
