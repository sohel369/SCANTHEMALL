import { useEffect, useState } from "react";

const parseToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Check if token has expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      return null;
    }
    return { id: payload.id, email: payload.email, role: payload.role, profile: payload.profile };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export function useAuth() {
  const [user, setUser] = useState(() => parseToken(localStorage.getItem("token")));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(parseToken(token));
  }, []);

  const login = (token, userData) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setUser(userData || parseToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, logout };
}

