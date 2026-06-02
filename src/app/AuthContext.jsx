// import { createContext, useContext, useState, useEffect } from 'react';
// import { getUser, login as apiLogin } from '../services/authService';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const checkUserSession = async () => {
//             const token = localStorage.getItem('eco_admin_token');
            
//             if (!token) {
//                 setUser(null);
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const userData = await getUser();
//                 setUser(userData);
//             } catch (error) {
//                 localStorage.removeItem('eco_admin_token');
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkUserSession();
//     }, []);

//     const login = async (credentials) => {
//         const data = await apiLogin(credentials);
        
//         localStorage.setItem('eco_admin_token', data.token);
//         setUser(data.user);
//     };

//     const logout = () => {
//         localStorage.removeItem('eco_admin_token');
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// }



import { createContext, useContext, useState } from 'react';
import { getUser, login as apiLogin } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // ⚡ تعديل 1: الـ loading يبدأ false لكي لا يتجمد الفرونت إند العام للمستخدمين ⚡
    const [loading, setLoading] = useState(false);

    const checkAdminSession = async () => {
        const token = localStorage.getItem('eco_admin_token');
        
        if (!token) {
            setUser(null);
            return false;
        }

        try {
            setLoading(true);
            const userData = await getUser();
            setUser(userData);
            return true;
        } catch (error) {
            localStorage.removeItem('eco_admin_token');
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const data = await apiLogin(credentials);
        localStorage.setItem('eco_admin_token', data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('eco_admin_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAdminSession }}>
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