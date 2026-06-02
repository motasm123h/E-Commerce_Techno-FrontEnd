// import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import api from '../services/api';

// export function useProducts() {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const location = useLocation();

//     useEffect(() => {
//         const fetchStoreProducts = async () => {
//             try {
//                 setLoading(true);
//                 const response = await api.get('/public/products');
//                 const rawData = response.data.data ? response.data.data : response.data;

//                 // 1. التقاط معاملات الفلترة من الرابط الحالي
//                 const queryParams = new URLSearchParams(location.search);
//                 const searchKeyword = queryParams.get('search');
//                 const sectionParam = queryParams.get('section');
//                 const categoryParam = queryParams.get('category');

//                 let filteredData = rawData;

//                 // 2. تطبيق فلتر البحث النصي (إن وجد)
//                 if (searchKeyword) {
//                     const normalizedKeyword = searchKeyword.toLowerCase();
//                     filteredData = filteredData.filter(p => 
//                         p.name.toLowerCase().includes(normalizedKeyword) || 
//                         (p.brand?.name && p.brand.name.toLowerCase().includes(normalizedKeyword))
//                     );
//                 }

//                 // 3. التعديل الذهبي: فلترة القسم بناءً على الاسم النصي أو الـ ID الرقمي
//                 if (sectionParam) {
//                     const normalizedSection = sectionParam.toLowerCase().trim();
//                     filteredData = filteredData.filter(p => {
//                         if (!p.section) return false;
                        
//                         // لو كان كائن كامل {id, name} أو نص مباشر
//                         const sectionName = typeof p.section === 'object' ? p.section.name : p.section;
//                         const sectionId = typeof p.section === 'object' ? String(p.section.id) : String(p.section_id || '');

//                         return (
//                             sectionName.toLowerCase().trim() === normalizedSection || 
//                             sectionId === normalizedSection
//                         );
//                     });
//                 }

//                 if (categoryParam) {
//                     const normalizedCategory = categoryParam.toLowerCase().trim();
//                     filteredData = filteredData.filter(p => {
//                         if (!p.category) return false;

//                         const categoryName = typeof p.category === 'object' ? p.category.name : p.category;
//                         const categoryId = typeof p.category === 'object' ? String(p.category.id) : String(p.category_id || '');

//                         return (
//                             categoryName.toLowerCase().trim() === normalizedCategory || 
//                             categoryId === normalizedCategory
//                         );
//                     });
//                 }

//                 setProducts(filteredData);
//                 setError(null);
//             } catch (err) {
//                 setError('Failed to fetch the current store listings.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStoreProducts();
//     }, [location.search]);

//     return { products, loading, error };
// }




import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchStoreProducts = async () => {
            try {
                setLoading(true);
                
                const queryParams = new URLSearchParams(location.search);
                
                // 1. التقاط الحقول الفردية الأساسية تلقائياً
                const params = {};
                if (queryParams.get('page')) params.page = queryParams.get('page');
                if (queryParams.get('search')) params.search = queryParams.get('search');
                if (queryParams.get('category_id')) params.category_id = queryParams.get('category_id');
                if (queryParams.get('section_id')) params.section_id = queryParams.get('section_id');
                if (queryParams.get('brand_id')) params.brand_id = queryParams.get('brand_id');
                if (queryParams.get('min_price')) params.min_price = queryParams.get('min_price');
                if (queryParams.get('max_price')) params.max_price = queryParams.get('max_price');
                if (queryParams.get('sort_by')) params.sort_by = queryParams.get('sort_by');

                // 2. السحر المصلح: التقاط مصفوفة الـ Checkboxes بالكامل وإرسالها باسم "attribute_values"
                // التابع getAll يسحب كل الـ IDs المحددة كـ Array حقيقية [1, 2, 4] يفهمها لارافل فوراً
                const attrValues = queryParams.getAll('attribute_values[]');
                if (attrValues.length > 0) {
                    params.attribute_values = attrValues;
                }

                // 3. استدعاء الـ API مع المعاملات الشاملة المصلحة
                const response = await api.get('/public/products', { params });
                
                const serverData = response.data;
                
                setProducts(serverData.data || []);
                
                setPagination({
                    current_page: serverData.current_page || serverData.meta?.current_page || 1,
                    last_page: serverData.last_page || serverData.meta?.last_page || 1,
                    next_page_url: serverData.next_page_url || serverData.links?.next,
                    prev_page_url: serverData.prev_page_url || serverData.links?.prev,
                    total: serverData.total || serverData.meta?.total || 0
                });

                setError(null);
            } catch (err) {
                setError('Failed to fetch store inventory records.');
            } file: {
                setLoading(false);
            }
        };

        fetchStoreProducts();
    }, [location.search]); 

    return { products, pagination, loading, error };
}