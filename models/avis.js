import mongoose from "mongoose";
const { Schema, model } = mongoose;

const avisSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        actualiteTitle: {
            type: Schema.Types.ObjectId,
            ref:"actualite",
            required: true
        },
        avis: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);
export default model("Avis", avisSchema);