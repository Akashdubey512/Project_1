import api from './api';

const authService = {
   
    register: (FormData)=>{
        return api.post('/users/register', FormData)
    },
    login:(FormData)=>{
        return api.post('/users/login',FormData)
    },
    logout:()=>{
        return api.post('/users/logout')
    },
    refreshToken:()=>{
        return api.post('/users/refresh-token')
    },
    updateProfile:()=>{
        return api.patch('/users/update-account',data)
    },
    changePassword:(data)=>{
        return api.post('/users/change-password',data)
    },
    updateAvatar:(formData)=>{
        return api.patch('/users/avtar',formData)
    },
    updateCoverImage:(FormData)=>{
        return api.patch('/users/cover-image',FormData)
    },
    getChannelProfile:(username)=>{
        return api.get(`/users/c/${username}`)
    },
    getWatchHistory:()=>{
        return api.get('/users/history')
    }
};

export default authService
