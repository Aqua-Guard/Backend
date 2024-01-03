import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reclamationSchema = new Schema(
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
        answered: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);
export default model("Reclamation", reclamationSchema);