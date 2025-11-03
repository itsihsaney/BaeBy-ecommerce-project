import React from "react";
import { useWishlist } from "../../Context/WishlistContext";

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (!wishlist) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-pink-50 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Low-key, your wishlist is giving... nothing.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-2">${item.price}</p>

              <button
                onClick={() => removeFromWishlist(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
