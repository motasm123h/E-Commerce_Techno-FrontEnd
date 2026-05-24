import { useState } from 'react';
import { useCart } from '../../app/CartContext';
import { getImageUrl } from '../../services/api';

export default function ProductModal({ product, onClose }) {
    const { addToCart } = useCart();
    
    // Image Slider Track Index State Configuration
    const [activeImgIdx, setActiveImgIdx] = useState(0);

    const hasImages = product.images && product.images.length > 0;

    // Slide Controller Navigation Calculations
    const handlePrevSlide = () => {
        setActiveImgIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setActiveImgIdx((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100">
                
                {/* Global Absolute Close Button Action */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 p-2 rounded-full transition font-bold text-xs h-8 w-8 flex items-center justify-center cursor-pointer z-10"
                >
                    ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    
                    {/* LEFT COLUMN: INTERACTIVE SLIDER CAROUSEL TRACK */}
                    <div className="flex flex-col space-y-3">
                        <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center overflow-hidden border border-gray-100 relative group">
                            {hasImages ? (
                                <img 
                                    src={getImageUrl(product.images[activeImgIdx])} 
                                    alt={`${product.name}-${activeImgIdx}`} 
                                    className="w-full h-full object-cover select-none"
                                />
                            ) : (
                                <span className="text-gray-400 italic text-sm">No Images Cataloged</span>
                            )}

                            {/* Arrow Toggles (Rendered conditionally if multi-image array present) */}
                            {hasImages && product.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={handlePrevSlide}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md text-sm font-bold transition cursor-pointer"
                                    >
                                        ‹
                                    </button>
                                    <button 
                                        onClick={handleNextSlide}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md text-sm font-bold transition cursor-pointer"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Pagination Dot Array Track Indicators */}
                        {hasImages && product.images.length > 1 && (
                            <div className="flex justify-center items-center gap-1.5">
                                {product.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImgIdx(idx)}
                                        className={`h-2 rounded-full transition-all duration-200 ${idx === activeImgIdx ? 'w-5 bg-blue-600' : 'w-2 bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: CORE PRODUCT TRANSACTION CRITERIA */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
                                {product.category || 'Store Inventory'}
                            </span>
                            <h2 className="text-2xl font-extrabold text-gray-900 mt-2 mb-1 leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-xs font-mono text-gray-400 mb-4">Slug Tracker: {product.slug}</p>
                            
                            <div className="text-3xl font-black text-gray-900 mb-4">
                                ${Number(product.price).toFixed(2)}
                            </div>

                            <div className="mb-4 flex items-center space-x-2 text-sm">
                                <span className="font-medium text-gray-500">Inventory Status:</span>
                                <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `${product.stock} Units Available` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* COLORS LIST MATRIX MAPPED FROM BACKEND JSON ARRAY */}
                            {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                                <div className="mb-4">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Available Variations
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.colors.map((color, idx) => (
                                            <span key={idx} className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs font-semibold">
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => {
                                addToCart(product);
                                onClose();
                            }}
                            disabled={product.stock <= 0}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:shadow-none transition disabled:opacity-40 cursor-pointer text-sm tracking-wide"
                        >
                            Add to Shopping Cart
                        </button>
                    </div>
                </div>

                {/* BOTTOM REGION: SPECIFICATIONS MAP VIEW LOOP SPLITTING AT ':' MARK */}
                {product.details && Array.isArray(product.details) && product.details.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            Technical Specifications & Details
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2.5">
                            {product.details.map((item, index) => {
                                if (item.includes(':')) {
                                    const [title, value] = item.split(':');
                                    return (
                                        <p key={index} className="text-sm text-gray-600 flex items-baseline">
                                            {/* Key Context Segment: High Contrast Bold Color Styling */}
                                            <span className="font-bold text-gray-900 min-w-[110px] block flex-shrink-0">
                                                {title.trim()}:
                                            </span>
                                            {/* Value Context Segment: Lower Contrast Regular Weight Muted Color */}
                                            <span className="text-gray-600 font-normal pl-1">
                                                {value.trim()}
                                            </span>
                                        </p>
                                    );
                                }
                                
                                return (
                                    <p key={index} className="text-sm text-gray-600 leading-relaxed font-normal">
                                        {item}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}