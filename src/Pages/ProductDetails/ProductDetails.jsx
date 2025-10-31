import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../Context/CartContext";

function ProductDetails() {
  const { id } = useParams(); // Product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false); // ✅ success message state

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔄 Add to Cart Handler
  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading product details...
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  // ⚠️ Not Found
  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Product not found.
      </div>
    );
  }

  // ✅ Product Details
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-12">
      {/* Left: Product Image */}
      <div className="flex-1 flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-2xl shadow-lg w-80 md:w-96 object-cover"
        />
      </div>

      {/* Right: Product Info */}
      <div className="flex-1 max-w-md space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {product.name}
        </h1>

        <p className="text-gray-600">{product.description}</p>

        <p className="text-2xl font-semibold text-pink-600">${product.price}</p>

        <div className="flex items-center gap-4">
          {/* ✅ Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`border border-pink-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              added
                ? "bg-pink-600 text-white scale-105"
                : "text-pink-600 hover:bg-pink-600 hover:text-white"
            }`}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>

          {/* 🛒 Buy Now Button */}
          <button className="border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-6 py-3 rounded-xl font-medium transition">
            Buy Now
          </button>
        </div>

        {/* Category */}
        <div className="pt-4 border-t border-gray-300">
          <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
          <p className="text-gray-600 capitalize">{product.category}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
