import express from "express";
import Commande from "../models/commande.js";

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { selectedProducts, totalPrice } = req.body;

    const newCommande = new Commande({
      selectedProducts,
      totalPrice,
    });

    await newCommande.save();

    res.status(201).json({ message: 'Command created successfully', commande: newCommande });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the command' });
  }
});

export default router;