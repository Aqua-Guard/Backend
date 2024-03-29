import Panier from "../models/panier.js";
import Produit from "../models/produit.js";

export function addOnce(req, res) {
  const productIdsToAdd = req.body.productIdsToAdd;

  Produit.find({ _id: { $in: productIdsToAdd } })
    .then((productsToAdd) => {
      Panier.findOne()
        .then((panier) => {
          if (!panier) {
            const newPanier = new Panier({
              Listproduits: productsToAdd,
              _id: req.body.panierId,
            });
            
            newPanier.save()
              .then((panier) => res.status(201).json({ Panier: panier }))
              .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Failed to create the Panier." });
              });
          } else {
            panier.Listproduits = panier.Listproduits.concat(productsToAdd);

            panier.save()
              .then((updatedPanier) => res.status(200).json({ Panier: updatedPanier }))
              .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Failed to update the Panier." });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch the Panier." });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products from Produit." });
    });
    
}