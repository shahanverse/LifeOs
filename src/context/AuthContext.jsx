import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const session = localStorage.getItem("lifeos_session");
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  const login = (userData) => {
    localStorage.setItem("lifeos_session", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("lifeos_session");
    setUser(null);
  };

  // 🔥 THIS IS THE MISSING PIECE
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev,
        ...updates,
      };

      localStorage.setItem("lifeos_session", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
