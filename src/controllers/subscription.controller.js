import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { useId } from "react"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const user=req.user
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404,"Channel not found")
    }

    const toggle = await  Subscription.findOne({channel:channelId,subscriber:user});
    if(!toggle){
        throw new ApiError(500,"Something went wrong while toggling subscription")
    }

    if(toggle.length===0){
        const subscription = await Subscription.create({
            channel:channelId,
            subscriber:user
        })
        return res.status(200).json(new ApiResponse(200, subscription,"Subscription created successfully"))
    }
    else{
        const subscription = await Subscription.deleteOne({channel:channelId,subscriber:user})
        return res.status(200).json(new ApiResponse(200,null,"Subscription deleted successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const channel= await User.findOne(channelId);
    if(!channel){
        throw new ApiError(404,"Channel not found")
    }
    const subscribers= await Subscription.countDocuments({"channel":"channelId"});
    return res.status(200).json(
        new ApiResponse(200,subscribers,"Subscribers count fetched successfully")
    )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channels= await Subscription.find({
        "subscriber":"subscriberId"
    }).populate("channel")

    return res.status().json(new ApiResponse(200),channels,"Channels fetched successfully")
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}