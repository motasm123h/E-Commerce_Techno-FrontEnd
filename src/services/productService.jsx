import api from './api';

export const getProducts = async (params = {}) => {
    // This hits http://localhost:8000/api/v1/products
    const response = await api.get('/public/products', { params });
    return response.data; 
};