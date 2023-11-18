import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const LikeSchema = new Schema(
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
    },
    {
        timestamps: true
    }
);

export default model('Like', LikeSchema);