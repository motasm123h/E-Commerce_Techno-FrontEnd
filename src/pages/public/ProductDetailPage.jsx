// // import { useState, useEffect } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import { useCart } from '../../app/CartContext';
// // import api, { getImageUrl } from '../../services/api';

// // export default function ProductDetailPage() {
// //     const { slug } = useParams(); 
// //     const { addToCart, cart } = useCart();

// //     const [product, setProduct] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [activeImgIdx, setActiveImgIdx] = useState(0);
    
// //     const [quantity, setQuantity] = useState(1);
// //     const [activeTab, setActiveTab] = useState('description');

// //     useEffect(() => {
// //         const fetchProductBySlug = async () => {
// //             try {
// //                 setLoading(true);
// //                 if (!slug) {
// //                     setError('Direct navigation mismatch. Resource URL slug is required.');
// //                     setLoading(false);
// //                     return;
// //                 }
// //                 const response = await api.get(`/public/product/${slug}`);
// //                 const productData = response.data.data ? response.data.data : response.data;
                
// //                 if (productData) {
// //                     setProduct(productData);
// //                     setError(null);
// //                     setActiveImgIdx(0);
// //                 } else {
// //                     setError('The requested product was not found in our catalog entries.');
// //                 }
// //             } catch (err) {
// //                 setError('Failed to download dynamic record details from server.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };
// //         fetchProductBySlug();
// //     }, [slug]); 

// //     if (loading) return <div className="text-center py-32 text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse font-sans">Loading product matrix...</div>;
// //     if (error) return <div className="max-w-xl mx-auto my-12 bg-rose-50 text-rose-600 p-4 border border-rose-100 text-center font-bold text-xs rounded-xl font-sans">{error}</div>;
// //     if (!product) return null;

// //     const currentCartItem = cart ? cart.find(item => item.id === product.id) : null;
// //     const currentCartQty = currentCartItem ? (currentCartItem.cartQuantity || currentCartItem.quantity || 0) : 0;

// //     const isLimitExceeded = (currentCartQty + quantity) > product.stock;
// //     const isSoldOut = product.stock <= 0;

// //     const handleAddToCart = () => {
// //         if (!isSoldOut && !isLimitExceeded) {
// //             const productWithQuantity = { ...product, cartQuantity: quantity };
// //             addToCart(productWithQuantity, quantity); 
// //         }
// //     };

// //     const hasImages = product.images && product.images.length > 0;

// //     return (
// //         <div className="w-full bg-white min-h-screen font-sans antialiased">
// //             <div className="max-w-6xl mx-auto px-6 py-12">
                
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    
// //                     {/* ========== LEFT SIDE: IMAGES ========== */}
// //                     <div className="flex flex-col gap-4">
// //                         <div className="border border-slate-100 p-8 flex items-center justify-center h-[480px] relative rounded-2xl bg-white">
// //                             {hasImages ? (
// //                                 <img 
// //                                     src={getImageUrl(product.images[activeImgIdx])} 
// //                                     alt={product.name} 
// //                                     className="max-w-full max-h-full object-contain mix-blend-multiply"
// //                                 />
// //                             ) : (
// //                                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">No Image Available</span>
// //                             )}
// //                         </div>

// //                         {hasImages && product.images.length > 1 && (
// //                             <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
// //                                 {product.images.map((img, idx) => (
// //                                     <button
// //                                         key={idx}
// //                                         onClick={() => setActiveImgIdx(idx)}
// //                                         className={`w-16 h-16 border p-1 rounded-xl transition-all flex-shrink-0 bg-white flex items-center justify-center ${idx === activeImgIdx ? 'border-slate-800 ring-1 ring-slate-800' : 'border-slate-100 hover:border-slate-300'}`}
// //                                     >
// //                                         <img src={getImageUrl(img)} alt={`thumb-${idx}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
// //                                     </button>
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* ========== RIGHT SIDE: DETAILS ========== */}
// //                     <div className="flex flex-col pt-2">
// //                         {/* تعديل مسار الملاحة الفرعي ليتناسب مع الهوية */}
// //                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
// //                             <Link to="/" className="hover:text-[#00cc88] transition-colors">HOME</Link>
// //                             <span className="text-slate-200">/</span>
// //                             <span>{product.category || 'COMPUTER COMPONENTS'}</span>
// //                         </div>

