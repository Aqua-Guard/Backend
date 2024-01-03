import express from "express";
import Commande from "../models/commande.js";
import Produit from"../models/produit.js";
import { createCommande } from "../controllers/commande.js";




const router = express.Router();
router.post('/',createCommande);
router.get('/')

export default router;




