import { useState, useEffect } from 'react';
import api from '../services/api'; // Ensure this points to your configured Axios instance

export function useAdvertisements() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/advertisements');
            setAds(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch advertisements.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const addAd = async (formData) => {
        try {
            // Note: We pass formData directly because it contains an image file
            const response = await api.post('/admin/advertisements', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAds((prev) => [...prev, response.data.data]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create advertisement.' };
        }
    };

    const updateAd = async (id, formData) => {
        try {
            // CRITICAL FIX FOR LARAVEL + FORMDATA + PUT REQUESTS:
            // Laravel cannot read files via PUT requests reliably. 
            // We append _method='PUT' and send it as a POST request.
            formData.append('_method', 'PUT');
            
            const response = await api.post(`/admin/advertisements/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const updatedAd = response.data.data;
            setAds((prev) => prev.map((item) => (item.id === id ? updatedAd : item)));
            
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update advertisement.' };
        }
    };

    const removeAd = async (id) => {
        try {
            await api.delete(`/admin/advertisements/${id}`);
            setAds((prev) => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete advertisement.' };
        }
    };

    return { ads, loading, error, addAd, updateAd, removeAd, refreshAds: fetchAds };
}