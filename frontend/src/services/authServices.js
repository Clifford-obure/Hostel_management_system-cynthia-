/* eslint-disable no-unused-vars */
import api from "./api";
import { jwtDecode } from "jwt-decode";

// Register user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login user
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if token is valid
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get current user data from API
export const getUserProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
