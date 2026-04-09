import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdvertiserRoutes from "./routes/AdvertiserRoutes";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, login, logout } = useAuth();

  console.log('App component - Current user:', user);

  const handleAuthSuccess = (response) => {
    console.log('Auth success response:', response);
    if (response?.token) {
      login(response.token, response.user);
    }
  };

  const isAdvertiser =
    user?.role === "advertiser" || user?.role === "ancillary_advertiser";
  
  console.log('Is advertiser:', isAdvertiser);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleAuthSuccess} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onRegistered={handleAuthSuccess} />}
        />
        <Route
          path="/advertiser/*"
          element={
            isAdvertiser ? (
              <AdvertiserRoutes user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAdvertiser ? "/advertiser" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
