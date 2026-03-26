import { getChannelStats } from '../../../backend/src/controllers/dashboard.controller';
import api from './api';

const dashboardService = {
    getChannelStats:()=>{
        return api.get('/dashboard/stats')
    },
    getChannelVideos:(channelId)=>{
        return api.get(`/dashboard/videos/${channelId}`)
    }
};

export default dashboardService;
