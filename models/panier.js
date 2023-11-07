import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const panierSchema = new Schema(
    {
        panierId:{
            type: Schema.Types.ObjectId,
            ref: "panier",
            required: true
        },
        Listproduit:{
            type:Array,
            required:true
        },
    },
    {
        timestamps: true
    }
);

export default model('Panier', panierSchema);