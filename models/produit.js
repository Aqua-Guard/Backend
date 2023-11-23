import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const produitSchema = new Schema(
    {   
        idProduit:{
            type:String,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
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