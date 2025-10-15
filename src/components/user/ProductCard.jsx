import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Favorite, ShoppingCart, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Swal from "sweetalert2";

export default function ProductCard({
  product,
  initialWished = false,
  showRemove = false,
  onRemove,
  addToCartProp,
  onToggleWishlist, 
}) {
  const [wished, setWished] = useState(initialWished);

  useEffect(() => {
    setWished(initialWished);
  }, [initialWished]);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const handleWishlist = async () => {
    if (!onToggleWishlist) return;
    try {
      await onToggleWishlist(product.id);
      setWished((prev) => !prev);
      Toast.fire({
        icon: wished ? "error" : "success",
        title: wished ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      Toast.fire({ icon: "error", title: "Something went wrong" });
    }
  };

  const handleAddToCart = async () => {
    if (!addToCartProp) return;
    try {
      await addToCartProp(product.id);
      Toast.fire({ icon: "success", title: "Product added to cart!" });
    } catch (err) {
      console.error("Add to cart error:", err);
      Toast.fire({ icon: "error", title: "Something went wrong" });
    }
  };

  return (
    <div className="group relative bg-white shadow-md hover:shadow-xl transition-shadow overflow-hidden rounded-xl">
      {/* Wishlist / Delete Icon */}
      <div className="absolute top-2 right-2 z-10">
        {showRemove ? (
          <IconButton
            className="bg-white shadow-md hover:bg-gray-100"
            size="small"
            onClick={() => onRemove?.(product.id)}
          >
            <Delete className="text-gray-500 hover:text-red-600" />
          </IconButton>
        ) : (
          <IconButton
            className="bg-white shadow-md hover:bg-gray-100"
            size="small"
            onClick={handleWishlist}
          >
            <Favorite className={wished ? "text-red-500" : "text-gray-400"} />
          </IconButton>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-1">
          {product.color} | Size: {product.size}
        </p>
        <p className="text-gray-800 mb-3 font-bold">₹{product.price}</p>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
