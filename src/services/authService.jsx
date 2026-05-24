import api from './api';

export const login = async (credentials) => {
    // Hits your login endpoint directly
    const response = await api.post('/admin/login', credentials);
    return response.data; // This returns the { user, token } object from Laravel
};

export const logout = async () => {
    const response = await api.post('/logout');
    return response.data;
};

export const getUser = async () => {
    const response = await api.get('/user');
    return response.data;
};