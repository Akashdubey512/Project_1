import api from './api';

const tweetService = {
    createTweet:(data)=>{
        return api.post("/tweets",data);
    },
    getUserTweets:(userId)=>{
        return api.get(`/tweets/user/${userId}`);
    },
    updateTweet:(tweetId,data)=>{
        return api.patch(`/tweets/${tweetId}`,data);
    },
    deleteTweet:(tweetId)=>{
        return api.delete(`/tweets/${tweetId}`);
    }
};

export default tweetService;
