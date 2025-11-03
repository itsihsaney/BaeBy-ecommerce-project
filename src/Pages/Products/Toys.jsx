import React, { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import { FaHeart } from "react-icons/fa";

function Toys() {
  const { products, loading, error } = useProducts("toys");
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const { sortType, filterType } = useOutletContext(); //  gets sorting/filtering

  // ✅Apply Sorting and Filtering
  const processedProducts = useMemo(() => {
    let updated = [...products];

    // Apply filter if available
    if (filterType && filterType !== "all") {
      updated = updated.filter(
        (product) =>
          product.category?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Apply sorting logic
    if (sortType === "price-low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-high-low") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortType === "name-az") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "name-za") {
      updated.sort((a, b) => b.name.localeCompare(a.name));
    }

    return updated;
  }, [products, sortType, filterType]);

  if (loading)
    return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Cute Toys
      </h2>

      {processedProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No toys found matching your selection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {processedProducts.map((product) => {
            const isWishlisted = wishlist.some(
              (item) => item.id === product.id
            );

            return (
              <div
                key={product.id}
                className="relative bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 text-xl transition-all ${
                    isWishlisted
                      ? "text-pink-600"
                      : "text-gray-400 hover:text-pink-500"
                  }`}
                >
                  <FaHeart />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-pink-600 font-bold text-lg">
                    ${product.price}
                  </p>

                  <div className="flex justify-center gap-3 mt-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full transition-all duration-200 shadow-md"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-full transition-all duration-200 shadow-md"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Toys;
