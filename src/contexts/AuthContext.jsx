import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(true);

  // Check for existing token and validate it on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      
      if (storedToken) {
        try {
          // Set the token in the API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Try to verify the token by making any authenticated request
          // You can replace this with any endpoint that requires authentication
          const response = await api.get("/orders?page=1&per_page=1");
          
          // If the request succeeds, we assume the user is still logged in
          // You might want to store user data from the login response in localStorage too
          const userData = JSON.parse(localStorage.getItem("user_data") || "null");
          if (userData) {
            setUser(userData);
          } else {
            // Create a basic user object if no user data is stored
            setUser({ authenticated: true });
          }
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, remove it
          console.error("Token validation failed:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          delete api.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    const data = res.data;
    
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_data", JSON.stringify(data.user));
    
    // Set the token in API headers for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    delete api.defaults.headers.common['Authorization'];
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}