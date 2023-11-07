import Panier from "../models/panier.js";
import Produit from "../models/produit.js";

export function addOnce(req, res) {
  // Assuming you have an array of product IDs that you want to add to the Panier
  const productIdsToAdd = req.body.productIdsToAdd;

  // Fetch the products from the Produit schema based on the provided product IDs
  Produit.find({ _id: { $in: productIdsToAdd } })
    .then((productsToAdd) => {
      // Fetch the existing Panier or create a new one if it doesn't exist
      Panier.findOne()
        .then((panier) => {
          if (!panier) {
            const newPanier = new Panier({
              Listproduits: productsToAdd,
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