// //                         {/* خط عنوان المنتج المحدث ليكون عريضاً وفخماً */}
// //                         <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-snug">
// //                             {product.name}
// //                         </h1>

// //                         {/* رقم السعر أصبح بارزاً وواضحاً بالخط المونو كالمواقع العالمية */}
// //                         <div className="text-2xl font-black text-slate-900 mb-6 font-mono">
// //                             ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
// //                         </div>

// //                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
// //                             Available Stock: <span className="text-slate-800 font-black bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md ml-1">{product.stock} units</span>
// //                             {currentCartQty > 0 && <span className="text-[#00cc88] block mt-2 font-bold lowercase tracking-normal">({currentCartQty} units already locked in your cart)</span>}
// //                         </div>

// //                         <div className="flex flex-wrap items-center gap-4 mb-8 pt-2">
// //                             {/* عداد حقل الكمية الرقمي مع زوايا ناعمة حديثة */}
// //                             <div className="flex items-center border border-slate-200 h-[40px] bg-slate-50/50 rounded-xl select-none overflow-hidden">
// //                                 <button 
// //                                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
// //                                     disabled={quantity <= 1}
// //                                     className="px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-black h-full transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
// //                                 >
// //                                     -
// //                                 </button>
// //                                 <div className="px-4 border-l border-r border-slate-100 text-xs font-mono font-black text-slate-800 h-full flex items-center justify-center min-w-[2.5rem] bg-white">
// //                                     {quantity}
// //                                 </div>
// //                                 <button 
// //                                     onClick={() => setQuantity(q => q + 1)}
// //                                     disabled={(currentCartQty + quantity) >= product.stock}
// //                                     className="px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-black h-full transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
// //                                 >
// //                                     +
// //                                 </button>
// //                             </div>

// //                             {/* ⚡ التعديل الجوهري: تغيير لون الزر الأساسي لأخضر الشعار النيون المتوهج بقوة ⚡ */}
// //                             <button 
// //                                 onClick={handleAddToCart}
// //                                 disabled={isSoldOut || isLimitExceeded}
// //                                 className="bg-[#00cc88] hover:bg-[#00b374] text-white text-xs font-black uppercase tracking-wider h-[40px] px-8 rounded-xl transition-all duration-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-500/10 select-none flex-1 sm:flex-none max-w-xs text-center"
// //                             >
// //                                 {isSoldOut 
// //                                     ? 'SOLD OUT' 
// //                                     : isLimitExceeded 
// //                                         ? 'LIMIT EXCEEDED' 
// //                                         : 'ADD TO CART'
// //                                 }
// //                             </button>
// //                         </div>

// //                         <hr className="border-slate-100 mb-6" />

// //                         <div className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
// //                             <p>SKU Matrix: <span className="text-slate-700 font-mono tracking-normal normal-case font-medium">{product.slug || product.id}</span></p>
// //                             <p>Category Node: <span className="text-slate-700 hover:text-[#00cc88] cursor-pointer transition-colors">{product.category || 'Computer Components'}</span></p>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* ========== BOTTOM SIDE: TABS ========== */}
// //                 <div className="mt-16 border-t border-slate-100 pt-8">
// //                     <div className="flex gap-8 border-b border-slate-100 mb-6">
// //                         {/* تبويبات المواصفات تم تعديلها لتضيء باللون الداكن الحاد والأخضر عند التنشيط */}
// //                         <button 
// //                             onClick={() => setActiveTab('description')}
// //                             className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'description' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
// //                         >
// //                             Description
// //                             {activeTab === 'description' && <span className="absolute bottom-[-1px] left-0 w-full h-[2.5px] bg-[#00cc88] rounded-full"></span>}
// //                         </button>
// //                         <button 
// //                             onClick={() => setActiveTab('additional')}
// //                             className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'additional' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
// //                         >
// //                             Additional Specs
// //                             {activeTab === 'additional' && <span className="absolute bottom-[-1px] left-0 w-full h-[2.5px] bg-[#00cc88] rounded-full"></span>}
// //                         </button>
// //                     </div>

