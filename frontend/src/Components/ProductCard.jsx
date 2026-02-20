import React from "react";

function ProductCard({ img, name, price }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
      <img src="/product.jpg" alt={name} className="w-full h-64 object-cover" />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
        <p className="text-pink-500 font-bold mt-1">₹{price}</p>
      </div>
    </div>
  );
}

export default ProductCard;