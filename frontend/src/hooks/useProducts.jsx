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
          ? `http://localhost:5001/api/products?category=${category}`
          : "http://localhost:5001/api/products";

        const response = await axios.get(url);

        // Handle both old array structure (if any) and new object structure
        const productData = response.data.products || response.data;

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