// //                     <div className="text-slate-600 text-sm leading-[1.8] max-w-5xl space-y-4 font-medium">
// //                         {activeTab === 'description' && (
// //                             <div className="space-y-4">
// //                                 <p className="text-slate-900 font-bold text-base tracking-tight">{product.name}</p>
// //                                 {product.details && product.details.map((item, index) => {
// //                                     if (item.includes(':')) {
// //                                         const parts = item.split(':');
// //                                         return (
// //                                             <p key={index} className="whitespace-pre-line text-slate-600">
// //                                                 <span className="text-slate-900 font-bold mr-1">{parts[0].trim()}:</span>
// //                                                 {parts.slice(1).join(':').trim()}
// //                                             </p>
// //                                         );
// //                                     }
// //                                     return <p key={index} className="whitespace-pre-line text-slate-500">{item}</p>;
// //                                 })}
// //                             </div>
// //                         )}
                        
// //                         {activeTab === 'additional' && (
// //                             <div className="space-y-2 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl max-w-xl text-xs font-bold uppercase tracking-wider text-slate-400">
// //                                 <p>Stock Status Node: <span className="text-slate-800 ml-1">{product.stock > 0 ? 'In Stock Logged' : 'Out of Stock'}</span></p>
// //                                 <p>Brand Authenticity: <span className="text-[#00cc88] ml-1">{product.brand?.name || 'N/A'}</span></p>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
                
// //             </div>
// //         </div>
// //     );
// // }










// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useCart } from '../../app/CartContext';
// import api, { getImageUrl } from '../../services/api';
// import { useTranslation } from 'react-i18next';

// export default function ProductDetailPage() {
//     const { slug } = useParams(); 
//     const { addToCart, cart } = useCart();
//     const { t, i18n } = useTranslation();

//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeImgIdx, setActiveImgIdx] = useState(0);
    
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('additional'); // جعل التبويب السفلي يفتح على المواصفات الإضافية بما أن الوصف صعد للأعلى

//     const isRtl = i18n.language === 'ar';

//     useEffect(() => {
//         const fetchProductBySlug = async () => {
//             try {
//                 setLoading(true);
//                 if (!slug) {
//                     setError('Direct navigation mismatch. Resource URL slug is required.');
//                     setLoading(false);
//                     return;
//                 }
//                 const response = await api.get(`/public/product/${slug}`);
//                 const productData = response.data.data ? response.data.data : response.data;
                
//                 if (productData) {
//                     setProduct(productData);
//                     setError(null);
//                     setActiveImgIdx(0);
//                 } else {
//                     setError('The requested product was not found in our catalog entries.');
//                 }
//             } catch (err) {
//                 setError('Failed to download dynamic record details from server.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProductBySlug();
//     }, [slug]); 

//     if (loading) return <div className="text-center py-32 text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse font-sans">Loading product matrix...</div>;
//     if (error) return <div className="max-w-xl mx-auto my-12 bg-rose-50 text-rose-600 p-4 border border-rose-100 text-center font-bold text-xs rounded-xl font-sans">{error}</div>;
//     if (!product) return null;

//     const currentCartItem = cart ? cart.find(item => item.id === product.id) : null;
//     const currentCartQty = currentCartItem ? (currentCartItem.cartQuantity || currentCartItem.quantity || 0) : 0;

