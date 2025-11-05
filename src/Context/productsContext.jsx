import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [clothes, setClothes] = useState([]);
  const [toys, setToys] = useState([]);
  const [skinCare, setSkinCare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Active Category
  const [activeCategory, setActiveCategory] = useState("Clothes");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/products");
        setClothes(res.data.clothes || []);
        setToys(res.data.toys || []);
        setSkinCare(res.data.skinCare || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        clothes,
        toys,
        skinCare,
        loading,
        error,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
