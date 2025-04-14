import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  isTokenValid,
} from "../services/authServices";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const currentUser = getCurrentUser();

      if (currentUser && isTokenValid()) {
        setUser(currentUser);
      } else {
        logoutService();
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    setUser(data.user);

    // Redirect based on role
    if (data.user.role === "matron") {
      navigate("/matron/dashboard");
    } else {
      navigate("/tenant/dashboard");
    }

    return data;
  };

  const logout = () => {
    logoutService();
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isMatron: user?.role === "matron",
    isTenant: user?.role === "tenant",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
