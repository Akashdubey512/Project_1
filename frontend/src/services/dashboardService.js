import api from './api';

export const dashboardService = {
    getChannelStats: async (channelId) => {
        // According to routes: /dashboard/stats/:channelId
        const response = await api.get(`/dashboard/stats/${channelId}`);
        return response.data;
    },
    
    getChannelVideos: async (channelId) => {
        const response = await api.get(`/dashboard/videos/${channelId}`);
        return response.data;
    }
};
