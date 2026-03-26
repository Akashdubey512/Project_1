import api from './api';

 const videoService = {
   getAllVideos:(params)=>{
        return api.get('/videos', { params })
   },
   getVVideoById:(id)=>{
        return api.get(`/videos/${id}`)
   },
   publishVideo:(FormData)=>{
    return api.post('/videos',FormData)
   },
   updateVideo:(videoId,FormData)=>{
    return api.patch(`/videos/${videoId}`, FormData)
   },
   deleteVideo:(videoId)=>{
    return api.delete(`/videos/${videoId}`)
   },
    togglePublishStatus:(videoId)=>{ 
    return api.patch(`/videos/toggle-publish/${videoId}`)
    }

};

export default videoService
