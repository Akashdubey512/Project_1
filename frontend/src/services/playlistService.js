import { createPlaylist } from '../../../backend/src/controllers/playlist.controller';
import api from './api';

const playlistService = {
   createPlaylist:(data)=>{
    return api.post('/playlists',data)
   },
    getUserPlaylists:(userId)=>{
        return api.get(`/playlists/user/${userId}`)
    },
    getPlaylistById:(playlistId)=>{
        return api.get(`/playlists/${playlistId}`)
    },
    addVideoToPlaylist:(playlistId,videoId)=>{
        return api.post(`/playlists/${playlistId}/video/${videoId}`)
    },
    removeVideoFromPlaylist:(playlistId,videoId)=>{
        return api.delete(`/playlists/${playlistId}/video/${videoId}`)
    },
    deletePlaylist:(playlistId)=>{
        return api.delete(`/playlists/${playlistId}`)
    },
    updatePlaylist:(playlistId,data)=>{
        return api.patch(`/playlists/${playlistId}`,data)
     }

};

export default playlistService;
