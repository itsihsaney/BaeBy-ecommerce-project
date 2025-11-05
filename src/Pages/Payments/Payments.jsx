import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const product = location.state?.product;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      method,
      ...form,
      product: product ? product.name : "Custom Order",
      price: product ? product.price : "N/A",
      status: method === "cod" ? "Pending COD" : "Paid",
      date: new Date().toLocaleString(),
    };

    try {
      await axios.post("http://localhost:5001/orders", newOrder);
      navigate("/order-success", { state: { order: newOrder } });
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Complete Your <span className="text-pink-500">Payment</span>
        </h2>

        {/* Product Summary (optional) */}
        {product && (
          <div className="mb-6 text-center bg-pink-50 border border-pink-200 rounded-xl py-3">
            <h3 className="font-semibold text-gray-700">{product.name}</h3>
            <p className="text-pink-600 font-bold">${product.price}</p>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="flex justify-around mb-6">
          {[
            { key: "cod", label: "Cash on Delivery" },
            { key: "card", label: "Debit Card" },
            { key: "upi", label: "UPI" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                method === opt.key
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setMethod(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Payment Form */}
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

          {/* Card Fields */}
          {method === "card" && (
            <>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                maxLength="16"
                value={form.cardNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={form.expiry}
                  onChange={handleChange}
                  required
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                />
                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  maxLength="3"
                  value={form.cvv}
                  onChange={handleChange}
                  required
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>
            </>
          )}

          {/* UPI Field */}
          {method === "upi" && (
            <input
              type="text"
              name="upiId"
              placeholder="UPI ID "
              value={form.upiId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white font-semibold py-3 rounded-xl hover:bg-pink-600 transition transform hover:scale-[1.02]"
          >
            {method === "cod" ? "Place Order" : "Pay Securely"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;