//     const isLimitExceeded = (currentCartQty + quantity) > product.stock;
//     const isSoldOut = product.stock <= 0;

//     const handleAddToCart = () => {
//         if (!isSoldOut && !isLimitExceeded) {
//             const productWithQuantity = { ...product, cartQuantity: quantity };
//             addToCart(productWithQuantity, quantity); 
//         }
//     };

//     const hasImages = product.images && product.images.length > 0;
//     const stripHtml = (html) => {
//         if (!html) return '';
//         return html.replace(/<[^>]+>/g, '');
//     };

//     // استخراج حقل الوصف النصي المباشر لقراءته بجانب الصورة
//     const productDescription = product?.description?.[i18n.language] || product?.description?.en || product?.description || '';

//     return (
//         <div className="w-full bg-white min-h-screen font-sans antialiased text-left rtl:text-right">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                
//                 {/* الشبكة الرئيسية: صورة على اليسار، تفاصيل ووصف فخم على اليمين */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
//                     {/* ========== LEFT SIDE: IMAGES ========== */}
//                     <div className="flex flex-col gap-4">
//                         <div className="border border-slate-100 p-8 flex items-center justify-center h-[380px] sm:h-[520px] relative rounded-2xl bg-white shadow-3xs">
//                             {hasImages ? (
//                                 <img 
//                                     src={getImageUrl(product.images[activeImgIdx])} 
//                                     alt={product.name} 
//                                     className="max-w-full max-h-full object-contain mix-blend-multiply"
//                                 />
//                             ) : (
//                                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">No Image Available</span>
//                             )}
//                         </div>

//                         {hasImages && product.images.length > 1 && (
//                             <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-center lg:justify-start">
//                                 {product.images.map((img, idx) => (
//                                     <button
//                                         key={idx}
//                                         onClick={() => setActiveImgIdx(idx)}
//                                         className={`w-18 h-18 border p-1 rounded-xl transition-all flex-shrink-0 bg-white flex items-center justify-center active:scale-95 ${idx === activeImgIdx ? 'border-[#00cc88] ring-2 ring-[#00cc88]/20' : 'border-slate-100 hover:border-slate-300'}`}
//                                     >
//                                         <img src={getImageUrl(img)} alt={`thumb-${idx}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* ========== RIGHT SIDE: DETAILS & DESCRIPTION ========== */}
//                     <div className="flex flex-col pt-2 space-y-4">
//                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                             <Link to="/" className="hover:text-[#00cc88] transition-colors">{t('track_order') && t('home')}</Link>
//                             <span className="text-slate-200">/</span>
//                             <span className="text-slate-500">{product.category || 'COMPUTER COMPONENTS'}</span>
//                         </div>

//                         {/* ⚡ تكبير خط عنوان المنتج بالكامل ليكون فخماً وضخماً ⚡ */}
//                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
//                             {product.name}
//                         </h1>

//                         {/* ⚡ تكبير خط السعر بلون النيون المتوهج ⚡ */}
//                         <div className="text-3xl font-black text-[#00cc88] font-mono tracking-tight">
//                             ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                         </div>

//                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                             {isRtl ? 'المخزون المتوفر:' : 'Available Stock:'} 
//                             <span className="text-slate-800 font-black bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-md ms-1 text-xs">{product.stock} {isRtl ? 'قطعة' : 'units'}</span>
//                             {currentCartQty > 0 && <span className="text-[#00cc88] block mt-1.5 font-bold normal-case tracking-normal">({currentCartQty} {isRtl ? 'قطع محجوزة مسبقاً في سلتك' : 'units already locked in your cart'})</span>}
//                         </div>

//                         {/* ⚡ وضع حقل الوصف (Description) هنا بجانب الصورة بخط عريض، كبير، وواضح جداً ⚡ */}
//                         {productDescription && (
//                             <div className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed py-2 whitespace-pre-line border-t border-b border-slate-100">
//                                 {stripHtml(productDescription)}
//                             </div>
//                         )}

