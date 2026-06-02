// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../../app/AuthContext';

// export default function ProtectedRoute() {
//     const { user, loading } = useAuth();

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     // If no user is logged in, redirect to the admin login page
//     if (!user) {
//         return <Navigate to="/admin/login" replace />;
//     }

//     // If logged in, render the child routes
//     return <Outlet />;
// }


import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext'; 

export default function ProtectedRoute() {
    const { user, loading, checkAdminSession } = useAuth();
    const [isVerified, setIsVerified] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verifyAdmin = async () => {
            // تطلق الـ API فقط وحصرياً هنا عند الدخول لمسار محمي
            const isValid = await checkAdminSession();
            setIsVerified(isValid);
            setChecking(false);
        };

        verifyAdmin();
    }, []);

    if (checking || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs font-black uppercase tracking-widest text-[#00cc88] animate-pulse">
                Verifying secure security matrices...
            </div>
        );
    }

    return isVerified ? <Outlet /> : <Navigate to="/admin/login" replace />;
}