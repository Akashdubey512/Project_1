import mongoose, {isValidObjectId} from "mongoose"
import {Likes} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!req.user){
        throw new ApiError(401, "User not authenticated")
    }
    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
    }


    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Likes.findOne({video:videoId, likedBy: req.user._id})
    if(existingLike){
        await Likes.findOneAndDelete({ video:videoId, likedBy: req.user._id });
         return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Video unliked")
        );
    }
    await Likes.create({video:videoId, likedBy: req.user._id})
    return res
    .status(200)
    .json(
        new ApiResponse(200, { liked: true }, "Video liked")
    );})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
if(!req.user){
    throw new ApiError(401, "User not authenticated")
}

if (!commentId) {
    throw new ApiError(400, "commentId is required");
}
if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
}
const commentExists = await Comment.findById(commentId);
if (!commentExists) {
    throw new ApiError(404, "Comment not found");
}

const existingLike = await Likes.findOne({comment:commentId, likedBy: req.user._id})

if(existingLike){
    await Likes.findOneAndDelete({ comment:commentId, likedBy: req.user._id });
     return res.status(200).json(
        new ApiResponse(200, { liked: false }, "Comment unliked")
    );
}

await Likes.create({comment:commentId, likedBy: req.user._id})
return res
.status(200)
.json(
    new ApiResponse(200, { liked: true }, "Comment liked")
);})


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
if(!req.user){
    throw new ApiError(401, "User not authenticated")   
}
if (!tweetId) {
    throw new ApiError(400, "tweetId is required");
}
if(!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
}

const tweetExists = await Tweet.findById(tweetId);
if (!tweetExists) {
    throw new ApiError(404, "Tweet not found");
}


const existingLike = await Likes.findOne({tweet:tweetId, likedBy: req.user._id})
if(existingLike){
    await Likes.findOneAndDelete({ tweet:tweetId, likedBy: req.user._id });
     return res.status(200).json(
        new ApiResponse(200, { liked: false }, "Tweet unliked")
    );
}

await Likes.create({tweet:tweetId, likedBy: req.user._id})
return res
.status(200)
.json(
    new ApiResponse(200, { liked: true }, "Tweet liked")
);})



const getLikedVideos = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }

    const { page = 1, limit = 20 } = req.query;

    const likedDocs = await Likes.find({
        likedBy: req.user._id,
        video: { $exists: true }
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("video");

    const videos = likedDocs
        .map(doc => doc.video)
        .filter(v => v !== null);

    return res.status(200).json(
        new ApiResponse(
            200,
             videos,
              "Liked videos retrieved successfully"
            )
    );
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}