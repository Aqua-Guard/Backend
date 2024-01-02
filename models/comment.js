import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
        },
        comment: {
            type: String,
            required: true
        },
        // aded for flutter 
        //discrimination: {
        //    type: Boolean,
        //    default: false,
       // }
    },
    {
        timestamps: true
    }
);

export default model('Comment', CommentSchema);