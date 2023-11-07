import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const panierSchema = new Schema(
    {
        produitId:{
            type: Schema.Types.ObjectId,
            ref: "produit",
            required: true
        },
        commandeId:{
            type: Schema.Types.ObjectId,
            ref: "commande",
            required: true
        },
        quantite:{
            type:Number,
            required:true
        }
    },
    {
        timestamps: true
    }
);

export default model('Panier', panierSchema);