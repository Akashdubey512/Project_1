import { getLikedVideos, toggleTweetLike } from '../../../backend/src/controllers/like.controller';
import api from './api';

const likeService = {
   toggleVideoLike:(videoId)=>{
        return api.post(`/likes/toggle/v/${videoId}`)
   },
   toggleCommentLike:(commentId)=>{
    return api.post(`/likes/toggle/c/${commentId}`)
   },
   toggleTweetLike:(tweetId)=>{
    return api.post(`/likes/toggle/t/${tweetId}`)
   },
   getLikedVideos:()=>{
    return api.get('/likes/videos')
   }

};

export default likeService
