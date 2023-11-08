import mongoose from "mongoose";
const { Schema, model } = mongoose;

const participationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "event",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default model('Participation', participationSchema);