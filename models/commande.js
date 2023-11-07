import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const panierSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        commandeId: {
            type: Schema.Types.ObjectId,
            ref: "commande",
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
export default model('Panier', panierSchema);