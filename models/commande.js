import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const panierSchema = new Schema(
    {
        totalpoints:{
            type:Number,
            required:true
        },
    },
    {
        timestamps: true
    }
);
export default model('Panier', panierSchema);