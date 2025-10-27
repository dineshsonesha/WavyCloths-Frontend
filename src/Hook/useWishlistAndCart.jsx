// src/Hook/useWishlistAndCart.js
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function useWishlistAndCart(userId) {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const fetchWishlist = async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }
    try {
      const res = await fetch(`${api}/wishlist/${userId}`);
      const data = await res.json();
      setWishlist(Array.isArray(data?.data) ? data.data.map((p) => p.id) : []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      Toast.fire({ icon: "error", title: "Failed to fetch wishlist" });
    }
  };

  const fetchCart = async () => {
    if (!userId) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${api}/cart/${userId}`);
      const data = await res.json();
      setCart(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Cart fetch error:", err);
      Toast.fire({ icon: "error", title: "Failed to fetch cart" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, [userId]);

  const toggleWishlist = async (productId) => {
    if (!userId) {
      Toast.fire({ icon: "warning", title: "Login required" });
      return;
    }
    const wished = wishlist.includes(productId);
    try {
      const res = await fetch(`${api}/wishlist/${userId}/${productId}`, {
        method: wished ? "DELETE" : "POST",
      });
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        setWishlist((prev) =>
          wished ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
        Toast.fire({
          icon: "success",
          title: wished ? "Removed from wishlist" : "Added to wishlist",
        });
      } else {
        throw new Error(data?.message || "Wishlist update failed");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      Toast.fire({ icon: "error", title: "Wishlist update failed" });
    }
  };

  const removeWishlist = async (productId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${api}/wishlist/${userId}/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        Toast.fire({ icon: "success", title: "Wishlist item removed" });
      } else {
        throw new Error(data?.message || "Failed to remove wishlist item");
      }
    } catch (err) {
      console.error("Wishlist remove error:", err);
      Toast.fire({ icon: "error", title: "Failed to remove wishlist item" });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!userId) {
      Toast.fire({ icon: "warning", title: "Login required" });
      return;
    }
    try {
      const res = await fetch(
        `${api}/cart/${userId}/${productId}/${quantity}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        setCart(Array.isArray(data?.data) ? data.data : []);
        Toast.fire({ icon: "success", title: "Added to cart" });
      } else {
        throw new Error(data?.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Cart add error:", err);
      Toast.fire({ icon: "error", title: "Cart add failed" });
    }
  };

  const updateCartQuantity = async (productId, newQty) => {
    if (!userId) {
      Toast.fire({ icon: "warning", title: "Login required" });
      return;
    }
    if (newQty < 1) {
      return removeFromCart(productId);
    }
    try {
      const res = await fetch(`${api}/cart/${userId}/${productId}/${newQty}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        setCart((prev) =>
          prev.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQty }
              : item
          )
        );
        Toast.fire({ icon: "success", title: "Cart updated" });
      } else {
        throw new Error(data?.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Cart update error:", err);
      Toast.fire({ icon: "error", title: "Cart update failed" });
    }
  };

  const removeFromCart = async (productId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${api}/cart/${userId}/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        setCart((prev) => prev.filter((i) => i.product.id !== productId));
        Toast.fire({ icon: "success", title: "Removed from cart" });
      } else {
        throw new Error(data?.message || "Failed to remove from cart");
      }
    } catch (err) {
      console.error("Cart delete error:", err);
      Toast.fire({ icon: "error", title: "Failed to remove from cart" });
    }
  };

  return {
    wishlist,
    cart,
    loading,
    fetchCart,
    toggleWishlist,
    removeWishlist,
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
  };
}
