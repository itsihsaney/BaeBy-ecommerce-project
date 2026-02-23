import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useProducts = ({ category, search, page = 1, limit = 10, minPrice, maxPrice, sort } = {}) => {
  const [data, setData] = useState({
    products: [],
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (minPrice !== undefined) params.append("minPrice", minPrice);
      if (maxPrice !== undefined) params.append("maxPrice", maxPrice);
      if (sort) params.append("sort", sort);

      const url = `http://localhost:5001/api/products?${params.toString()}`;
      const response = await axios.get(url, { signal });

      if (response.data.success) {
        setData({
          products: response.data.data,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalProducts: response.data.totalProducts
        });
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [category, search, page, limit, minPrice, maxPrice, sort]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  return { ...data, loading, error };
};

export default useProducts;
