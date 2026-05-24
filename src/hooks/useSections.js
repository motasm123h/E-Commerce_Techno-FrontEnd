import { useState, useEffect } from 'react';
import { sectionApi } from '../services/adminService';

export function useSections() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const data = await sectionApi.getAll();
            setSections(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch sections data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const addSection = async (formData) => {
        try {
            const newSection = await sectionApi.create(formData);
            setSections((prev) => [...prev, newSection]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to create section.' };
        }
    };

    // === الدالة الجديدة التي طلبتهـا ===
    const updateSection = async (id, formData) => {
        try {
            const response = await sectionApi.update(id, formData);
            
            // الباك إند الخاص بك يرجع البيانات بداخل كائن 'data' حسب الكود: ['success' => true, 'data' => $section]
            // لذلك نستخرج القسم المحدث من response.data (أو response مباشرة حسب إعدادات الـ interceptor عندك)
            const updatedSection = response.data || response;

            setSections((prev) => 
                prev.map((item) => (item.id === id ? updatedSection : item))
            );
            
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || 'Failed to update section.' };
        }
    };

    const removeSection = async (id) => {
        try {
            await sectionApi.delete(id);
            setSections((prev) => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to delete section.' };
        }
    };

    // لا تنسَ إضافة updateSection هنا في الـ return
    return { sections, loading, error, addSection, removeSection, updateSection };
}