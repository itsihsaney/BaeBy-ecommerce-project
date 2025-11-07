

// import React, { useState, useMemo } from "react";
// import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
// import useProducts from "../../hooks/useProducts";
// import { useCart } from "../../Context/CartContext";
// import { useWishlist } from "../../Context/WishlistContext";
// import { FaHeart } from "react-icons/fa";
// import { useAuth } from "../../Context/AuthContext";

// function AllProducts() {
//   const { products, loading, error } = useProducts();
//   const { addToCart } = useCart();
//   const { wishlist, toggleWishlist } = useWishlist();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { sortType, filterType } = useOutletContext();

//   // URL parameter for search persistence
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 8;

//   // Apply Sorting, Filtering & Searching
//   const processedProducts = useMemo(() => {
//     let updated = [...products];

//     // Filter by category
//     if (filterType && filterType !== "all") {
//       updated = updated.filter(
//         (product) =>
//           product.category?.toLowerCase() === filterType.toLowerCase()
//       );
//     }

//     // Sorting logic
//     switch (sortType) {
//       case "price-low-high":
//         updated.sort((a, b) => a.price - b.price);
//         break;
//       case "price-high-low":
//         updated.sort((a, b) => b.price - a.price);
//         break;
//       case "name-az":
//         updated.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "name-za":
//         updated.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       default:
//         break;
//     }

//     //  Search Filter (by name, description, or category)
//     if (searchTerm.trim() !== "") {
//       updated = updated.filter((product) => {
//         const lowerSearch = searchTerm.toLowerCase();
//         return (
//           product.name.toLowerCase().includes(lowerSearch) ||
//           product.description?.toLowerCase().includes(lowerSearch) ||
//           product.category?.toLowerCase().includes(lowerSearch)
//         );
//       });
//     }

//     return updated;
//   }, [products, sortType, filterType, searchTerm]);

//   // Pagination logic
//   const totalPages = Math.ceil(processedProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const currentProducts = processedProducts.slice(
//     startIndex,
//     startIndex + productsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Loading & Error
//   if (loading)
//     return <p className="text-center text-gray-500 py-10">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-500 py-10">{error}</p>;

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//         All Products
//       </h2>

//       {/* 🔍 Search Bar */}
//       <div className="flex justify-center mb-8">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setSearchParams({ search: e.target.value });
//             setCurrentPage(1); // Reset to first page when searching
//           }}
//           className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
//         />
//       </div>

//       {processedProducts.length === 0 ? (
//         <p className="text-center text-gray-500">No products found.</p>
//       ) : (
//         <>
//           {/* Product Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {currentProducts.map((product) => {
//               const isWishlisted = wishlist.some(
//                 (item) => item.id === product.id
//               );

//               return (
//                 <div
//                   key={product.id}
//                   className="relative bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
//                 >
//                   {/* Wishlist Button */}
//                   <button
//                     onClick={() => {
//                       user ? toggleWishlist(product) : navigate("/login");
//                     }}
//                     className={`absolute top-3 right-3 text-xl transition-all ${
//                       isWishlisted
//                         ? "text-pink-600 scale-125"
//                         : "text-gray-400 hover:text-pink-500"
//                     }`}
//                   >
//                     <FaHeart />
//                   </button>

//                   {/* Product Image */}
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-52 object-cover"
//                   />

//                   {/* Product Info */}
//                   <div className="p-4 text-center">
//                     <h3 className="text-lg font-semibold text-gray-700">
//                       {product.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 mb-2 line-clamp-2">
//                       {product.description}
//                     </p>
//                     <p className="text-pink-600 font-bold text-lg">
//                       ${product.price}
//                     </p>

//                     {/* Buttons */}
//                     <div className="flex justify-center gap-3 mt-3">
//                       <button
//                         onClick={() => {
//                           user ? addToCart(product) : navigate("/login");
//                         }}
//                         className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full transition-all duration-200 shadow-md"
//                       >
//                         Add to Cart
//                       </button>
//                       <button
//                         onClick={() => navigate(`/product/${product.id}`)}
//                         className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-full transition-all duration-200 shadow-md"
//                       >
//                         View
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Pagination Controls */}
//           <div className="flex justify-center items-center gap-3 mt-12">
//             <button
//               onClick={() =>
//                 currentPage > 1 && handlePageChange(currentPage - 1)
//               }
//               disabled={currentPage === 1}
//               className={`px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 ${
//                 currentPage === 1
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-pink-500 hover:bg-pink-600 text-white"
//               }`}
//             >
//               ← Prev
//             </button>

//             <div className="flex gap-2">
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handlePageChange(i + 1)}
//                   className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
//                     currentPage === i + 1
//                       ? "bg-pink-600 text-white shadow-md scale-110"
//                       : "bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() =>
//                 currentPage < totalPages && handlePageChange(currentPage + 1)
//               }
//               disabled={currentPage === totalPages}
//               className={`px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 ${
//                 currentPage === totalPages
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-pink-500 hover:bg-pink-600 text-white"
//               }`}
//             >
//               Next →
//             </button>
//           </div>
//         </>
//       )}
//     </section>
//   );
// }

// export default AllProducts;

import React, { useState, useMemo } from "react";
import { useNavigate, useParams, useOutletContext, useSearchParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";

function AllProducts() {
  const { category } = useParams(); // 👈 dynamic category from URL (clothes, skincare, toys)
  const { products, loading, error } = useProducts(category); // 👈 hook can fetch category-wise products
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sortType, filterType } = useOutletContext();

  // Search + Pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Combined logic for Filter + Sort + Search
  const processedProducts = useMemo(() => {
    let updated = [...products];

    // 🔹 Category filter (if /products/clothes, etc.)
    if (category) {
      updated = updated.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 🔹 Filter by price range
    if (filterType === "under20") {
      updated = updated.filter((p) => p.price < 20);
    } else if (filterType === "20to40") {
      updated = updated.filter((p) => p.price >= 20 && p.price <= 40);
    } else if (filterType === "above40") {
      updated = updated.filter((p) => p.price > 40);
    }

    // 🔹 Sorting
    if (sortType === "lowToHigh" || sortType === "price-low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortType === "highToLow" || sortType === "price-high-low") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortType === "name-az") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "name-za") {
      updated.sort((a, b) => b.name.localeCompare(a.name));
    }

    // 🔹 Search (by name, description, or category)
    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      updated = updated.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower)
      );
    }

    return updated;
  }, [products, sortType, filterType, searchTerm, category]);

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = processedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {category ? `Baby ${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"}
      </h2>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearchParams({ search: e.target.value });
            setCurrentPage(1);
          }}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
        />
      </div>

      {processedProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentProducts.map((product) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id);
              return (
                <div
                  key={product.id}
                  className="relative bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                  <button
                    onClick={() => {
                      user ? toggleWishlist(product) : navigate("/login");
                    }}
                    className={`absolute top-3 right-3 text-xl transition-all ${
                      isWishlisted
                        ? "text-pink-600 scale-125"
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
                    <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-pink-600 font-bold text-lg">${product.price}</p>

                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        onClick={() => {
                          user ? addToCart(product) : navigate("/login");
                        }}
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              ← Prev
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-pink-600 text-white shadow-md scale-110"
                      : "bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default AllProducts;
