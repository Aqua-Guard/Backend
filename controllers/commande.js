import Commande from "../models/commande.js";
import Produit from "../models/produit.js";
import Panier from "../models/panier.js";
import User from "../models/user.js";
import { deleteOne } from "./panier.js";

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
      nbpoints,
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
    const donneesProduit = await Produit.findOne({ _id: produit._id });
    if (donneesProduit) {
      nbpoints += donneesProduit.points;
    }
  }
  return nbpoints;
}

export async function validerCommande(panierId, userid, nbpoints, res) {
  try {
    if (userid.points < nbpoints) {
      await deleteOne(panierId);
      const user = await User.findOne({ _id: userid._id });
      if (user) {
        user.points--;
        await user.save();
        res.status(200).json({ message: "Commande validée." });
      } else {
        res.status(500).json({ error: "User not found." });
      }
    } else {
      res.status(500).json({ error: "Points insuffisants." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
