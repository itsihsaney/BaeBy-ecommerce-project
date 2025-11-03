import React, { useState, useContext } from "react";
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import { BiSolidLogInCircle } from "react-icons/bi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart(); // use updated CartContext (cart not cartItems)
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  // 🛒 Total cart items
  const itemCount = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  //  Total wishlist items
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-pink-100/70 to-white/50 shadow-md sticky top-0 z-50 border-b border-pink-200/40">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
        {/*  Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/BaeBy Official Logo.png"
            alt="BaeBy Logo"
            className="h-16 w-auto object-contain drop-shadow-[0_0_10px_#ffb6c1]"
          />
        </Link>

        {/*  Navbar Links (Desktop) */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {["Home", "Products", "Gen Z Picks"].map((item) => {
            const path =
              item === "Home"
                ? "/"
                : `/${item.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <li key={item}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `transition-all duration-200 relative ${
                      isActive
                        ? "text-pink-500 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-pink-500"
                        : "hover:text-pink-500"
                    }`
                  }
                >
                  {item}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* 🌈Right Side Icons */}
        <div className="flex items-center gap-5">
          {/*  Wishlist Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart className="text-2xl text-gray-700 hover:text-pink-500 transition-all" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* 🛒 Cart Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-pink-500 transition-all" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ">
                {itemCount}
              </span>
            )}
          </div>

          {/*  User / Login */}
          <Link to="/orders" className="hover:text-pink-600">My Orders</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <FaUser className="text-2xl text-pink-500 drop-shadow-[0_0_8px_#ffb6c1]" />
              <span className="text-gray-700 font-medium">
                Hi,{" "}
                <span className="text-pink-500 font-semibold">
                  {user.name}
                </span>
              </span>
              <button
                onClick={logout}
                className="ml-2 px-4 py-1.5 rounded-full bg-pink-500 text-white shadow-[0_0_8px_#ffb6c1] hover:shadow-[0_0_14px_#ff80ab] transition-all duration-300"
              >
                Logout
              </button>
              
            </div>
          ) : (
            <>
              <Link to="/">
                <FaUser className="text-2xl text-gray-700 hover:text-pink-500 transition-all" />
              </Link>
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-500 text-white font-medium shadow-[0_0_8px_#ffb6c1] hover:shadow-[0_0_14px_#ff80ab] hover:bg-pink-700 transition-all duration-300"
              >
                <BiSolidLogInCircle size={18} />
                Login
              </Link>
            </>
          )}

          {/*  Hamburger (Mobile) */}
          <button
            className="md:hidden text-3xl text-pink-500"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-pink-50/70 border-t border-pink-100 backdrop-blur-sm">
          <ul className="flex flex-col items-center py-4 space-y-4 font-medium text-gray-700">
            {["Home", "Products", "Gen Z Picks"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-pink-500 transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-1 bg-pink-500 text-white px-4 py-1.5 rounded-full font-medium shadow-[0_0_8px_#ffb6c1] hover:shadow-[0_0_14px_#ff80ab] transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1 bg-pink-500 text-white px-4 py-1.5 rounded-full font-medium shadow-[0_0_8px_#ffb6c1] hover:shadow-[0_0_14px_#ff80ab] transition-all"
              >
                <BiSolidLogInCircle size={18} />
                Login
              </Link>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
