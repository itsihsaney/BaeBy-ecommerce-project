import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://6931218d11a8738467cd5cde.mockapi.io/api/v1/products");
        const filtered = category
          ? response.data.filter((item) => item.category === category)
          : response.data;
        setProducts(filtered);
      } catch (err) {
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
