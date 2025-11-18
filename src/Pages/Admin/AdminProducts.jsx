import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Loader2, Edit3, Package } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read page from URL (default = 1)
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const itemsPerPage = 8;

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Clean Price
  const cleanPrice = (value) => {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/[^0-9.]/g, "")) || 0;
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5001/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  // Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const product = {
        id: Date.now().toString(),
        ...newProduct,
        price: cleanPrice(newProduct.price),
      };
      await axios.post("http://localhost:5001/products", product);
      toast.success("Product added");
      setShowAddModal(false);
      setNewProduct({ name: "", category: "", price: "", image: "" });
      fetchProducts();
    } catch {
      toast.error("Failed to add product");
    }
  };

  // Edit Product
  const openEditModal = (product) => {
    setEditProduct({ ...product, price: cleanPrice(product.price) });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editProduct.name || !editProduct.category || !editProduct.price) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5001/products/${editProduct.id}`,
        { ...editProduct, price: cleanPrice(editProduct.price) }
      );
      toast.success("Updated successfully");
      setShowEditModal(false);
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    }
  };

  // Pagination Logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Update page + URL
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-fuchsia-400">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        Loading Products...
      </div>
    );

  return (
    <div className="p-6 bg-[#111827] text-gray-100 min-h-screen relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Products Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 shadow-md transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Package size={50} className="text-fuchsia-500 mb-3" />
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#1F2937]/80 border border-fuchsia-700/20 rounded-2xl shadow-md hover:shadow-fuchsia-600/30 transition duration-300 overflow-hidden"
            >
              <img
                src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                <p className="text-fuchsia-300 font-semibold">${cleanPrice(product.price)}</p>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => openEditModal(product)}
                    className="bg-gradient-to-r from-blue-600 to-fuchsia-500 px-3 py-2 rounded text-white"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-gradient-to-r from-rose-600 to-pink-500 px-3 py-2 rounded text-white"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-8">

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-30"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-2 rounded-lg ${
              currentPage === i + 1 ? "bg-fuchsia-600" : "bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-30"
        >
          Next
        </button>

      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal title="Add New Product" onClose={() => setShowAddModal(false)} onSave={handleAddProduct}>
          <ProductForm product={newProduct} setProduct={setNewProduct} />
        </Modal>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <Modal title={`Edit Product`} onClose={() => setShowEditModal(false)} onSave={handleEditSave}>
          <ProductForm product={editProduct} setProduct={setEditProduct} isEdit />
        </Modal>
      )}
    </div>
  );
}

/* Product Form Component */
function ProductForm({ product, setProduct }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <Input label="Name" name="name" value={product.name} onChange={handleChange} />
      <Input label="Category" name="category" value={product.category} onChange={handleChange} />
      <Input label="Price ($)" name="price" type="number" value={product.price} onChange={handleChange} />
      <Input label="Image URL" name="image" value={product.image} onChange={handleChange} />
    </div>
  );
}

/* Input Component */
function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200"
      />
    </div>
  );
}

/* Modal Component */
function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1E1E2A] p-6 rounded-xl border border-fuchsia-700/30 w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400">✖</button>
        <h3 className="text-xl font-semibold text-fuchsia-300 mb-4">{title}</h3>
        {children}
        <button onClick={onSave} className="w-full mt-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 py-2 rounded text-white">
          Save
        </button>
      </div>
    </div>
  );
}
