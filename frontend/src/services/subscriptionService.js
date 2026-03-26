import api from './api';

export const subscriptionService = {
    toggleSubscription: async (channelId) => {
        const response = await api.post(`/subscriptions/toggle/${channelId}`);
        return response.data;
    },
    
    getUserChannelSubscribers: async (channelId) => {
        const response = await api.get(`/subscriptions/subscribers/${channelId}`);
        return response.data;
    },
    
    getSubscribedChannels: async (subscriberId) => {
        const response = await api.get(`/subscriptions/subscribed/${subscriberId}`);
        return response.data;
    }
};
