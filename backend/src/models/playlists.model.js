import mongoose, {Mongoose, Schema} from "mongoose";

const playlistSchema = new Schema({
    name:{
        type:"string",
        required:true
    },
    description:{
        type:"string",
        required:true
    },
    videos:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

playlistSchema.index({ owner: 1, createdAt: -1 })
playlistSchema.index({ videos: 1 })

export const Playlist = Mongoose.model("Playlist",playlistSchema);