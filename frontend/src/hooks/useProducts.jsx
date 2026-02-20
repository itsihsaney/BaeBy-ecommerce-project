import { useState, useEffect } from "react";
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

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sort) params.append("sort", sort);

        const url = `http://localhost:5001/api/products?${params.toString()}`;
        const response = await axios.get(url, { signal: controller.signal });

        if (response.data.success) {
          setData({
            products: response.data.data,
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages,
            totalProducts: response.data.totalProducts
          });
        }
      } catch (err) {
        if (axios.isCancel(err)) return; // Ignore cancelled requests
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [category, search, page, limit, minPrice, maxPrice, sort]);

  return { ...data, loading, error };
};

export default useProducts;
