import mongoose from "mongoose";
const { Schema, model } = mongoose;

const discutionSchema = new Schema(
    {

        reclamationId: {
            type: Schema.Types.ObjectId,
            ref: "reclamation",
            required: true
        },
        userRole: {
            type: String,
            required: true
        },
      
        message: {
            type: String,
            required: false,
        },
        visibility: {
            type: Boolean,
            required: false,
            default: true, 
        },

    },
    {
        timestamps: true
    }
);
export default model("Discution", discutionSchema);