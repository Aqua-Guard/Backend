import Panier from "../models/panier.js";

export function addOnce(req, res) {
  const { } = req.body;

  Panier.create({
  })
    .then((newPanier) => res.status(201).json({ Panier: newPanier }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to create the product." });
    });
}
