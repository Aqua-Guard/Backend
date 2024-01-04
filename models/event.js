import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        
    },
    DateDebut: {
        type: Date,
        required: true
    },
    DateFin: {
        type: Date,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    lieu: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

export default model('Event', eventSchema);