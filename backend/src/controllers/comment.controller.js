import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    //TODO: get all comments for a video
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const videoExists = await Video.exists({ _id: videoId })
    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(Math.max(1, parseInt(limit, 10) || 10), 100) 
     const options = {
        page: pageNum,
        limit: limitNum,
        sort: { createdAt: -1 },
        lean: true,
        leanWithId: false
    }

    const comments = await Comment.aggregatePaginate(
        Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
             {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id", 
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1,
                "owner.fullName": 1
            }
        }
        ]),
        options
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            comments, 
            "Comments fetched successfully"
        )
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body
    if (!req.user) {
        throw new ApiError(401, "User not authenticated")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const videoExists = await Video.exists({ _id: videoId })
    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    const newComment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })

    const populatedComment = await Comment.findById(newComment._id)
        .populate("owner", "username avatar")
        .lean()
        
    return res
    .status(201)
    .json(
        new ApiResponse(
            201, 
            populatedComment, 
            "Comment added successfully"
        )
    )
    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body

    if (!req.user) {
        throw new ApiError(401, "User not authenticated")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required")
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content: content.trim() },
        { new: true, runValidators: true }
    ).lean()
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            updatedComment, 
            "Comment updated successfully"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    if (!req.user) {
        throw new ApiError(401, "User not authenticated")
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }
    await Comment.findByIdAndDelete(commentId)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            null, 
            "Comment deleted successfully"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }