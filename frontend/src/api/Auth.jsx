import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    return await api.post('/auth/login', { email, password });
};

export const signupUser = async (name, email, password) => {
    return await api.post('/auth/signup', { name, email, password });
};

export default api;