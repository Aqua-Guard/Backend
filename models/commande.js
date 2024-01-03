import mongoose from 'mongoose';


const { Schema, model } = mongoose;

const commandeSchema = new Schema(
  {
    selectedProducts: [
      {
        produit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Produit',
        },
        quantity: Number,
        name: String,
        price: Number,
        image: String,
        description: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

export default model('Commande', commandeSchema);