import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, login, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage onLogin={login} /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterPage onRegister={login} /> : <Navigate to="/" replace />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppRoutes logout={logout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
