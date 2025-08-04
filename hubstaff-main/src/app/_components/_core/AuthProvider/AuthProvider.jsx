import React from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Helper to safely parse user from localStorage
  const getSafeUser = () => {
    let userObj = null;
    try {
      const userStr = localStorage.getItem("user");
      if (
        userStr &&
        userStr !== "undefined" &&
        userStr !== "null" &&
        userStr !== ""
      ) {
        userObj = JSON.parse(userStr);
      }
    } catch (e) {
      localStorage.removeItem("user");
      userObj = null;
    }
    return userObj;
  };

  // Check localStorage for token and user on mount
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setUser(getSafeUser());
    setLoading(false);
  }, []);

  // Login just sets isAuthenticated and user, since login form already stores them
  const login = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setUser(getSafeUser());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
