import { useEffect, useState } from "react";

const parseToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, email: payload.email, role: payload.role, profile: payload.profile };
  } catch {
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

