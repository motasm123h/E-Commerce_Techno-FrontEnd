import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../app/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    
    const { cart } = useCart(); 
    const totalItems = cart.reduce((total, item) => total + item.cartQuantity, 0);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            EcoStore
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">Products</Link>
                        <Link to="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                            Cart ({totalItems})
                        </Link>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-gray-50 border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Products</Link>
                        <Link to="/cart" className="block px-3 py-2 text-blue-600 font-bold">
                            Cart ({totalItems})
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}