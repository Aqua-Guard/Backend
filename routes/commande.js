import express from "express";
import { createCommande } from "../controllers/commande.js";

const commandeRoutes = express.Router();

commandeRoutes.post('/',createCommande);
commandeRoutes.get('/')

export default commandeRoutes;




