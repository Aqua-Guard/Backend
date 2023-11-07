import Produit from "../models/produit.js";

export function addOnce(req, res) {
  const { name, nbpoints, quantite, description } = req.body;
  const isEnabled = checkEnabled(quantite);

  Produit.create({
    name,
    nbpoints,
    quantite,
    description,
    isEnabled
  })
    .then((newProduit) => res.status(201).json({ Produit: newProduit }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to create the product." });
    });
}
function checkEnabled(quantite) {
  return quantite === 0 ? false : true;
}