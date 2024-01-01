/*import express from "express";
import Commande from "../models/commande.js";
import Produit from"../models/produit.js";
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arafetksiksi7@gmail.com', 
    pass: 'klsa cxrc jgda utiv', 
  },
});
const router = express.Router();



router.post('/', async (req, res) => {
  const userId = "arafet"
  try {
    const { selectedProducts } = req.body;

    // Calculate the total price based on the products in selectedProducts
    const totalPrice = selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    const newCommande = new Commande({ selectedProducts, totalPrice, userId });
    const savedCommande = await newCommande.save();
    res.status(201).json(savedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.post('/add-products', async (req, res) => {
  try {
    const userId = '654e0094cbe34d1a1ddb2e56';
    const produitId = req.query.produitId;

    let commande = await Commande.findOne({ userId });

    if (!commande) {
      const newCommande = new Commande({ userId, selectedProducts: [], totalPrice: 0 });
      commande = await newCommande.save();
    }

    const existingProductIndex = commande.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit.toString() === produitId
    );

    if (existingProductIndex !== -1) {
      commande.selectedProducts[existingProductIndex].quantity += 1;
    } else {
      const produit = await Produit.findById(produitId);

      if (!produit) {
        return res.status(404).json({ error: 'Product not found' });
      }

      commande.selectedProducts.push({
        produit,
        quantity: 1,
        title: produit.title,
        price: produit.price,
        image: produit.image,
      });
    }

    const totalPrice = commande.selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    commande.totalPrice = totalPrice;

    const updatedCommande = await commande.save();
    res.json(updatedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});*/




