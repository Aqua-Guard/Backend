import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CommandeSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "commande",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        panierId: {
            type: Schema.Types.ObjectId,
            ref: "panier",
            required: true
        },
        nbpoints:{
            type:Number,
            required:true
        }
    },
    {
        timestamps: true
    }
);
export default model('Commande', CommandeSchema);