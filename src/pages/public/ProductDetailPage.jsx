import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import api, { getImageUrl } from '../../services/api';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const location = useLocation();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const productId = location.state?.productId || slug;

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                setLoading(true);

                if (!productId) {
                    setError('Direct navigation mismatch. Resource ID is required.');
                    setLoading(false);
                    return;
                }

                const response = await api.get(`/public/product/${productId}`);
                const productData = response.data.data ? response.data.data : response.data;
                
                if (productData) {
                    setProduct(productData);
                    setError(null);
                    setActiveImgIdx(0);
                } else {
                    setError('The requested product was not found in our catalog entries.');
                }
            } catch (err) {
                setError('Failed to download dynamic record details from server.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductById();
    }, [productId, slug]); 

    // الحل الجذري لمشكلة الكمية
    const handleAddToCart = () => {
        if (product.stock > 0) {
            // نقوم بدمج الكمية المطلوبة داخل كائن المنتج لتصل إلى السلة بشكل صحيح
            const productWithQuantity = { ...product, cartQuantity: quantity };
            
            // إذا كان الـ Context لديك يدعم البارامتر الثاني استخدم: addToCart(product, quantity)
            // أما إذا كان يستقبل كائناً واحداً، فالسطر التالي سيفي بالغرض تماماً:
            addToCart(productWithQuantity, quantity); 
        }
    };

    if (loading) return <div className="text-center py-32 text-[#777777] font-medium animate-pulse font-sans">Loading product...</div>;
    if (error) return <div className="max-w-xl mx-auto my-12 bg-red-50 text-red-600 p-6 border border-red-100 text-center font-medium font-sans">{error}</div>;
    if (!product) return null;

    const hasImages = product.images && product.images.length > 0;

    return (
        <div className="w-full bg-white min-h-screen font-sans antialiased">
            <div className="max-w-6xl mx-auto px-6 py-12">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    
                    {/* ========== LEFT SIDE: IMAGES ========== */}
                    <div className="flex flex-col gap-4">
                        <div className="border border-[#eaeaec] p-8 flex items-center justify-center h-[500px] relative">
                            {hasImages ? (
                                <img 
                                    src={getImageUrl(product.images[activeImgIdx])} 
                                    alt={product.name} 
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <span className="text-[#777777] text-sm">No Image Available</span>
                            )}
                            <div className="absolute bottom-4 left-4 bg-white border border-[#eaeaec] rounded-full p-2 text-[#777777] cursor-pointer shadow-sm hover:text-[#333333] transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                            </div>
                        </div>

                        {hasImages && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImgIdx(idx)}
                                        className={`w-20 h-20 border p-2 flex-shrink-0 transition-colors ${idx === activeImgIdx ? 'border-[#a3a3a3]' : 'border-[#eaeaec] hover:border-[#cccccc]'}`}
                                    >
                                        <img src={getImageUrl(img)} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ========== RIGHT SIDE: DETAILS ========== */}
                    <div className="flex flex-col">
                        
                        {/* Breadcrumbs - ألوان مطابقة للصورة */}
                        <div className="text-[11px] font-normal text-[#777777] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Link to="/" className="hover:text-[#333333] transition">HOME</Link>
                            <span>/</span>
                            <span>{product.category || 'COMPUTER CASES'}</span>
                        </div>

                        {/* Title - رمادي غامق وليس أسود فاحم */}
                        <h1 className="text-[26px] font-semibold text-[#333333] mb-4 leading-snug">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="text-[24px] font-semibold text-[#333333] mb-6">
                            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            {/* Quantity Selector - حدود ناعمة ومقاسات مطابقة */}
                            <div className="flex items-center border border-[#eaeaec] h-[40px] bg-white">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-3 text-[#777777] hover:text-[#333333] font-medium transition"
                                >
                                    -
                                </button>
                                <div className="px-4 border-l border-r border-[#eaeaec] text-[13px] text-[#333333] font-medium h-full flex items-center justify-center min-w-[3rem]">
                                    {quantity}
                                </div>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-3 text-[#777777] hover:text-[#333333] font-medium transition"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="bg-[#c62934] hover:bg-[#a84d2d] text-white text-[13px] font-bold uppercase tracking-wider h-[40px] px-8 transition-colors disabled:bg-[#eaeaec] disabled:text-[#777777] disabled:cursor-not-allowed"
                            >
                                {product.stock <= 0 ? 'SOLD OUT' : 'ADD TO CART'}
                            </button>
                        </div>

                        {/* Divider */}
                        <hr className="border-[#eaeaec] mb-6" />

                        {/* Meta Data - خطوط خفيفة ورمادية */}
                        <div className="space-y-2 text-[13px] text-[#777777]">
                            <p>
                                SKU: <span className="text-[#333333]">{product.slug || product.id}</span>
                            </p>
                            <p>
                                Category: <span className="text-[#333333] hover:text-[#c25934] cursor-pointer transition">{product.category || 'Computer Cases'}</span>
                            </p>
                            <p>
                                Tags: <span className="text-[#333333] hover:text-[#c25934] cursor-pointer transition">{product.brand?.name || 'Cases'}, Main</span>
                            </p>
                        </div>

                        {/* Social Share Icons */}
                        <div className="flex gap-1.5 mt-8">
                            {['f', 't', '✉', 'p', 'in', 't'].map((icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full border border-[#eaeaec] flex items-center justify-center text-[#777777] hover:border-[#333333] hover:text-[#333333] transition text-xs font-bold">
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ========== BOTTOM SIDE: TABS & DESCRIPTION ========== */}
                <div className="mt-20 border-t border-[#eaeaec] pt-8">
                    
                    {/* Tabs Header */}
                    <div className="flex gap-8 border-b border-[#eaeaec] mb-8">
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`pb-3 text-[13px] font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'description' ? 'text-[#333333]' : 'text-[#777777] hover:text-[#333333]'}`}
                        >
                            Description
                            {activeTab === 'description' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#333333]"></span>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('additional')}
                            className={`pb-3 text-[13px] font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'additional' ? 'text-[#333333]' : 'text-[#777777] hover:text-[#333333]'}`}
                        >
                            Additional Information
                            {activeTab === 'additional' && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#333333]"></span>}
                        </button>
                    </div>

                    <div className="text-[#777777] text-[14px] leading-[1.8] max-w-5xl space-y-6">
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <p className="text-[#333333] font-semibold">{product.name}</p>
                                
                                {product.details && product.details.map((item, index) => {
                                    if (item.includes(':')) {
                                        const parts = item.split(':');
                                        return (
                                            <p key={index} className="whitespace-pre-line">
                                                <span className="text-[#333333] font-semibold">{parts[0]}:</span>
                                                {parts.slice(1).join(':')}
                                            </p>
                                        );
                                    }
                                    return <p key={index} className="whitespace-pre-line">{item}</p>;
                                })}
                            </div>
                        )}
                        
                        {activeTab === 'additional' && (
                            <div className="space-y-2">
                                <p><span className="text-[#333333] font-semibold">Stock Status:</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                                <p><span className="text-[#333333] font-semibold">Brand:</span> {product.brand?.name || 'N/A'}</p>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
}