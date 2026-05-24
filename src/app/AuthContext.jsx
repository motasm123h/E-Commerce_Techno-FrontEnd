import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, login as apiLogin } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // PERSIST LOGGED IN STATE ON REFRESH
    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem('eco_admin_token');
            
            // If no token exists in local storage, don't even ping the server
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                // If token is invalid or expired, clear it out safely
                localStorage.removeItem('eco_admin_token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();
    }, []);

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        
        // Save token to browser memory safely surviving tab closures or refreshes
        localStorage.setItem('eco_admin_token', data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('eco_admin_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}