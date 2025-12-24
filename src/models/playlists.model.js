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

},{timeseries:true})

export const Playlist = Mongoose.model("Playlist",playlistSchema);