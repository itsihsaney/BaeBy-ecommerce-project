import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    axios
      .get("http://localhost:5001/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/products/${id}`);
      toast.success("Product deleted");
      fetchProducts(); // refresh list
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-2 capitalize">{product.category}</p>
              <p className="font-bold text-pink-600 mb-3">₹{product.price}</p>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
