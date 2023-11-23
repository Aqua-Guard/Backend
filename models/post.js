import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PostSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        nbLike: {
            type: Number,
            default: 0
        },
        nbComments: {
            type: Number,
            default: 0
        },
        nbShare: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    }
);

export default model('Post', PostSchema);