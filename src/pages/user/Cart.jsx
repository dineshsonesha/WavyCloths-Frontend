import React from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { IconButton, Button } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useWishlistAndCart from "../../Hook/useWishlistAndCart";

export default function Cart() {
  const { userId } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    cart,
    loading,
    updateCartQuantity,
    removeFromCart,
    fetchCart,
  } = useWishlistAndCart(userId);

  const inStockCart = cart.filter(
    (item) => item.product.status?.toUpperCase() === "IN_STOCK"
  );

  const totalAmount = inStockCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Load Razorpay script dynamically
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleCheckout = async () => {
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
    const res = await fetch("http://localhost:8080/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount }),
    });
    const order = await res.json();

    const options = {
      key: "rzp_test_RTHUaWxS96gPE2",
      amount: order.amount,
      currency: order.currency,
      name: "GrocyMart",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        try {
          const verifyRes = await fetch("http://localhost:8080/api/payment/verify", {
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
            
            // 🔹 Refresh cart in frontend after order
            await fetchCart(); // <- This will update your cart to empty
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


  if (!userId) return <p className="text-center py-10">Please login to view cart</p>;
  if (loading) return <p className="text-center py-10">Loading cart...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-2 space-y-4">
        {inStockCart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          inStockCart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between p-4 bg-white shadow-md border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-gray-500 text-sm">₹{item.product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-1">
                  <IconButton
                    size="small"
                    onClick={() =>
                      updateCartQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <span className="px-1 font-medium">{item.quantity}</span>
                  <IconButton
                    size="small"
                    onClick={() =>
                      updateCartQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    <Add />
                  </IconButton>
                </div>

                <p className="font-bold w-24 text-right">
                  ₹{item.product.price * item.quantity}
                </p>

                <IconButton
                  color="error"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white shadow-lg p-6 border border-gray-200 rounded-lg flex flex-col justify-between h-full">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <p key={item.product.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{item.product.price * item.quantity}</span>
              </p>
            ))}
          </div>
          <hr className="my-4" />
          <p className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Buy Now →
          </Button>
        </div>
      </div>
    </div>
  );
}
