import { useState, useEffect } from 'react';
import { brandApi } from '../services/adminService';

export function useBrands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const data = await brandApi.getAll();
            setBrands(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch brands data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const addBrand = async (formData) => {
        try {
            const newBrand = await brandApi.create(formData);
            setBrands((prev) => [...prev, newBrand]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create brand.' };
        }
    };

    const removeBrand = async (id) => {
        try {
            await brandApi.delete(id);
            setBrands((prev) => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete brand.' };
        }
    };

    return { brands, loading, error, addBrand, removeBrand };
}