import mongoose, {Schema} from "mongoose";

const likesSchema = new Schema({
comment:{
    type: Schema.Types.ObjectId,
    ref: "Comment"
},
video:{
    type: Schema.Types.ObjectId,
    ref: "Video"
},

tweet:{
    type: Schema.Types.ObjectId,
    ref:"Tweet"
},
likedBy:{
    type: Schema.Types.ObjectId,
    ref:"User",
    required:true
}
},{ timestamps: true });

likesSchema.pre("validate", function (next) {
  const targets = [this.video, this.comment, this.tweet].filter(Boolean);
  if (targets.length !== 1) {
    return next(new Error("Like must reference exactly one target"));
  }
  next();
});

likesSchema.index(
  { likedBy: 1, video: 1 },
  { unique: true, partialFilterExpression: { video: { $exists: true } } }
);
likesSchema.index(
  { likedBy: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);
likesSchema.index(
  { likedBy: 1, tweet: 1 },
  { unique: true, partialFilterExpression: { tweet: { $exists: true } } }
);

export const Likes = mongoose.model("Likes", likesSchema);