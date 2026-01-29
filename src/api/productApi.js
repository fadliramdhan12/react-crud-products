import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: { "Content-Type": "application/json" },
});

export const getProducts = () => api.get("/products");
export const addProduct = (data) => api.post("/products/add", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getCategories = () => api.get("/products/categories");
