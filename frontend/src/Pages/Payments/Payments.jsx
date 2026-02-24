import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const { user } = useAuth();


  const [method, setMethod] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Function to clean price strings like "$50" or "₹59.99"
  const cleanPrice = (value) => {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/[^0-9.]/g, "")) || 0;
  };

  //  Debug: Check what comes from cart or product
  useEffect(() => {
    console.log("🧾 Product received in Payment.jsx:", product);
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let orderItems = [];
    let totalAmount = 0;

    // Prepare items and total amount
    if (product && !Array.isArray(product)) {
      orderItems = [{
        name: product.name || product.title,
        quantity: 1,
        image: product.image,
        price: cleanPrice(product.price || product.amount),
        product: product.id || product._id
      }];
      totalAmount = cleanPrice(product.price || product.amount);
    } else if (Array.isArray(product)) {
      orderItems = product.map((p) => ({
        name: p.name || p.title,
        quantity: p.quantity || 1,
        image: p.image,
        price: cleanPrice(p.price || p.amount),
        product: p.id || p._id
      }));
      totalAmount = product.reduce(
        (sum, p) => sum + cleanPrice(p.price || p.amount) * (p.quantity || 1),
        0
      );
    }

    if (totalAmount <= 0) {
      alert("Error: Total amount is invalid.");
      return;
    }

    const shippingData = {
      address: form.address,
      city: "Default City", // You might want to add these fields to the form
      postalCode: "000000",
      country: "India"
    };

    if (method === "cod") {
      // Handle COD
      const newOrder = {
        items: orderItems,
        totalAmount,
        shippingAddress: shippingData,
        status: "Pending COD"
      };

      try {
        // You might want to have a separate COD endpoint or use the same order endpoint
        // For now, let's just show success as per existing flow but you should probably 
        // implement a real COD order saving in backend if needed.
        // For simplicity, let's assume Razorpay is the main focus here.
        const createdResponse = await api.post("/api/orders", {
          orderItems: orderItems,
          shippingAddress: shippingData,
          paymentMethod: "COD"
        });

        navigate("/order-success", { state: { order: { ...createdResponse.data, id: createdResponse.data._id, method: "cod" }, fromPayment: true } });
      } catch (error) {
        console.error("Error saving COD order:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      // Handle Razorpay
      try {
        // 1. Create order on backend
        const { data } = await api.post("/api/payment/create-order", {
          amount: totalAmount
        });

        const options = {
          key: "rzp_test_SJr8psddTz1yjJ",
          amount: data.order.amount,
          currency: "INR",
          name: "BaeBy Store",
          description: "Purchase Description",
          order_id: data.order.id,
          handler: async function (response) {
            try {
              // 2. Verify payment on backend
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: orderItems,
                totalAmount: totalAmount,
                shippingAddress: shippingData
              };

              const res = await api.post("/api/payment/verify-payment", verifyData);

              if (res.data.success) {
                navigate("/order-success", { state: { order: { id: response.razorpay_order_id, method: "razorpay", status: "Paid" }, fromPayment: true } });
              }
            } catch (err) {
              console.error("Verification failed:", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: form.name,
            email: user?.email,
            contact: form.phone
          },
          theme: {
            color: "#ec4899" // Pink-500
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (error) {
        console.error("Razorpay error:", error);
        alert("Could not initiate payment. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Complete Your <span className="text-pink-500">Payment</span>
        </h2>

        {/*  Product Summary */}
        {product && (
          <div className="mb-6 text-center bg-pink-50 border border-pink-200 rounded-xl py-3">
            <h3 className="font-semibold text-gray-700">
              {Array.isArray(product)
                ? `${product.length} item(s) in your cart`
                : (product.name || product.title)}
            </h3>
            <p className="text-pink-600 font-bold">
              {Array.isArray(product)
                ? `$${product
                  .reduce(
                    (sum, p) =>
                      sum +
                      cleanPrice(p.price || p.amount) * (p.quantity || 1),
                    0
                  )
                  .toFixed(2)}`
                : `$${cleanPrice(product.price || product.amount).toFixed(2)}`}
            </p>
          </div>
        )}

        {/*  Payment Method Selection */}
        <div className="flex justify-around mb-6">
          {[
            { key: "cod", label: "Cash on Delivery" },
            { key: "razorpay", label: "Online (Razorpay)" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${method === opt.key
                ? "bg-pink-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              onClick={() => setMethod(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/*  Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white font-semibold py-3 rounded-xl hover:bg-pink-600 transition transform hover:scale-[1.02]"
          >
            {method === "cod" ? "Place Order" : "Pay with Razorpay"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;
