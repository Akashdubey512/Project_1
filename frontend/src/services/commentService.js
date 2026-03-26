import { addComment, updateComment } from '../../../backend/src/controllers/comment.controller';
import api from './api';

 const commentService = {
    getVideoComments:(videoId,params)=>{  
        return api.get(`/comments/video/${videoId}`, { params })
     },
     addComment:(videoId,content)=>{
        return api.post(`/comments/${videoId}`,{content})
     },
     updateComment:(commentId,content)=>{
        return api.patch(`/comments/c/${commentId}`,{content})
     },
     deleteComment:(commentId)=>{
        return api.delete(`/comments/c/${commentId}`)
     },
};

export default commentService
