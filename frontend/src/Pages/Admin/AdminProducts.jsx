import React, { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Edit2, Package, Search, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/adminApi";
import { convertToINR } from "../../utils/currency";

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
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 pb-20 text-gray-100">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Catalog Management
          </h1>
          <p className="text-gray-400">Add, edit, and organize your products.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Catalog..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#0f0f11] border border-white/[0.05] pl-10 pr-4 py-2.5 rounded-2xl text-gray-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm placeholder-gray-600 shadow-xl"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-2xl text-white text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
          >
            <Plus size={18} /> New Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-[#0f0f11] rounded-3xl border border-white/[0.05]">
          <Package size={50} className="text-gray-700 mb-4" />
          <p className="text-xl font-medium text-gray-400">
            {searchQuery ? "No products match your search." : "Your catalog is empty."}
          </p>
          {searchQuery && (
            <p className="text-sm mt-2">Try adjusting your search criteria</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => {
            const pid = product.id || product._id;
            return (
              <div
                key={pid}
                className="bg-[#0f0f11] border border-white/[0.05] rounded-3xl shadow-xl hover:shadow-violet-500/10 hover:border-violet-500/30 transition-all duration-300 overflow-hidden flex flex-col group relative"
              >
                {/* Glow Effect */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors pointer-events-none"></div>

                <div className="relative h-56 w-full bg-black/40 border-b border-white/[0.05] overflow-hidden">
                  <img
                    src={product.image || "https://placehold.co/400x300?text=No+Image"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x300?text=No+Image";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {product.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 relative z-10">
                  <h3 className="text-base font-bold text-white line-clamp-2 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-violet-400 mt-2">
                    {convertToINR(product.price || 0)}
                  </p>

                  <div className="flex gap-2 mt-auto pt-5">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/[0.05] px-3 py-2.5 rounded-xl text-gray-300 hover:text-white text-sm font-medium transition-all"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500/5 hover:bg-rose-500 border border-transparent hover:border-rose-500/20 px-3 py-2.5 rounded-xl text-rose-400 hover:text-white text-sm font-medium transition-all"
                    >
                      <Trash2 size={16} /> Delete
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-[#0f0f11] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={24} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">{productToDelete.title}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white py-3 rounded-xl transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                disabled={deleting}
                className="flex-1 flex justify-center items-center bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] text-sm disabled:opacity-60"
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#0f0f11] border border-white/[0.05] rounded-xl text-sm disabled:opacity-30 hover:bg-white/[0.05] transition-all font-medium"
          >
            Previous
          </button>
          <div className="flex gap-1.5 px-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm transition font-medium flex items-center justify-center ${currentPage === i + 1
                  ? "bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  : "bg-[#0f0f11] border border-white/[0.05] text-gray-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#0f0f11] border border-white/[0.05] rounded-xl text-sm disabled:opacity-30 hover:bg-white/[0.05] transition-all font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal title="Add New Product" icon={Plus} onClose={() => setShowAddModal(false)} onSave={handleAddProduct}>
          <ProductForm product={newProduct} setProduct={setNewProduct} />
        </Modal>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editProductData && (
        <Modal
          title={`Edit Product`}
          icon={Edit2}
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
      <div className="grid grid-cols-2 gap-4">
        <Input label="Category *" name="category" value={product.category || ""} onChange={handleChange} />
        <Input
          label="Price (USD) *"
          name="price"
          value={product.price || ""}
          onChange={handleChange}
          type="number"
        />
      </div>
      <div className="relative">
        <Input
          label="Image URL (optional)"
          name="image"
          value={product.image || ""}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
        <ImageIcon className="absolute right-4 top-9 text-gray-600 w-4 h-4 pointer-events-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Description (optional)</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
          rows="3"
          className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm placeholder-gray-600 resize-none custom-scrollbar"
        />
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm placeholder-gray-600"
      />
    </div>
  );
}

function Modal({ title, icon: Icon, onClose, onSave, children }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-[#0f0f11] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/20">
            <Icon size={18} />
          </div>
          {title}
        </h2>
        {children}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white py-3 rounded-xl transition-all font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
