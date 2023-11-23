import mongoose from "mongoose";
const { Schema, model } = mongoose;

const participationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default model('Participation', participationSchema);