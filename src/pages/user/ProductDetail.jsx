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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${api}/products/${id}`);
        const data = await res.json();
        if (data.data) {
          setProduct(data.data);
          if (data.data.category?.id) {
            const response = await fetch(`${api}/products/category/${data.data.category.id}`);
            const responseData = await response.json();
            setRelatedProducts(
              (responseData.data).filter((p) => p.id !== data.data.id).filter((p) => p.status && p.status.toUpperCase() === "IN_STOCK")
            );
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
  // Load Razorpay script
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("❌ Razorpay SDK failed to load");
    return;
  }

  try {
    const res = await fetch(`${api}/api/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: product.id }),
    });
    const order = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "WavyCloths",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        try {
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
            alert("✅ Payment successful and order placed!");
            await fetchCart(); 
            navigate("/my-orders");
          } else {
            const err = await verifyRes.json();
            alert("⚠ Payment verification failed: " + (err?.error || JSON.stringify(err)));
          }
        } catch (err) {
          console.error(err);
          alert("⚠ Something went wrong during verification");
        }
      },
      prefill: {
        name: user?.fullName || "Customer",
        email: user?.primaryEmailAddress?.emailAddress || "customer@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on("payment.failed", (response) => {
      alert("❌ Payment Failed\nReason: " + response.error.description);
    });
  } catch (error) {
    console.error(error);
    alert("❌ Something went wrong while initializing payment");
  }
};


  if (!product)
    return (
      <p className="text-center py-12 text-gray-500 text-lg">Loading...</p>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[28rem] object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Wishlist button */}
          <div className="absolute top-4 right-4">
            <IconButton
              className="bg-white shadow-md hover:bg-gray-100"
              onClick={() => toggleWishlist(product.id)}
            >
              <Favorite
                className={
                  wishlist.includes(product.id)
                    ? "text-red-500"
                    : "text-gray-400"
                }
              />
            </IconButton>
          </div>
        </div>

        {/* Info */}
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

          {/* Actions */}
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
              onClick={() => handleBuyNow(product)} // pass entire product
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
