import Commandes from "../models/commande.js";
import Paniers from "../models/panier.js";
import Users from "../models/user.js";
import Produit from "../models/produit.js";


export function getAll(req, res) {
  Commande.find()
    .then((commande) => res.status(200).json({ Commande: commande }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to get the products." });
    });
}

export function getOne(req, res) {
  Commande.findById(req.params.id)
    .then((commande) => res.status(200).json({ Commande: commande }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to get the product." });
    });
}

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

export async function passerCommande(req, res) {
  const userId = req.body.userId;
  const panierId = req.body.panierId;
  const commandeId = req.body.commandeId;
  try {
    const commande = await Commandes.findOne({ _id: commandeId });
    const user = await Users.findOne({ _id: userId });
    const panier = await Paniers.findOne({ _id: panierId });
    const listProduits = panier.ListProduits;

    if (!commande || !user || !panier) {
      res.status(404).json({ error: "Commande, User, or Panier not found." });
      return;
    }

    const produitIdCounts = {};

    listProduits.forEach((produitId) => {
      produitIdCounts[produitId] = (produitIdCounts[produitId] || 0) + 1;
    });

    console.log("ProduitId Occurrences:", produitIdCounts);

    if (user.nbPts >= commande.nbpoints) {
      await Paniers.deleteOne({ _id: panierId });
      user.nbPts -= commande.nbpoints;
      await user.save();
      for (const produitId in produitIdCounts) {
        const produit = await Produit.findOne({ _id: produitId });
        if (produit) {
          produit.quantite -= produitIdCounts[produitId];
          await produit.save();
        }
      }

      res.status(200).json({ message: "Commande passée avec succès." });
    } else {
      res.status(500).json({ error: "Points insuffisants." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}






