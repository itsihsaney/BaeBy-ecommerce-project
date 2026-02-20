import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `http://localhost:5001/api/products?category=${category}&limit=1000`
          : "http://localhost:5001/api/products?limit=1000";

        const response = await axios.get(url);

        // Handle both old and new object structures
        let productData = [];
        if (response.data && Array.isArray(response.data.data)) {
          productData = response.data.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productData = response.data.products;
        } else if (Array.isArray(response.data)) {
          productData = response.data;
        }

        setProducts(productData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};

export default useProducts;