//                         {/* أزرار التحكم بالكمية والسلة */}
//                         <div className="flex flex-wrap items-center gap-4 pt-2">
//                             <div className="flex items-center border border-slate-200 h-[44px] bg-slate-50/50 rounded-xl select-none overflow-hidden shadow-3xs">
//                                 <button 
//                                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                                     disabled={quantity <= 1}
//                                     className="px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-black h-full transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
//                                 >
//                                     -
//                                 </button>
//                                 <div className="px-5 border-l border-r border-slate-100 text-sm font-mono font-black text-slate-800 h-full flex items-center justify-center min-w-[2.5rem] bg-white">
//                                     {quantity}
//                                 </div>
//                                 <button 
//                                     onClick={() => setQuantity(q => q + 1)}
//                                     disabled={(currentCartQty + quantity) >= product.stock}
//                                     className="px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-black h-full transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
//                                 >
//                                     +
//                                 </button>
//                             </div>

//                             <button 
//                                 onClick={handleAddToCart}
//                                 disabled={isSoldOut || isLimitExceeded}
//                                 className="bg-[#00cc88] hover:bg-[#00b374] text-white text-xs font-black uppercase tracking-widest h-[44px] px-8 rounded-xl transition-all duration-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-500/10 select-none flex-1 sm:flex-none max-w-xs text-center"
//                             >
//                                 {isSoldOut 
//                                     ? t('sold_out') 
//                                     : isLimitExceeded 
//                                         ? 'LIMIT EXCEEDED' 
//                                         : t('add_to_cart')
//                                 }
//                             </button>
//                         </div>

//                         <div className="space-y-2 text-[11px] font-black text-slate-400 uppercase tracking-widest pt-2">
//                             <p>SKU Matrix: <span className="text-slate-700 font-mono tracking-normal normal-case font-semibold ms-1">{product.slug || product.id}</span></p>
//                             <p>Brand Node: <span className="text-slate-700 font-black ms-1">{product.brand?.name || 'GENERIC'}</span></p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ========== BOTTOM SECTION: KEEP AS IS (تم الاحتفاظ بالتبويبات السفلية وجداولها كما هي تماماً) ========== */}
//                 <div className="mt-16 border-t border-slate-100 pt-8">
//                     <div className="flex gap-8 border-b border-slate-100 mb-6">
//                         <button 
//                             onClick={() => setActiveTab('additional')}
//                             className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'additional' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
//                         >
//                             {isRtl ? 'المواصفات الفنية والتقنية' : 'Technical Specifications'}
//                             {activeTab === 'additional' && <span className="absolute bottom-[-1px] start-0 w-full h-[2.5px] bg-[#00cc88] rounded-full"></span>}
//                         </button>
//                         <button 
//                             onClick={() => setActiveTab('stock_info')}
//                             className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'stock_info' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
//                         >
//                             {isRtl ? 'معلومات الضمان والمصنع' : 'Ecosystem Logs'}
//                             {activeTab === 'stock_info' && <span className="absolute bottom-[-1px] start-0 w-full h-[2.5px] bg-[#00cc88] rounded-full"></span>}
//                         </button>
//                     </div>

//                     <div className="text-slate-600 text-sm leading-[1.8] max-w-5xl space-y-4 font-medium">
                        
