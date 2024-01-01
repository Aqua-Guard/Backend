import express from "express";
import Commande from "../models/commande.js";
import Produit from"../models/produit.js";
import nodemailer from 'nodemailer';
import { createCommande } from "../controllers/commande.js";




const router = express.Router();
router.post('/',createCommande);

export default router;




