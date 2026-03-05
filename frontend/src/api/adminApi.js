import api from "./axiosInstance";

// USERS
export const getUsers = () => api.get("/api/admin/users");

export const deleteUser = (id) =>
  api.delete(`/api/admin/users/${id}`);

export const updateUser = (id, data) =>
  api.patch(`/api/admin/users/${id}`, data);

// PRODUCTS
export const getProducts = () =>
  api.get("/api/admin/products");

export const createProduct = (data) =>
  api.post("/api/admin/products", data);

export const updateProduct = (id, data) =>
  api.put(`/api/admin/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/api/admin/products/${id}`);

// ORDERS
export const getOrders = () =>
  api.get("/api/admin/orders");

// STATS
export const getStats = () =>
  api.get("/api/admin/stats");