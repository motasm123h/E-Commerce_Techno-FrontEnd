// import api from './api';

// // Categories Endpoints
// export const categoryApi = {
//     getAll: async () => (await api.get('/categories')).data,
//     create: async (data) => (await api.post('/categories', data)).data,
//     // إرسال البيانات بشكل سليم كـ JSON، أو استخدام POST مع مرشد الطريقة لو أرسلتها كـ FormData
//     update: async (id, data) => (await api.put(`/categories/${id}`, data)).data,
//     delete: async (id) => (await api.delete(`/categories/${id}`)).data,
// };

// // Sections Endpoints
// export const sectionApi = {
//     getAll: async () => (await api.get('/sections')).data,
//     create: async (data) => (await api.post('/sections', data)).data,
//     update: async (id, data) => (await api.put(`/sections/${id}`, data)).data,
//     delete: async (id) => (await api.delete(`/sections/${id}`)).data,
// };

// // Brands Endpoints
// export const brandApi = {
//     getAll: async () => (await api.get('/brands')).data,
//     create: async (data) => (await api.post('/brands', data)).data,
//     update: async (id, data) => (await api.put(`/brands/${id}`, data)).data,
//     delete: async (id) => (await api.delete(`/brands/${id}`)).data,
// };

// // Products Endpoints
// export const productApi = {
//     getAll: async () => (await api.get('/products')).data,
    
//     create: async (formData) => {
//         const response = await api.post('/products', formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return response.data;
//     },

//     update: async (id, formData) => {
//         if (formData instanceof FormData && !formData.has('_method')) {
//             formData.append('_method', 'PUT');
//         }
        
//         const response = await api.post(`/products/${id}`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return response.data;
//     },
    
//     delete: async (id) => (await api.delete(`/products/${id}`)).data,
// };

// export const bannerApi = {
//     getAllAdmin: async () => (await api.get('/admin/banners')).data,
    
//     create: async (formData) => {
//         const response = await api.post('/admin/banners', formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return response.data;
//     },

//     update: async (id, formData) => {
//         if (formData instanceof FormData && !formData.has('_method')) {
//             formData.append('_method', 'PUT');
//         }
//         const response = await api.post(`/admin/banners/${id}`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return response.data;
//     },
    
//     delete: async (id) => (await api.delete(`/admin/banners/${id}`)).data,
// };



import api from './api';

export const categoryApi = {
    getAll: async () => (await api.get('/categories')).data,
    create: async (data) => (await api.post('/categories', data)).data,
    update: async (id, data) => (await api.put(`/categories/${id}`, data)).data,
    delete: async (id) => (await api.delete(`/categories/${id}`)).data,
};

export const sectionApi = {
    getAll: async () => (await api.get('/sections')).data,
    create: async (data) => (await api.post('/sections', data)).data,
    update: async (id, data) => (await api.put(`/sections/${id}`, data)).data,
    delete: async (id) => (await api.delete(`/sections/${id}`)).data,
};

export const brandApi = {
    getAll: async () => (await api.get('/brands')).data,
    create: async (data) => (await api.post('/brands', data)).data,
    update: async (id, data) => (await api.put(`/brands/${id}`, data)).data,
    delete: async (id) => (await api.delete(`/brands/${id}`)).data,
};

export const productApi = {
    getAll: async () => (await api.get('/products')).data,
    create: async (formData) => {
        const response = await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    update: async (id, formData) => {
        if (formData instanceof FormData && !formData.has('_method')) {
            formData.append('_method', 'PUT');
        }
        const response = await api.post(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    delete: async (id) => (await api.delete(`/products/${id}`)).data,
};

export const bannerApi = {
    getAllAdmin: async () => (await api.get('/admin/banners')).data,
    create: async (formData) => {
        const response = await api.post('/admin/banners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    update: async (id, formData) => {
        if (formData instanceof FormData && !formData.has('_method')) {
            formData.append('_method', 'PUT');
        }
        const response = await api.post(`/admin/banners/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    delete: async (id) => (await api.delete(`/admin/banners/${id}`)).data,
};