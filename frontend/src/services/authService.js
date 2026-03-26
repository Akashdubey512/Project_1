import api from './api';

export const authService = {
    register: async (formData) => {
        // formData since it includes avatar/coverImage
        const response = await api.post('/users/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        return response.data;
    },
    
    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },
    
    getCurrentUser: async () => {
        const response = await api.get('/users/current-user');
        return response.data;
    },
    
    changePassword: async (passwords) => {
        const response = await api.post('/users/change-password', passwords);
        return response.data;
    },
    
    updateProfile: async (details) => {
        const response = await api.patch('/users/update-account', details);
        return response.data;
    },
    
    getChannelProfile: async (username) => {
        const response = await api.get(`/users/c/${username}`);
        return response.data;
    },
    
    getWatchHistory: async () => {
        const response = await api.get('/users/history');
        return response.data;
    }
};
