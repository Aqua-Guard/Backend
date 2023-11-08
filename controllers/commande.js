import Commande from "../models/commande.js";
import Produit from "../models/produit.js";
import Panier from "../models/panier.js";
import { deleteOne } from "./controllers/panier.js";
export async function addOnce(req, res) {
  const { commandId, panierId } = req.body;

  try {
    const panier = await Panier.findOne({ _id: panierId });
    if (!panier) {
      res.status(404).json({ error: "Panier not found." });
      return;
    }
    const listProduits = panier.listProduit; 
    const nbpoints = await calculateNbPoints(listProduits);

    const newCommande = await Commande.create({
      commandId,
      listProduits,
      nbpoints
    });

    res.status(201).json({ Commande: newCommande });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create the Commande." });
  }
}
async function calculateNbPoints(listProduits) {
  let nbpoints = 0;
  for (const produit of listProduits) {
    const donnesProduit = await Produit.findOne({ _id: produit._id });
    if (donnesProduit) {
      nbpoints += donnesProduit.points;
    }
  }
  return nbpoints;
}

export function validerCommande(panierId) {
  deleteOne(panierId);
}
