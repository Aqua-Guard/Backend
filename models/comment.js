import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
        ref: "post",
        required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Comment', CommentSchema);