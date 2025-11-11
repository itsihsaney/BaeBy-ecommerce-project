import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import ProductNav from "../../Components/NavBar/ProductNav";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortType, setSortType] = useState(searchParams.get("sort") || null);
  const [filterType, setFilterType] = useState(searchParams.get("filter") || null);

  // 🔹 Handle sort change (includes reset option)
  const handleSortChange = (type) => {
    if (type === "default") {
      setSortType(null);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("sort");
        if (filterType) params.set("filter", filterType);
        else params.delete("filter");
        return params;
      });
      return;
    }

    setSortType(type);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("sort", type);
      if (filterType) params.set("filter", filterType);
      return params;
    });
  };

  // 🔹 Handle filter change (includes reset option)
  const handleFilterChange = (filter) => {
    if (filter === "default") {
      setFilterType(null);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("filter");
        if (sortType) params.set("sort", sortType);
        else params.delete("sort");
        return params;
      });
      return;
    }

    setFilterType(filter);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("filter", filter);
      if (sortType) params.set("sort", sortType);
      return params;
    });
  };

  // 🔹 Restore from URL after refresh
  useEffect(() => {
    const savedSort = searchParams.get("sort");
    const savedFilter = searchParams.get("filter");
    setSortType(savedSort || null);
    setFilterType(savedFilter || null);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-pink-50">
      <ProductNav
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <Outlet context={{ sortType, filterType }} />
      </main>
    </div>
  );
}

export default Products;
