import mongoose,{Schema} from "mongoose";   
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
        videoFile:{
            type:String,//cloudnary url
            required:true
        },
        thumbnail:{
            type:String,//cloulnary url
            required:true
        },
        videoPublicId:{
            type:String,
            required:true
        },
        thumbnailPublicId:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,//cloulnary url
            default:0
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
{
    timestamps:true
}
)

videoSchema.index({ owner: 1 });//for sorting videos by user
videoSchema.index({ createdAt: -1 });//for latest videos
videoSchema.index({ title: "text", description: "text" });//for text search

videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model("Video",videoSchema);