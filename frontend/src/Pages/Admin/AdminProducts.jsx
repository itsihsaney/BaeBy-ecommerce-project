import React, { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Edit3, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/adminApi";

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [editProductData, setEditProductData] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 8;

  /* ─── Fetch Products ─── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      // Backend: { status: "success", data: [ ...products ] }
      setProducts(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  /* ─── Delete Product ─── */
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    const pid = productToDelete.id || productToDelete._id;
    try {
      // DELETE /api/admin/products/:id
      await deleteProduct(pid);
      setProducts((prev) =>
        prev.filter((p) => (p.id || p._id) !== pid)
      );
      toast.success("Product deleted successfully");
      setProductToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Add Product ─── */
  const handleAddProduct = async () => {
    const { title, category, price } = newProduct;
    if (!title || !category || !price) {
      toast.error("Title, category and price are required");
      return;
    }

    try {
      // POST /api/admin/products
      // Backend schema: { title, description, image, price, category }
      const payload = {
        title: newProduct.title,
        description: newProduct.description || "",
        image: newProduct.image || "https://placehold.co/400x400?text=No+Image",
        price: parseFloat(newProduct.price),
        category: newProduct.category,
      };

      const res = await createProduct(payload);
      const created = res.data?.data;
      setProducts((prev) => [created, ...prev]);
      toast.success("Product added successfully");
      setShowAddModal(false);
      setNewProduct({ title: "", category: "", price: "", image: "", description: "" });
    } catch (err) {
      // Show Joi validation errors clearly
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add product";
      toast.error(msg);
    }
  };

  /* ─── Edit Product ─── */
  const openEditModal = (product) => {
    setEditProductData({ ...product, price: parseFloat(product.price) || 0 });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    const { title, category, price } = editProductData;
    if (!title || !category || !price) {
      toast.error("Title, category and price are required");
      return;
    }

    const pid = editProductData.id || editProductData._id;

    try {
      // PUT /api/admin/products/:id
      const payload = {
        title: editProductData.title,
        description: editProductData.description || "",
        image: editProductData.image || "https://placehold.co/400x400?text=No+Image",
        price: parseFloat(editProductData.price),
        category: editProductData.category,
      };

      const res = await updateProduct(pid, payload);
      const updated = res.data?.data || { ...editProductData, ...payload };

      setProducts((prev) =>
        prev.map((p) => ((p.id || p._id) === pid ? updated : p))
      );
      toast.success("Product updated successfully");
      setShowEditModal(false);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update product";
      toast.error(msg);
    }
  };

  /* ─── Search + Pagination ─── */
  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-fuchsia-400">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        Loading Products...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#111827] text-gray-100 min-h-screen relative">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Products Management
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1F2937] border border-fuchsia-700/40 px-4 py-2 rounded-lg text-gray-200 w-60 focus:outline-none focus:border-fuchsia-500 text-sm"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 shadow-md transition"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Package size={50} className="text-fuchsia-500 mb-3" />
          <p className="text-lg">
            {searchQuery ? "No products match your search." : "No products found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => {
            const pid = product.id || product._id;
            return (
              <div
                key={pid}
                className="bg-[#1F2937]/80 border border-fuchsia-700/20 rounded-2xl shadow-md hover:shadow-fuchsia-600/20 transition duration-300 overflow-hidden"
              >
                <img
                  src={product.image || "https://placehold.co/400x300?text=No+Image"}
                  alt={product.title}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />

                <div className="p-4">
                  <h3 className="text-md font-semibold text-white truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {product.category}
                  </p>
                  <p className="text-fuchsia-300 font-semibold mt-1">
                    ₹{parseFloat(product.price || 0).toFixed(2)}
                  </p>

                  <div className="flex justify-between mt-3 gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-600/80 hover:bg-blue-500 px-3 py-2 rounded text-white text-xs transition"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-rose-600/80 hover:bg-rose-500 px-3 py-2 rounded text-white text-xs transition"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E2A] p-6 rounded-2xl shadow-lg border border-fuchsia-700/40 w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-fuchsia-300">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6 text-sm">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                {productToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-gray-600/40 rounded-md text-gray-300 hover:bg-gray-600/60 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                disabled={deleting}
                className="bg-gradient-to-r from-fuchsia-600 to-pink-500 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition disabled:opacity-60 text-sm"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600 transition"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-2 rounded-lg text-sm transition ${currentPage === i + 1 ? "bg-fuchsia-600 text-white" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-700 rounded-lg text-sm disabled:opacity-30 hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal title="Add New Product" onClose={() => setShowAddModal(false)} onSave={handleAddProduct}>
          <ProductForm product={newProduct} setProduct={setNewProduct} />
        </Modal>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editProductData && (
        <Modal
          title={`Edit: ${editProductData.title || "Product"}`}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        >
          <ProductForm product={editProductData} setProduct={setEditProductData} isEdit />
        </Modal>
      )}
    </div>
  );
}

/* ─── Product Form ─── */
function ProductForm({ product, setProduct }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <Input label="Title *" name="title" value={product.title || ""} onChange={handleChange} />
      <Input label="Category *" name="category" value={product.category || ""} onChange={handleChange} />
      <Input
        label="Price ($) *"
        name="price"
        value={product.price || ""}
        onChange={handleChange}
        type="number"
      />
      <Input
        label="Image URL (optional)"
        name="image"
        value={product.image || ""}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />
      <Input
        label="Description (optional)"
        name="description"
        value={product.description || ""}
        onChange={handleChange}
      />
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        className="w-full bg-[#2C2F3C] border border-fuchsia-700/30 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:border-fuchsia-500 transition text-sm"
      />
    </div>
  );
}

function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E2A] p-6 rounded-xl border border-fuchsia-700/30 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-fuchsia-400 transition text-lg"
        >
          ✖
        </button>
        <h3 className="text-xl font-semibold text-fuchsia-300 mb-4">{title}</h3>
        {children}
        <button
          onClick={onSave}
          className="w-full mt-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
