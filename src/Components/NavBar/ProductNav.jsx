import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaFilter, FaSort } from "react-icons/fa";

function ProductNav({ onSortChange, onFilterChange }) {
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const categories = [
    { name: "Clothes", path: "clothes" },
    { name: "Toys", path: "toys" },
    { name: "Skin Care", path: "skincare" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-20 z-40 border-t border-pink-100">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex justify-between items-center relative">
        {/* ---------------- SORT ---------------- */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSort(!showSort);
              setShowFilter(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 border border-pink-200 rounded-md text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
          >
            <FaSort />
            <span className="text-sm font-medium">Sort</span>
          </button>

          {showSort && (
            <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg border border-pink-100 w-48 z-50">
              <ul className="text-sm text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-gray-500 font-medium border-b"
                  onClick={() => onSortChange?.("default")}
                >
                   Default Sort
                </li>
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                  onClick={() => onSortChange?.("lowToHigh")}
                >
                  Price: Low → High
                </li>
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                  onClick={() => onSortChange?.("highToLow")}
                >
                  Price: High → Low
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* ---------------- CATEGORIES ---------------- */}
        <ul className="flex justify-center flex-wrap gap-6 font-medium text-gray-600">
          {categories.map((cat) => (
            <li key={cat.path}>
              <NavLink
                to={cat.path}
                className={({ isActive }) =>
                  `transition-all duration-200 pb-1 ${
                    isActive
                      ? "text-pink-600 border-b-2 border-pink-500"
                      : "hover:text-pink-500"
                  }`
                }
              >
                {cat.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ---------------- FILTER ---------------- */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFilter(!showFilter);
              setShowSort(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 border border-pink-200 rounded-md text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200"
          >
            <FaFilter />
            <span className="text-sm font-medium">Filter</span>
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border border-pink-100 w-48 z-50">
              <ul className="text-sm text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-gray-500 font-medium border-b"
                  onClick={() => onFilterChange?.("default")}
                >
                  Clear Filter
                </li>
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                  onClick={() => onFilterChange?.("under20")}
                >
                  Under $20
                </li>
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                  onClick={() => onFilterChange?.("20to40")}
                >
                  $20 - $40
                </li>
                <li
                  className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                  onClick={() => onFilterChange?.("above40")}
                >
                  Above $40
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default ProductNav;
