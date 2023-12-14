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
        image: {
            type: String,
            required: false,
        }


    },
    {
        timestamps: true
    }
);
export default model("Discution", discutionSchema);