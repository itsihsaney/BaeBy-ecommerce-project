import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ProductNav from "../../Components/NavBar/ProductNav";

function Products() {
  const [sortType, setSortType] = useState(null);
  const [filterType, setFilterType] = useState(null);

  return (
    <div className="min-h-screen bg-pink-50">
      <ProductNav
        onSortChange={(type) => setSortType(type)}
        onFilterChange={(filter) => setFilterType(filter)}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <Outlet context={{ sortType, filterType }} />
      </main>
    </div>
  );
}

export default Products;