//                         {activeTab === 'additional' && (
//                             <div className="space-y-6 animate-fade-in max-w-3xl">
//                                 <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-3xs bg-white">
//                                     <table className="min-w-full text-xs sm:text-sm border-collapse">
//                                         <tbody>
//                                             {product.details && product.details.length > 0 && product.details.map((item, idx) => {
//                                                 if (item.includes(':')) {
//                                                     const parts = item.split(':');
//                                                     const title = parts[0].trim();
//                                                     const value = parts.slice(1).join(':').trim();
//                                                     return (
//                                                         <tr key={`detail-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
//                                                             <td className="w-1/3 p-4 bg-slate-50/60 font-black uppercase text-slate-500 tracking-wider border-e border-slate-100 text-[10px] sm:text-[11px]">
//                                                                 {title}
//                                                             </td>
//                                                             <td className="p-4 text-slate-700 font-semibold font-sans" dir="ltr">
//                                                                 {value}
//                                                             </td>
//                                                         </tr>
//                                                     );
//                                                 }
//                                                 return (
//                                                     <tr key={`detail-raw-${idx}`} className="border-b border-slate-50 last:border-0">
//                                                         <td colSpan="2" className="p-4 bg-slate-50/20 text-slate-400 italic text-xs font-semibold uppercase tracking-wide">
//                                                             • {item}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}

//                                             {product.attributeValues && product.attributeValues.length > 0 && product.attributeValues.map((attrVal, idx) => (
//                                                 <tr key={`attr-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
//                                                     <td className="w-1/3 p-4 bg-slate-50/60 font-black uppercase text-slate-500 tracking-wider border-e border-slate-100 text-[10px] sm:text-[11px]">
//                                                         {attrVal.attribute?.name?.[i18n.language] || attrVal.attribute?.name?.en || 'Specification Line'}
//                                                     </td>
//                                                     <td className="p-4 text-slate-800 font-bold font-mono text-xs sm:text-sm" dir="ltr">
//                                                         {typeof attrVal.value === 'object' ? (attrVal.value?.[i18n.language] || attrVal.value?.en) : attrVal.value}
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}

//                         {activeTab === 'stock_info' && (
//                             <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl max-w-xl text-xs font-bold uppercase tracking-wider text-slate-400 animate-fade-in">
//                                 <p>Stock Status Node: <span className="text-slate-800 ml-1">{product.stock > 0 ? 'In Stock Logged' : 'Out of Stock'}</span></p>
//                                 <p>Brand Authenticity: <span className="text-[#00cc88] ml-1">{product.brand?.name || 'N/A'}</span></p>
//                             </div>
//                         )}
                        
//                     </div>
//                 </div>
                
//             </div>
//         </div>
//     );
// }




import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import api, { getImageUrl } from '../../services/api';
import { useTranslation } from 'react-i18next';

