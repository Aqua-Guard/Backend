import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const panierSchema = new Schema(
    {
        _id:{
            type: Schema.Types.ObjectId,
            ref: "panier",
            required: true
        },
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