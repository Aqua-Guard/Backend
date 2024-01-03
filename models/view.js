import mongoose from "mongoose";
const { Schema, model } = mongoose;

const viewsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        actualiteId: {
            type: Schema.Types.ObjectId,
            ref:"actualite",
            required: true
        },
        like: {
            type:Number ,
            required: false,
          
        },
        comment: {
            type: String,
            required: false,
          
        },

    },
    {
        timestamps: true
    }
);
export default model("Views", viewsSchema);