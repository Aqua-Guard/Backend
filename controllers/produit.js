import Produit from "../models/produit.js";

export function addOnce(req, res) {
  const { _id ,name, nbpoints, quantite, description } = req.body;
  const isEnabled = checkEnabled(quantite);

  Produit.create({
    _id,
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

export function getAll(req, res) {
  Produit.find()
    .then((produits) => res.status(200).json({ Produits: produits }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to get the products." });
    });
}


export function getOne(req, res) {
  Produit.findById(req.params.id)
    .then((produit) => res.status(200).json({ Produit: produit }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to get the product." });
    });
}

export function updateOne(req, res) {
  const { name, nbpoints, quantite, description } = req.body;

  Produit.findByIdAndUpdate(
    req.params.id, 
    {
      $set: {
        name,
        nbpoints,
        quantite,
        description,
        isEnabled: checkEnabled(quantite),
      },
    },
    { new: true } // Return the updated document
  )
    .then((updatedProduit) => {
      if (updatedProduit) {
        res.status(200).json({ Produit: updatedProduit });
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to update the product." });
    });
}

export function deleteOne(req, res) {
  Produit.findByIdAndDelete(req.params.id)
    .then((deletedProduit) => {
      if (deletedProduit) {
        res.status(200).json({ Produit: deletedProduit });
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the product." });
    });
}

function checkEnabled(quantite) {
  return quantite === 0 ? false : true;
}
