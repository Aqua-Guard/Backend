import Produit from "../models/produit.js";

export function getAll(req, res) {
  Produit.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          _id: docs[i]._id,
          name: docs[i].name,
          description: docs[i].description,
          price: docs[i].price,
          quantity: docs[i].quantity,
          image: docs[i].image,
          category: docs[i].category,
        });
      }
      res.status(200).json(list);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
  console.log('Received POST request:', req.body);

  let productData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
  };

  if (req.file && req.file.filename) {
    productData.image = req.file.filename;
  }

  Produit.create(productData)
    .then((newProduit) => {
      console.log('New product created:', newProduit); // Log the created product
      res.status(201).json(newProduit); // Return the created product
    })
    .catch((err) => {
      console.error('Error creating product:', err); // Log any error during creation
      res.status(500).json({ error: err.message || 'Internal server error' }); // Return error response
    });
}


export function getOnce(req, res) {
  ProductId=req.body.id;
  Produit.findById(ProductId)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function putOnce(req, res) {
  const productId = req.body.id; // Accessing productId from req.body.id

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is missing in the request body' });
  }

  let updatedFields = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  if (req.file && req.file.filename) {
    updatedFields.image = req.file.filename;
  }

  console.log('Received PUT request for productId:', productId); // Logging the received productId
  console.log('Updated product details:', updatedFields); // Logging the updated product details

  Produit.findByIdAndUpdate(productId, updatedFields, { new: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.log('Updated product:', updatedProduct); // Log the updated product
      res.status(200).json(updatedProduct);
    })
    .catch((err) => {
      console.error('Error updating product:', err); // Log any error during the update
      res.status(500).json({ error: err.message || 'Internal server error' });
    });
}




export function deleteOnce(req, res) {
  const productId = req.body.id; 
  Produit.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}