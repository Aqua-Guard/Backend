import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const produitSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        nbpoints: {
            type: Number,
            required: true
        },
        quantite: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        isEnabled :{
            type: Boolean,
            default: true,
            required : true 
        },
        
    },
    {
        timestamps: true
    }
);

export default model('Produit', produitSchema)