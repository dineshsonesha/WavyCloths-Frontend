import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Favorite } from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import { useUser } from "@clerk/clerk-react";
import ProductCard from "../../components/user/ProductCard";
import useWishlistAndCart from "../../Hook/useWishlistAndCart";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const userId = user?.id;
  const { wishlist, toggleWishlist, addToCart } = useWishlistAndCart(userId);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  // 🧠 Fetch product + related
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${api}/products/${id}`);
        const data = await res.json();
        if (data.data) {
          setProduct(data.data);
          if (data.data.category?.id) {
            const res2 = await fetch(`${api}/products/category/${data.data.category.id}`);
            const catData = await res2.json();
            setRelatedProducts(
              (catData.data || [])
                .filter((p) => p.id !== data.data.id)
                .filter((p) => p.status?.toUpperCase() === "IN_STOCK")
            );
          }
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // 💳 Razorpay flow
  const handleBuyNow = async (product) => {
    const loadRazorpay = () =>
      new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay SDK failed to load. Try again.");

    try {
      // ✅ Razorpay expects amount in paise (INR × 100)
      const amountInPaise = Math.round(Number(product.price) * 100);

      // 🔹 Create order on backend
      const res = await fetch(`${api}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });
      const order = await res.json();

      if (!order.id) {
        console.error("Order creation failed:", order);
        return alert("Failed to create order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "WavyCloths",
        description: product.name,
        order_id: order.id,
        handler: async function (response) {
          console.log("✅ Payment Success:", response);

          const verifyRes = await fetch(`${api}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
            }),
          });

          if (verifyRes.ok) {
            const placeOrderRes = await fetch(
              `${api}/api/orders/place?userId=${userId}&productId=${product.id}`,
              { method: "POST" }
            );

            if (placeOrderRes.ok) {
              alert("✅ Payment successful and order placed!");
              window.location.href = "/my-orders";
            } else {
              alert("⚠ Payment succeeded but order placement failed!");
            }
          } else {
            alert("⚠ Payment verification failed!");
          }
        },
        prefill: {
          name: user?.fullName || "Customer",
          email: user?.primaryEmailAddress?.emailAddress || "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#F5C518" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        alert("Payment Failed ❌\nReason: " + response.error.description);
      });
    } catch (err) {
      console.error("💳 Payment Error:", err);
      alert("Something went wrong while initializing payment.");
    }
  };

  if (!product)
    return (
      <p className="text-center py-12 text-gray-500 text-lg">Loading...</p>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* 🖼 Product Image */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[28rem] object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* ❤️ Wishlist */}
          <div className="absolute top-4 right-4">
            <IconButton
              sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f3f4f6" } }}
              onClick={() => toggleWishlist(product.id)}
            >
              <Favorite
                sx={{
                  color: wishlist.includes(product.id)
                    ? "red"
                    : "gray",
                  width: 26,
                  height: 26,
                }}
              />
            </IconButton>
          </div>
        </div>

        {/* ℹ Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <ul className="list-disc list-inside mb-6 space-y-1">
              <li>Color: {product.color}</li>
              <li>Size: {product.size}</li>
              <li>Gender: {product.gender}</li>
              <li>Category: {product.category?.name}</li>
            </ul>

            <p className="text-3xl font-extrabold text-gray-900 mb-4">
              ₹{product.price}
            </p>
          </div>

          {/* 🛒 Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="flex-1 py-3"
              onClick={() => addToCart(product.id)}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className="flex-1 py-3"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Related Products
        </h2>
        {relatedProducts.length === 0 ? (
          <p className="text-center text-gray-600">
            No related products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                initialWished={wishlist.includes(p.id)}
                onToggleWishlist={() => toggleWishlist(p.id)}
                addToCartProp={addToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
