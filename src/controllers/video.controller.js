import mongoose,{isValidObjectId} from "mongoose";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import fs from "fs"
const getAllVideos = asyncHandler(async (req,res)=>{
 
     const { page = 1, limit =10, query, sortBy, sortType, userId} = req.query
     const pageNum=parseInt(page);
     const limitNum=parseInt(limit);
     const skip=(page-1)*limit;

     const videos = await Video.find()
     .skip(skip)
     .limit(limitNum);
 
     const totalVideos = await Video.countDocuments();

     res.status(200)
     .json(new ApiResponse(
        true,
         "Videos fetched successfully",
        {
            page: pageNum,
            limit: limitNum,
            videos,
            totalVideos,
            totalPages: Math.ceil(totalVideos/limitNum)
        }
        ))
})

const publishAVideo = asyncHandler(async (req, res) => {
   
     const { title, description} = req.body
     // TODO: get video, upload to cloudinary, create video
    
     if (!title?.trim()) {
         throw new ApiError(400, "Title is required")
     }
     const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnailImage[0]?.path
 
     if(!videoLocalPath){
         throw new ApiError(400, "Video file is required")
     }
     if(!thumbnailLocalPath){
         throw new ApiError(400, "Thumbnail image is required")
     }
     const videoUploadResponse = await uploadOnCloudinary(videoLocalPath,"video")
     const thumbnailUploadResponse = await uploadOnCloudinary(thumbnailLocalPath)
     if(!videoUploadResponse?.secure_url){
         throw new ApiError (500, "Failed to upload video on cloudinary")
     }
     if(!thumbnailUploadResponse?.secure_url){
        await deleteFromCloudinary(videoUploadResponse.public_id);
         throw new ApiError (500, "Failed to upload thumbnail on cloudinary")
     }
     const videoPublicId= videoUploadResponse.public_id
     const thumbnailPublicId= thumbnailUploadResponse.public_id
     const newVideo = await Video.create({
         title,
         description,
         videoFile: videoUploadResponse?.secure_url,
         thumbnail: thumbnailUploadResponse?.secure_url,
         owner: req.user._id,
        videoPublicId,
        thumbnailPublicId

     })
 
     res.status(201)
     .json(
         new ApiResponse(
         true,
         "Video published successfully",
         newVideo
         )
     )
  
})

const getVideoById = asyncHandler(async (req, res) => {
     //TODO: get video by id
    //Validate videoId
    //Check if video exists
    //Return video details
    //Increment view count
    //Add to watch history if user is logged in
    //is user liked the video
    //is user subscribed 
    //total likes total views total comments 
    //total subscriberscount
    //Populate owner details
    //Return response

    const { videoId} = req.params
    const user=req.user
   
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoid is not valid");
    }

    const video=await Video.findById(videoId)
    .populate("owner","fullName username avatar");

    if(!video){
        throw new ApiError(404,"video not found");
    }

    if(!video.isPublished){
        if(!user){
        throw new ApiError(403,"You are not allowed to view this video")
        }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to view this video");
     }   
     }

     await Video.findByIdAndUpdate(
        videoId,
        {
            $inc:{views:1}
        }
     )

     if(user){
        await user.findByIdAndUpdate(user._id,{
            $addToSet:{watchHistory:videoId}
        });
     }

     const totalLikes = await Likes.countDocuments({ video: videoId });
     const totalComments = await Comment.countDocuments({ video: videoId });

     let isLiked =false;
     let isSubscribed=false;

     if(user){
        isLiked=!!(await Likes.findOne({
            video:videoId,
            likedBy:user._id
        }))
     isSubscribed = !!(await Subscription.findOne({
      channel: video.owner._id,
      subscriber: user._id
    }));
     }

     const response = {
        video:{
            _id:videoId,
            title:video.title,
            description:video.description,
            videoFile:video.videoFile,
            thumbnail:video.thumbnail,
            duration:video.duration,
            views:video.views+1,
            createdAt:video.createdAt,
            owner:video.owner
        },
        stats:{
            totalLikes,
            totalComments
        },
        userState:{
            isLiked:!!userLike,
            isSubscribed:!!userSubscription
        }
     }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "Video fetched successfully"
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
