import Produit from "../models/produit.js";

export function addOnce(req, res) {
  const { name, nbpoints, quantite, description } = req.body;
  const isEnabled = setEnabled(quantite);

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
function setEnabled(quantite) {
  return quantite === 0 ? false : true;
}