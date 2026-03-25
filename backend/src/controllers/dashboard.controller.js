import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Likes} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params
    const user = req.user
     if(!user) {
        throw new ApiError(401, "Unauthorized")
    }
     if(!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }
     if(!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
     if(user._id.toString() !== channelId) {
        throw new ApiError(403, "You are not authorized to view this channel's stats")
    }
    
   
   
   const [totalVideos, totalSubscribers, totalViews, videoIds] =
        await Promise.all([
            Video.countDocuments({ owner: channelId }),
            Subscription.countDocuments({ channel: channelId }),
            Video.aggregate([
                { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
                { $group: { _id: null, totalViews: { $sum: "$views" } } }
            ]),
            Video.find({ owner: channelId }).distinct("_id")
        ])
    const totalLikes = await Likes.countDocuments({ 
        video: { $in: videoIds } 
    })
   return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalSubscribers,
                totalViews: totalViews[0]?.totalViews || 0,
                totalLikes
            },
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.params
    const user = req.user

    if(!user) {
        throw new ApiError(401, "Unauthorized")
    }

    if(!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }

    if(!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    if(user._id.toString() !== channelId) {
        throw new ApiError(403, "You are not authorized to view this channel's videos")
    }
    const channelExists = await User.findById(channelId)
    if(!channelExists) {
        throw new ApiError(404, "Channel not found")
    }


    
const { page = 1, limit = 10 } = req.query
const videos = await Video.find({ owner: channelId })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })

    if(!videos || videos.length === 0) {
    return res.status(200).json(
        new ApiResponse(200, { videos: [] }, "No videos found")
    )
}

    return res.status(200).json(
        new ApiResponse(
            200,
            { videos },
            "Channel videos fetched successfully"
        )
    )

})

export {
    getChannelStats, 
    getChannelVideos
    }