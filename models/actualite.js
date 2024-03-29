import mongoose from "mongoose";
const { Schema, model } = mongoose;

const actualiteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        views: {
            type: Number,
            required: true,
            default: 0
        },
        like: {
            type: Number,
            required: true,
            default: 0
        },
        dislike: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);
export default model("Actualite", actualiteSchema);