import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("savitram_token");
    const savedUser = localStorage.getItem("savitram_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      authService.getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem("savitram_token", token);
    localStorage.setItem("savitram_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const { token, user } = res.data;
    localStorage.setItem("savitram_token", token);
    localStorage.setItem("savitram_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("savitram_token");
    localStorage.removeItem("savitram_user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("savitram_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
