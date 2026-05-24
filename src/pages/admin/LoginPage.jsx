import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pull 'user' state as well from the hook
    const { user, login } = useAuth(); 

    // --- THE FIX ---
    // If the user state successfully populates, immediately push them to the dashboard.
    // This perfectly prevents the race condition.
    if (user) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            console.log("1. Sending login request...");
            await login({ email, password });
            console.log("2. Login successful! State is updating...");
            // We removed navigate('/admin') from here! 
            // The 'if (user)' block above will handle it automatically.
        } catch (err) {
            console.error("LOGIN CRASHED:", err);
            
            if (err.response?.status === 419) {
                setError('CSRF Token Mismatch. Please refresh the page and try again.');
            } else if (err.response?.status === 404) {
                setError('API endpoint not found. Check your Laravel routes.');
            } else {
                setError(err.response?.data?.message || 'Invalid credentials or server error.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Admin Login
                    </h2>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}