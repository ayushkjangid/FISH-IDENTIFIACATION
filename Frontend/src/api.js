// src/api.js
import axiosInstance from "./api/axiosInstance";

export async function registerUser(data) {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
}

export async function loginUser(data) {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
}

// Auth API
export async function getMe() {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
}

export async function uploadAvatar(formData) {
  const res = await axiosInstance.post("/auth/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getUserPredictions() {
  const res = await axiosInstance.get("/predict/history");
  return res.data;
}

// Admin API
export async function getAdminStats() {
  const res = await axiosInstance.get("/admin/stats");
  return res.data;
}

export async function getAllUsers() {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
}

export async function deleteUser(id) {
  const res = await axiosInstance.delete(`/admin/users/${id}`);
  return res.data;
}

export async function updateUserRole(id, role) {
  const res = await axiosInstance.put(`/admin/users/${id}/role`, { role });
  return res.data;
}

export default axiosInstance;