export default function ProductDetailPage() {
    const { slug } = useParams(); 
    const { addToCart, cart } = useCart();
    const { t, i18n } = useTranslation();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('additional'); 

    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        const fetchProductBySlug = async () => {
            try {
                setLoading(true);
                if (!slug) {
                    setError('Direct navigation mismatch. Resource URL slug is required.');
                    setLoading(false);
                    return;
                }
                const response = await api.get(`/public/product/${slug}`);
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
        fetchProductBySlug();
    }, [slug]); 

    if (loading) return <div className="text-center py-32 text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse font-sans">Loading product matrix...</div>;
    if (error) return <div className="max-w-xl mx-auto my-12 bg-rose-50 text-rose-600 p-4 border border-rose-100 text-center font-bold text-xs rounded-xl font-sans">{error}</div>;
    if (!product) return null;

    const currentCartItem = cart ? cart.find(item => item.id === product.id) : null;
    const currentCartQty = currentCartItem ? (currentCartItem.cartQuantity || currentCartItem.quantity || 0) : 0;

    const isLimitExceeded = (currentCartQty + quantity) > product.stock;
    const isSoldOut = product.stock <= 0;

    const handleAddToCart = () => {
        if (!isSoldOut && !isLimitExceeded) {
            const productWithQuantity = { ...product, cartQuantity: quantity };
            addToCart(productWithQuantity, quantity); 
        }
    };

    const hasImages = product.images && product.images.length > 0;
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '');
    };

    const productDescription = product?.description?.[i18n.language] || product?.description?.en || product?.description || '';

    return (
        <div className="w-full bg-white min-h-screen font-sans antialiased text-left rtl:text-right">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* ========== LEFT SIDE: IMAGES ========== */}
                    <div className="flex flex-col gap-4">
                        <div className="border border-slate-100 p-8 flex items-center justify-center h-[380px] sm:h-[520px] relative rounded-2xl bg-white shadow-3xs">
                            {hasImages ? (
                                <img 
                                    src={getImageUrl(product.images[activeImgIdx])} 
                                    alt={product.name} 
                                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                                />
                            ) : (
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">No Image Available</span>
                            )}
                        </div>

                        {hasImages && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-center lg:justify-start">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImgIdx(idx)}
                                        className={`w-18 h-18 border p-1 rounded-xl transition-all flex-shrink-0 bg-white flex items-center justify-center active:scale-95 ${idx === activeImgIdx ? 'border-[#00cc88] ring-2 ring-[#00cc88]/20' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <img src={getImageUrl(img)} alt={`thumb-${idx}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ========== RIGHT SIDE: DETAILS & DESCRIPTION ========== */}
                    <div className="flex flex-col pt-2 space-y-4">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Link to="/" className="hover:text-[#00cc88] transition-colors">{t('home')}</Link>
                            <span className="text-slate-200">/</span>
                            <span className="text-slate-500">{product.category || 'COMPUTER COMPONENTS'}</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        <div className="text-3xl font-black text-[#00cc88] font-mono tracking-tight">
                            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {isRtl ? 'المخزون المتوفر:' : 'Available Stock:'} 
                            <span className="text-slate-800 font-black bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-md ms-1 text-xs">{product.stock} {isRtl ? 'قطعة' : 'units'}</span>
                            {currentCartQty > 0 && <span className="text-[#00cc88] block mt-1.5 font-bold normal-case tracking-normal">({currentCartQty} {isRtl ? 'قطع محجوزة مسبقاً في سلتك' : 'units already locked in your cart'})</span>}
                        </div>

                        {productDescription && (
                            <div className="text-slate-600 font-medium text-sm sm:text-[15px] leading-relaxed py-2 whitespace-pre-line border-t border-b border-slate-100">
                                {stripHtml(productDescription)}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mb-8 pt-2">
                            <div className="flex items-center border border-slate-200 h-[44px] bg-slate-50/50 rounded-xl select-none overflow-hidden shadow-3xs">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    className="px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-black h-full transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    -
                                </button>
                                <div className="px-5 border-l border-r border-slate-100 text-sm font-mono font-black text-slate-800 h-full flex items-center justify-center min-w-[2.5rem] bg-white">
                                    {quantity}
                                </div>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    disabled={(currentCartQty + quantity) >= product.stock}
                                    className="px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-black h-full transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                disabled={isSoldOut || isLimitExceeded}
                                className="bg-[#00cc88] hover:bg-[#00b374] text-white text-xs font-black uppercase tracking-widest h-[44px] px-8 rounded-xl transition-all duration-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-500/10 select-none flex-1 sm:flex-none max-w-xs text-center"
                            >
                                {isSoldOut ? t('sold_out') : isLimitExceeded ? 'LIMIT EXCEEDED' : t('add_to_cart')}
                            </button>
                        </div>

                        <div className="space-y-2 text-[11px] font-black text-slate-400 uppercase tracking-widest pt-2">
                            <p>SKU Matrix: <span className="text-slate-700 font-mono tracking-normal normal-case font-semibold ms-1">{product.slug || product.id}</span></p>
                            <p>Brand Node: <span className="text-slate-700 font-black ms-1">{product.brand?.name || 'GENERIC'}</span></p>
                        </div>
                    </div>
                </div>

                {/* ========== BOTTOM SECTION ========== */}
                <div className="mt-16 border-t border-slate-100 pt-8">
                    <div className="flex gap-8 border-b border-slate-100 mb-6">
                        <button 
                            onClick={() => setActiveTab('additional')}
                            className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'additional' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                            {isRtl ? 'المواصفات الفنية والتقنية' : 'Technical Specifications'}
                            {activeTab === 'additional' && <span className="absolute bottom-[-1px] start-0 w-full h-[2.5px] bg-[#00cc88] rounded-full"></span>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('stock_info')}
                            className={`pb-3 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === 'stock_info' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                            {isRtl ? 'معلومات الضمان والمصنع' : 'Ecosystem Logs'}
                            {activeTab === 'stock_info' && <span className="absolute bottom-[-1px] start-0 w-full h-[2.5px] bg-[#00cc88] rounded-full"></span>}
                        </button>
                    </div>

                    <div className="text-slate-600 text-sm leading-[1.8] max-w-5xl space-y-4 font-medium">
                        
                        {activeTab === 'additional' && (
                            <div className="space-y-6 animate-fade-in max-w-3xl">
                                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-3xs bg-white">
                                    <table className="min-w-full text-xs sm:text-sm border-collapse">
                                        <tbody>
                                            {/* أ. طباعة المواصفات النصية اليدوية */}
                                            {product.details && product.details.length > 0 && product.details.map((item, idx) => {
                                                if (item.includes(':')) {
                                                    const parts = item.split(':');
                                                    const title = parts[0].trim();
                                                    const value = parts.slice(1).join(':').trim();
                                                    return (
                                                        <tr key={`detail-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                                            <td className="w-1/3 p-4 bg-slate-50/60 font-black uppercase text-slate-500 tracking-wider border-e border-slate-100 text-[10px] sm:text-[11px]">
                                                                {title}
                                                            </td>
                                                            <td className="p-4 text-slate-700 font-semibold font-sans" dir="ltr">
                                                                {value}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return (
                                                    <tr key={`detail-raw-${idx}`} className="border-b border-slate-50 last:border-0">
                                                        <td colSpan="2" className="p-4 bg-slate-50/20 text-slate-400 italic text-xs font-semibold uppercase tracking-wide">
                                                            • {item}
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* ب. ⚡ التحديث الجوهري: طباعة مصفوفة الخصائص الذكية المجمعة التابعة للـ PC Builder والأجيال */}
                                            {product.attribute_groups && product.attribute_groups.length > 0 && product.attribute_groups.map((group, idx) => {
                                                const attrName = typeof group.attribute_name === 'object' 
                                                    ? (group.attribute_name?.[i18n.language] || group.attribute_name?.en) 
                                                    : group.attribute_name;

                                                return (
                                                    <tr key={`group-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                                                        <td className="w-1/3 p-4 bg-slate-50/60 font-black uppercase text-slate-500 tracking-wider border-e border-slate-100 text-[10px] sm:text-[11px]">
                                                            {attrName || 'Specification Node'}
                                                        </td>
                                                        <td className="p-4 flex flex-wrap gap-1.5 items-center">
                                                            {/* فرز وقراءة القيم الفردية أو المتعددة المحقونة بداخل الموديل والمجموعة */}
                                                            {group.selected_values?.map((val) => {
                                                                const valName = typeof val.value_name === 'object'
                                                                    ? (val.value_name?.[i18n.language] || val.value_name?.en)
                                                                    : val.value_name;
                                                                return (
                                                                    <span 
                                                                        key={val.value_id} 
                                                                        className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-slate-200/60 shadow-3xs"
                                                                    >
                                                                        {valName}
                                                                    </span>
                                                                );
                                                            })}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'stock_info' && (
                            <div className="space-y-4 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl max-w-xl text-xs font-bold uppercase tracking-wider text-slate-400 animate-fade-in">
                                <p>Stock Status Node: <span className="text-slate-800 ml-1">{product.stock > 0 ? 'In Stock Logged' : 'Out of Stock'}</span></p>
                                <p>Brand Authenticity: <span className="text-[#00cc88] ml-1">{product.brand?.name || 'N/A'}</span></p>
                            </div>
                        )}
                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}