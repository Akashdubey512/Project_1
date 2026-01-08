import mongoose,{isValidObjectId} from "mongoose";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {deleteFromCloudinary} from "../utils/cloudinary.js"
import {Likes} from "../models/like.model.js"
import {Comment} from "../models/comment.model.js"
import {Subscription} from "../models/subscription.model.js"
const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (query) {
        filter.$text = { $regex: query, $options: "i" }; 
    }

    if (userId) {
        filter.owner = userId;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

    const totalVideos = await Video.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            true,
            "Videos fetched successfully",
            {
                page: pageNum,
                limit: limitNum,
                videos,
                totalVideos,
                totalPages: Math.ceil(totalVideos / limitNum)
            }
        )
    );
});


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
            isLiked:!!isLiked,
            isSubscribed:!!isSubscribed
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
    const { videoId } = req.params;
    const { title, description } = req.body;

    // Validate that at least one field is being updated
    if (!title?.trim() && !description?.trim() && !req.file) {
        throw new ApiError(400, "At least one field (title, description, or thumbnail) is required");
    }

    // Find video and check existence
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check authorization
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    // Update fields if provided
    if (title?.trim()) {
        video.title = title.trim();
    }
    if (description?.trim()) {
        video.description = description.trim();
    }

    // Handle thumbnail upload if present
    if (req.file) {
        // Delete old thumbnail from cloudinary if it exists
        if (video.thumbnail) {
          const thumbnail = await deleteFromCloudinary(video.thumbnailPublicId);
            if (!thumbnail) {
                throw new ApiError(500, "Failed to delete old thumbnail from Cloudinary");
            }
        }
        const thumbnailUpload = await uploadOnCloudinary(req.file.path);
        if(!thumbnailUpload){
            throw new ApiError(500, "Failed to upload new thumbnail to Cloudinary");
        }
        video.thumbnail = thumbnailUpload.url;
        video.thumbnailPublicId = thumbnailUpload.public_id;
    }

    await video.save({ validateBeforeSave: true });
    const updatedVideo = video.toObject();
    delete updatedVideo.thumbnailPublicId; 
    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const user = req.user
    //TODO: delete video
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    if(video.owner.toString() !== user._id.toString()){
        throw new ApiError(403,"You are not authorized to delete this video");
    }


 if (video.videoPublicId) {
        try {
            await deleteFromCloudinary(video.videoPublicId, "video");
        } catch (error) {
            console.error("Failed to delete video from Cloudinary:", error);
        }
    }

     if (video.thumbnailPublicId) {
        try {
            await deleteFromCloudinary(video.thumbnailPublicId, "image");
        } catch (error) {
            console.error("Failed to delete thumbnail from Cloudinary:", error);
        }
    }

    await Promise.allSettled([
        Likes.deleteMany({video: videoId }),
        Comment.deleteMany({video: videoId }),
    ]);

   try {
        await video.deleteOne();
    } catch (err) {
        console.error("DB delete failed:", err);
        throw new ApiError(500, "Failed to delete video from database");
    }

return res.status(200).json(
    new ApiResponse(
        200,
        null,
        "Video deleted successfully"
    )
)
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const user = req.user

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }

    if(video.owner.toString() !== user._id.toString()){
        throw new ApiError(403,"You are not authorized to change publish status of this video");
    }
const newStatus = !video.isPublished;   
await video.updateOne({ isPublished: !video.isPublished });

    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: newStatus },
            "Video publish status updated successfully"
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
