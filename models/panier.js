import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const panierSchema = new Schema(
    {
        Listproduits:{
            type:Array,
            required:true
        },
    },
    {
        timestamps: true
    }
);

export default model('Panier', panierSchema);