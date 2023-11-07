import mongoose from "mongoose";
const {Schema,model} = mongoose;

const messageSchema = new Schema(
    {

        senderId:{
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        recipientld:{
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        text:{
            type:String,
            required:true
        },
        isRead:{
            type:Boolean,
            default:false,
            required:true
        }
    },
    {
        timestamps:true
    }
);
export default model ("Message", messageSchema);