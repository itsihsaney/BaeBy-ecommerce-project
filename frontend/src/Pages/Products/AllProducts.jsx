import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useOutletContext, useSearchParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import { FaHeart, FaEye, FaShoppingBag } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";

function AllProducts() {
  const { category } = useParams();
  const { products, loading, error } = useProducts(category);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sortType, filterType, priceRange } = useOutletContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const productsPerPage = 8;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const processedProducts = useMemo(() => {
    let updated = [...products];

    if (category) {
      updated = updated.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Slider filter
    if (priceRange) {
      updated = updated.filter((p) => p.price <= priceRange);
    }

    if (filterType === "under20") {
      updated = updated.filter((p) => p.price < 20);
    } else if (filterType === "20to40") {
      updated = updated.filter((p) => p.price >= 20 && p.price <= 40);
    } else if (filterType === "above40") {
      updated = updated.filter((p) => p.price > 40);
    }

    if (sortType === "lowToHigh" || sortType === "price-low-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortType === "highToLow" || sortType === "price-high-low") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortType === "name-az") {
      updated.sort((a, b) => (a.name || a.title || "").localeCompare(b.name || b.title || ""));
    }

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      updated = updated.filter(
        (p) =>
          (p.name || p.title || "").toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      );
    }

    return updated;
  }, [products, sortType, filterType, searchTerm, category, priceRange]);

  const totalPages = Math.ceil(processedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = processedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    if (searchTerm) newParams.set("search", searchTerm);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-xl text-red-500 font-semibold">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full">Retry</button>
    </div>
  );

  return (
    <section className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Collections"}
          <span className="block w-12 h-1 bg-pink-500 mt-2"></span>
        </h2>

        <div className="relative group w-full max-w-sm">
          <input
            type="text"
            placeholder="Search our treasures..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchParams(prev => {
                prev.set("search", e.target.value);
                prev.set("page", "1");
                return prev;
              });
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-gray-700 font-medium"
          />
          <FaShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-pink-400 transition-colors" />
        </div>
      </div>

      {processedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-50">
          <p className="text-gray-400 text-lg">We couldn't find any products matching your selection.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {currentProducts.map((product) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id);
              const name = product.name || product.title;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-50"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-pink-600 rounded-full shadow-sm">
                      {product.category || 'Essential'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      user ? toggleWishlist(product) : navigate("/login");
                    }}
                    className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${isWishlisted
                      ? "bg-pink-500 text-white shadow-pink-200 shadow-xl"
                      : "bg-white/80 text-gray-400 hover:text-pink-500 hover:bg-white"
                      }`}
                  >
                    <FaHeart className={isWishlisted ? "animate-bounce" : "transition-transform active:scale-150"} />
                  </button>

                  <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <img
                      src="/product.jpg"
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-pink-500 hover:text-white"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col items-center">
                    <h3 className="text-center font-bold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-pink-600 transition-colors">
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-400 line-through tracking-wider">$ {(product.price * 1.2).toFixed(2)}</span>
                      <span className="text-xl font-black text-gray-900 tracking-tight">${product.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        user ? addToCart(product) : navigate("/login");
                      }}
                      className="w-full py-3 bg-gray-900 border-2 border-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 hover:bg-transparent hover:text-gray-900 active:scale-95"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-6 mt-20">
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border transition-all ${currentPage === 1
                ? "border-gray-100 text-gray-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">
              Page <span className="text-gray-900">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full border transition-all ${currentPage === totalPages
                ? "border-gray-100 text-gray-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default AllProducts;
