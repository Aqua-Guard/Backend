import Commande from "../models/commande.js";
import Produit from "../models/produit.js";
import User from "../models/user.js";

export const createCommande = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { userId, selectedProducts, totalPrice } = req.body; 
    const newCommande = new Commande({ userId, selectedProducts, totalPrice });
    const savedCommande = await newCommande.save();
    const user = await User.findById(userId); 
    user.nbPts -= totalPrice;
    await user.save(); 
    const productCount = {}; 
    for (const product of selectedProducts) {
      if (productCount[product]) {
        productCount[product] += 1;
      } else {
        productCount[product] = 1;
      }
    
      const foundProduct = await Produit.findById(product);
      if (foundProduct) {
        const quantityToReduce = productCount[product];
        foundProduct.quantity -= quantityToReduce;
        foundProduct.nbsales += quantityToReduce;
        await foundProduct.save();
      }
    }
    // Logging the occurrences of each product
    console.log('Product occurrences:', productCount);

    res.status(201).json(savedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    res.json(commande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createCommande,
  getCommandeById,
};