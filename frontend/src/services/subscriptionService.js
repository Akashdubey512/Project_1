import api from './api';

const subscriptionService = {
   toggleSubscription:(channelId)=>{
    return api.post(`/subscriptions/toggle/${channelId}`)
   },
   getUserChannelSubscribers:(channelId)=>{
    return api.get(`/subscriptions/subscribers/${channelId}`)
   },
    getSubscribedChannels:(subscriberId)=>{
    return api.get(`/subscriptions/subscribed/${subscriberId}`)
   }
};

export default subscriptionService;
