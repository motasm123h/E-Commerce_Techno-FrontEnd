// import { useState, useEffect } from 'react';
// import { getCategories, createCategory, deleteCategory } from '../services/categoryService';

// export function useCategories() {
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchCategories = async () => {
//         try {
//             setLoading(true);
//             const data = await getCategories();
//             setCategories(data);
//             setError(null);
//         } catch (err) {
//             setError('Failed to load categories');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const addCategory = async (categoryData) => {
//         try {
//             const newCategory = await createCategory(categoryData);
//             // Update local state without needing to refresh the page
//             setCategories([...categories, newCategory]); 
//             return { success: true };
//         } catch (err) {
//             return { success: false, error: err.response?.data?.message || 'Failed to create' };
//         }
//     };

//     const removeCategory = async (id) => {
//         try {
//             await deleteCategory(id);
//             setCategories(categories.filter(cat => cat.id !== id));
//             return { success: true };
//         } catch (err) {
//             return { success: false, error: 'Failed to delete' };
//         }
//     };

//     return { 
//         categories, 
//         loading, 
//         error, 
//         addCategory, 
//         removeCategory 
//     };
// }




import { useState, useEffect } from 'react';
import { categoryApi } from '../services/adminService';

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryApi.getAll();
            const data = response.data || response;
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async (categoryData) => {
        try {
            const response = await categoryApi.create(categoryData);
            const newCategory = response.data || response;
            setCategories((prev) => [...prev, newCategory]); 
            return { success: true, data: newCategory };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create category' };
        }
    };

    const removeCategory = async (id) => {
        try {
            await categoryApi.delete(id);
            setCategories((prev) => prev.filter(cat => cat.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete category' };
        }
    };

    return { 
        categories, 
        loading, 
        error, 
        addCategory, 
        removeCategory 
    };
}