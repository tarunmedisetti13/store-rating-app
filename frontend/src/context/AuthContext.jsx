import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    const location = useLocation();

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    const redirectBasedOnRole = (userRole) => {
        const currentPath = location.pathname;

        // Don't redirect if already on correct dashboard
        if (userRole === 'admin' && currentPath.includes('/admin/')) return;
        if (userRole === 'store_owner' && currentPath.includes('/store_owner/')) return;
        if (userRole === 'user' && currentPath.includes('/user/')) return;

        // Redirect to appropriate dashboard
        if (userRole === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (userRole === 'store_owner') navigate('/store/dashboard', { replace: true });
        else navigate('/user/dashboard', { replace: true });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && !isTokenExpired(token)) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);

                // Only redirect if on login/signup pages or root
                const publicPaths = ['/', '/login', '/signup'];
                if (publicPaths.includes(location.pathname)) {
                    redirectBasedOnRole(decoded.role);
                }
            } catch (err) {
                console.error("Token decode error", err);
                logout();
            }
        } else if (token) {
            // Token exists but is expired
            logout();
        }

        setLoading(false);
    }, [location.pathname]);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        redirectBasedOnRole(decoded.role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login', { replace: true });
    };

    // Show loading spinner while checking authentication
    if (loading) {
        return <div>Loading...</div>; // Replace with your loading component
    }

    return (
        <AuthContext.Provider value={{ login, logout, user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);