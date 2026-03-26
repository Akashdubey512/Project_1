import api from './api';

export const videoService = {
    getAllVideos: async (params = {}) => {
        const response = await api.get('/videos', { params });
        return response.data;
    },
    
    getVideoById: async (videoId) => {
        const response = await api.get(`/videos/${videoId}`);
        return response.data;
    },
    
    uploadVideo: async (formData) => {
        const response = await api.post('/videos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    updateVideo: async (videoId, formData) => {
        const response = await api.patch(`/videos/${videoId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    deleteVideo: async (videoId) => {
        const response = await api.delete(`/videos/${videoId}`);
        return response.data;
    },
    
    togglePublishStatus: async (videoId) => {
        const response = await api.patch(`/videos/toggle-publish/${videoId}`);
        return response.data;
    }
};
