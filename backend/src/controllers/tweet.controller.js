import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content ||content.trim()==""){
        throw new ApiError(400,"Provide the content for tweet");
    }

    const tweet = await Tweet.create(
        {
            content:content.trim(),
            owner:req.user?._id
        }
    )

    if(!tweet){
        throw new ApiError(500,"Failed to create tweet");
    }

    return res
    .status(201)
    .json(new ApiResponse(201,tweet,"Tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user ID");
    }

    const tweets =await Tweet.find({ owner: userId })
    .select("content owner createdAt")
    .populate("owner", "username")
    .sort({ createdAt: -1 })
    .lean();


    return res
    .status(200)
    .json(new ApiResponse(200,tweets,"User tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet ID");
    }

    if(!content ||content.trim()==""){
        throw new ApiError(400,"Provide the content for tweet");
    }

    const tweet = await Tweet.findOneAndUpdate(
        {_id:tweetId,owner:req.user?._id},
        {content:content.trim()},
        {new:true}
    )

    if(!tweet){
        throw new ApiError(404,"Tweet not found or not authorized");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,null,"Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"invalid tweet id")
    }

    const tweet =await Tweet.findOneAndDelete(
        {_id:tweetId,owner:req.user?._id}
    )
    if(!tweet){
        throw new ApiError(404,"Tweet not found or not authorized")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,null,"Tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}