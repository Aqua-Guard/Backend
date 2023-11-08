import Commande from "../models/commande.js";
import Panier from "../models/panier.js";
//import User from "../models/user.js";
import { deleteOne } from "./panier.js";

export async function addOnce(req, res) {
  const { _id, panierId, userId } = req.body;

  try {
    const panier = await Panier.findOne({ _id: panierId });
    if (!panier) {
      res.status(404).json({ error: "Panier not found." });
      return;
    }

    let Listproduits=[]
    for (const produit of panier.Listproduits) {
      Listproduits.push(produit);
    }
    const nbpoints = calculateNbPoints(Listproduits);

    const newCommande = await Commande.create({
      _id,
      panierId,
      Listproduits,
      userId,
      nbpoints,
    });

    res.status(201).json({ Commande: newCommande });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create the Commande." });
  }
}

function calculateNbPoints(listProduits) {
  let nbpoints = 0;
  for (const produit of listProduits) {
    nbpoints += produit.nbpoints;
  }
  return nbpoints;
}

/*export async function validerCommande(panierId, userid, nbpoints, res) {
  try {
    if (userid.points < nbpoints) {
      await deleteOne(panierId);
      const user = await User.findOne({ _id: userid._id });
      if (user) {
        user.points-=nbpoints;
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
}*/
