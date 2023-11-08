import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
    },
    resetCode: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

export default model('User', userSchema);