// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api/v1',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     }
// });

// // AUTO-ATTACH TOKEN TO ALL OUTGOING REQUESTS
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('eco_admin_token');
//         if (token) {
//             // Injects the bearer token cleanly bypassing browser cookie rules
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default api;


import axios from 'axios';

// 1. Centralized Single Source of Truth for the Backend Location
export const BACKEND_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// export const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
    
//     // If the path is already an absolute URL, return it unchanged
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//         return imagePath;
//     }
    
//     // Prefix the path with our centralized backend domain location
//     return `${BACKEND_URL}${imagePath}`;
// };


export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (Array.isArray(imagePath)) {
        imagePath = imagePath[0];
    }
    if (typeof imagePath !== 'string') {
        return null; 
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('eco_admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;