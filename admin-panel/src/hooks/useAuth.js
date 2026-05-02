import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem("token");
    
    const getUserFromToken = () => {
        const token = getToken();
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // Check if token is expired
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                localStorage.removeItem("token");
                return null;
            }

            return { id: payload.id, email: payload.email || payload.id, role: payload.role || "admin" };
        } catch {
            return null;
        }
    };

    const [user, setUser] = useState(() => getUserFromToken());

    useEffect(() => {
        const token = getToken();
        if (token) {
            const userData = getUserFromToken();
            setUser(userData);
        } else {
            setUser(null);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return { user, login, logout };
}
