import { useState, useEffect } from 'react';
import { productApi } from '../services/adminService';

export function useAdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const responseData = await productApi.getAll();
            setProducts(responseData.data ? responseData.data : responseData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products catalog.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (formData) => {
        try {
            await productApi.create(formData);
            await fetchProducts(); // إعادة جلب القائمة الحية لضمان مزامنة العلاقات البرمجية بالكامل
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create product listings.' };
        }
    };
    
    const updateProduct = async (id, formData) => {
        try {
            await productApi.update(id, formData);
            await fetchProducts(); // إعادة جلب الكتالوج حياً لعكس التعديلات والعلاقات الجديدة
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update product.' };
        }
    };

    const removeProduct = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this product?")) return { success: false };
        try {
            await productApi.delete(id);
            setProducts((prev) => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to remove selected product.' };
        }
    };

    return { products, loading, error, addProduct, updateProduct, removeProduct, refresh: fetchProducts };
}